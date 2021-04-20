import { Action, PayloadAction } from "./action";
import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload
} from "./actionCreator";
import { ReducerWithoutPayload, ReducerWithPayload } from "./reducer";

export type ActionReducerWithoutPayload<
  A extends Action<any>,
  R extends ReducerWithoutPayload<any>
> = {
  actionCreator: ActionCreatorWithoutPayload<A>;
  reducer: R;
};

export type ActionReducerWithPayload<
  A extends PayloadAction<any, any>,
  R extends ReducerWithPayload<any, any>
> = {
  actionCreator: ActionCreatorWithPayload<A>;
  reducer: R;
};

export type ActionReducerLike =
  | ActionReducerWithoutPayload<any, any>
  | ActionReducerWithPayload<any, any>;
