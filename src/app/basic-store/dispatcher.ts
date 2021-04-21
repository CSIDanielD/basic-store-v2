import { ActionLike } from "./action";
import { ActionCreatorMap } from "./actionCreator";
import { Transaction } from "./transaction";

export type Dispatcher<State, A extends ActionLike> = (
  action: A
) => Transaction<State> | Promise<Transaction<State>>;

export type ActionDispatch<State, M extends ActionCreatorMap<any>> = {
  actions: M;
  dispatch: Dispatcher<State, any>;
};
