import { Action, ActionLike, PayloadAction } from "./action";
import {
  InferActionCreatorFromAction,
  InferPayloadFromPayloadAction
} from "./utilityTypes";

export type ActionCreatorWithoutPayload<A extends Action<any>> = () => A;
export type ActionCreatorWithPayload<A extends PayloadAction<any, any>> = (
  payload: InferPayloadFromPayloadAction<A>
) => A;

export type ActionCreatorMap<A extends ActionLike> = {
  [actionType: string]: InferActionCreatorFromAction<A>;
};
