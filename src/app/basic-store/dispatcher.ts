import { ActionLike } from "./action";
import { ActionCreatorMap } from "./actionCreator";

export type Dispatcher<A extends ActionLike> = (
  action: A
) => void | Promise<void>;

export type ActionDispatch<M extends ActionCreatorMap<any>> = {
  actions: M;
  dispatch: Dispatcher<any>;
};
