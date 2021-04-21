import { ActionLike } from "./action";
import { ActionCreatorMap } from "./actionCreator";

export type Dispatcher<A extends ActionLike> = (
  action: A
) => void | Promise<void>;

export type ActionDispatch<
  A extends ActionLike,
  M extends ActionCreatorMap<A>
> = {
  actions: M;
  dispatch: Dispatcher<A>;
};
