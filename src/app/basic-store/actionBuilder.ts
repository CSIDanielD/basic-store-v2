import { ActionLike } from "./action";
import { ActionCreatorMap } from "./actionCreator";
import { ActionReducerLike } from "./actionReducer";
import { ActionDispatch } from "./dispatcher";
import {
  ReducerLike,
  ReducerMap,
  ReducerWithoutPayload,
  ReducerWithoutPayloadWithDispatch,
  ReducerWithPayload,
  ReducerWithPayloadWithDispatch
} from "./reducer";
import {
  InferActionCreatorMapFromReducerMap,
  InferActionDispatcherFromReducerMap,
  InferActionReducerMapFromReducerMap,
  InferPayloadFromReducer
} from "./utilityTypes";

export function createActionBuilder<
  State = any,
  Reducers extends ReducerMap<State, any, any> = ReducerMap<State, any, any>
>() {
  return new ActionBuilder<State, Reducers>();
}

export class ActionBuilder<State = any, Reducers = any> {
  constructor() {}

  withState<NewState>() {
    return new ActionBuilder<State & NewState, Reducers>();
  }

  withReducers<NewReducers>() {
    return new ActionBuilder<State, Reducers & NewReducers>();
  }

  get createReducer() {
    function withoutPayload(
      reducer: ReducerWithoutPayloadWithDispatch<
        State,
        InferActionDispatcherFromReducerMap<Reducers>
      >
    ) {
      return reducer;
    }

    function withPayload<P>(
      reducer: ReducerWithPayloadWithDispatch<
        State,
        P,
        InferActionDispatcherFromReducerMap<Reducers>
      >
    ) {
      return reducer;
    }

    return {
      withoutPayload: withoutPayload,
      withPayload: withPayload
    };
  }

  private _createActionCreator<T extends string, R extends ReducerLike>(
    type: T
  ) {
    return (payload?: InferPayloadFromReducer<R>): ActionLike => {
      return { type: type, payload: payload };
    };
  }

  private _createActionReducer<T extends string, R extends ReducerLike>(
    type: T,
    reducer: R
  ): ActionReducerLike {
    return {
      actionCreator: this._createActionCreator(type),
      reducer: reducer
    };
  }

  createActionCreatorMap<M extends ReducerMap<State, any, any>>(reducers: M) {
    const actionCreators = Object.entries(reducers).reduce((map, entry) => {
      const [actionType, reducer] = entry;

      map[actionType] = this._createActionCreator(actionType);

      return map;
    }, {} as { [actionType: string]: any });

    return actionCreators as InferActionCreatorMapFromReducerMap<M>;
  }

  createActionReducerMap<M extends ReducerMap<State, any, any>>(reducers: M) {
    const actionReducers = Object.entries(reducers).reduce((map, entry) => {
      const [actionType, reducer] = entry;

      map[actionType] = this._createActionReducer(actionType, reducer);

      return map;
    }, {} as { [actionType: string]: any });

    return actionReducers as InferActionReducerMapFromReducerMap<M>;
  }

  createActionDispatcher<AD extends ActionDispatch<any, any>>(
    actionDispatch: AD
  ): AD {
    return actionDispatch;
  }
}
