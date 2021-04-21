import { ActionLike } from "./action";
import { ActionCreatorMap } from "./actionCreator";
import { Transaction } from "./transaction";

export interface DispatchOptions {
  /** If `true`, the store will perform a dry run of this action and return the resulting Transaction
   * without updating the state. Default is `false`. */
  skipCommit: boolean;
}

export type Dispatcher<State, A extends ActionLike> = (
  action: A,
  options?: DispatchOptions
) => Transaction<State> | Promise<Transaction<State>>;

export type ActionDispatch<State, M extends ActionCreatorMap<any>> = {
  actions: M;
  dispatch: Dispatcher<State, any>;
};
