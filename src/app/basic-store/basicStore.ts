import {
  castImmutable,
  createDraft,
  Draft,
  finishDraft,
  Immutable,
  Patch
} from "immer";
import * as rfdc from "rfdc";
import { BehaviorSubject, ReplaySubject } from "rxjs";
import { filter, map } from "rxjs/operators";
import { ActionLike } from "./action";
import { createActionBuilder } from "./actionBuilder";
import { ActionWithError } from "./actionWithError";
import { DispatchOptions } from "./dispatcher";
import { ReducerMap, ReducerWithoutPayloadWithDispatch } from "./reducer";
import { Selector } from "./selector";
import { Transaction } from "./transaction";
import {
  InferActionCreatorMapFromReducerMap,
  InferActionReducerMapFromReducerMap,
  isPayloadAction
} from "./utilityTypes";

/**
 * With these settings, `clone` won't copy prototype properties and
 * will throw if the state has circular references (it shouldn't).
 * Should we need the ability to track circular references, set `circles`
 * to `true`.
 */

const clone = rfdc({ circles: false, proto: false });

export class BasicStore<State, Reducers extends ReducerMap<any, any, any>> {
  protected _state$: BehaviorSubject<Immutable<State>>;

  protected _actionReducers: Immutable<
    InferActionReducerMapFromReducerMap<Reducers>
  >;

  protected _actionCreators: Immutable<
    InferActionCreatorMapFromReducerMap<Reducers>
  >;

  protected _lastAction$ = new ReplaySubject<ActionWithError<ActionLike>>(1);

  constructor(initialState: State, reducers: Reducers) {
    const builder = createActionBuilder<State, Reducers>();

    this._state$ = new BehaviorSubject(castImmutable(initialState));

    this._actionReducers = castImmutable(
      builder.createActionReducerMap(reducers)
    );

    this._actionCreators = castImmutable(
      builder.createActionCreatorMap(reducers)
    );
  }

  /**
   * A convenience object containing every action key mapped to its action creator.
   * @use Use the object destructuring syntax to extract whichever registered action(s) you
   * need like this: `const { actionA, actionB } = store.actions;`
   */
  get actions() {
    return this._actionCreators;
  }

  /**
   * An observable stream that emits the latest action that was dispatched to this store.
   */
  get dispatchedAction$() {
    return this._lastAction$.asObservable();
  }

  /**
   * Select all or a part of the current state value synchronously.
   * @param selector The selector that will be called with the current state value.
   */
  select<T>(selector: Selector<Immutable<State>, T>) {
    return clone(selector(this._state$.value)); // Return a clone of the selected state
  }

  /**
   * Select all or a part of the current state value as an Observable. Useful if you want to use your
   * selected state in a display component or async logic.
   * @param selector The selector that will be supplied to the RxJs `map` operator.
   */
  selectAsync<T>(selector: Selector<Immutable<State>, T>) {
    return this._state$.asObservable().pipe(map(selector));
  }

  /**
   * Create an observable stream that emits when an action is dispatched to this store
   * with a type matching `actionType`.
   * @param actionType The type of the action to listen for.
   */
  createActionListener<T extends string>(actionType: T) {
    return this._lastAction$
      .asObservable()
      .pipe(filter((a) => a.action.type === actionType));
  }

  /**
   * Dispatch an action to update the current state. This is the only way to update the store's state value.
   * @param action The action to dispatch. The action's type must match one of the registered reducers.
   * @returns A `Promise` of the resulting `Transaction` from this action's reducer.
   */
  async dispatch<A extends ActionLike>(
    action: A,
    options: DispatchOptions = { skipCommit: false }
  ): Promise<Transaction<State>> {
    // TODO: Type check could probably be changed to only allow actions that are in _actionReducers
    if (!this._actionReducers[action.type]) {
      const err = new Error(`No action registered with type '${action.type}'!`);
      return this._createErrorTransaction(err);
    }

    // Create a transaction of this action's resulting state change
    const transaction = await this._transactAction(action);

    if (!options.skipCommit) {
      // Handle updating the state for this transaction.
      this._commitTransaction(action, transaction);
    }

    // Return the resulting transaction
    return transaction;
  }

  protected _commitTransaction<A extends ActionLike>(
    action: A,
    transaction: Transaction<State>
  ) {
    if (transaction.success) {
      // Update the store's state if no errors were encountered.
      this._state$.next(castImmutable(transaction.result));
    }

    // Emit the latest action regardless of success
    this._lastAction$.next({
      action: action,
      errors: transaction.errors.length > 0 ? transaction.errors : undefined
    });
  }

  protected async _transactAction<A extends ActionLike>(action: A) {
    const changes: Patch[] = [];
    const inverseChanges: Patch[] = [];
    const errors: Error[] = [];

    const reducerPromise = this._createReducerPromise(action);

    let actionResult: Draft<State>;

    try {
      actionResult = await reducerPromise;
    } catch (ex) {
      // Keep track of this error.
      errors.push(ex);

      // Return a draft of the original state
      actionResult = this._createReducerArgs(action).stateFn();
    }

    const resultState = finishDraft(actionResult, (patches, inversePatches) => {
      changes.push(...patches);
      inverseChanges.push(...inversePatches);
    });

    const transaction: Transaction<State> = {
      result: resultState,
      changes: changes,
      inverseChanges: inverseChanges,
      errors: errors,
      success: errors && errors.length === 0
    };

    return transaction;
  }

  private _createReducerPromise<A extends ActionLike>(action: A) {
    const { reducer, stateFn, actionDispatch } = this._createReducerArgs(
      action
    );

    const reducerPromise = new Promise<Draft<State>>(
      async (resolve, reject) => {
        if (isPayloadAction(action)) {
          try {
            const result = await reducer(
              stateFn,
              action.payload,
              actionDispatch
            );
            return resolve(result);
          } catch (ex) {
            return reject(ex);
          }
        } else {
          const reducerWithoutPayload = reducer as ReducerWithoutPayloadWithDispatch<
            State,
            any
          >;

          try {
            const result = await reducerWithoutPayload(stateFn, actionDispatch);
            return resolve(result);
          } catch (ex) {
            return reject(ex);
          }
        }
      }
    );

    return reducerPromise;
  }

  private _createReducerArgs<A extends ActionLike>(action: A) {
    const { reducer } = this._actionReducers[action.type];

    const stateFn = () => createDraft(this._state$.value as State);
    const actionDispatch = {
      actions: this._actionCreators,
      dispatch: this.dispatch
    };

    return {
      reducer: reducer,
      stateFn: stateFn,
      actionDispatch: actionDispatch
    };
  }

  private _createErrorTransaction(error: Error) {
    const errorTran: Transaction<State> = {
      result: undefined,
      changes: [],
      inverseChanges: [],
      errors: [error],
      success: false
    };

    return errorTran;
  }
}
