import { Action, PayloadAction } from "./action";
import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload
} from "./actionCreator";
import {
  ReducerWithoutPayload,
  ReducerWithoutPayloadWithDispatch,
  ReducerWithPayload,
  ReducerWithPayloadWithDispatch
} from "./reducer";

export type ActionReducerWithoutPayload<
  A extends Action<any>,
  R extends ReducerWithoutPayload<any>
> = {
  actionCreator: ActionCreatorWithoutPayload<A>;
  reducer: R;
};

export type ActionReducerWithoutPayloadWithDispatch<
  A extends Action<any>,
  R extends ReducerWithoutPayloadWithDispatch<any, any>
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

export type ActionReducerWithPayloadWithDispatch<
  A extends PayloadAction<any, any>,
  R extends ReducerWithPayloadWithDispatch<any, any, any>
> = {
  actionCreator: ActionCreatorWithPayload<A>;
  reducer: R;
};

export type ActionReducerLike =
  | ActionReducerWithoutPayload<any, any>
  | ActionReducerWithPayload<any, any>
  | ActionReducerWithoutPayloadWithDispatch<any, any>
  | ActionReducerWithPayloadWithDispatch<any, any>;
