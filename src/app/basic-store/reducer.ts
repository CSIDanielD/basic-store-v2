import { Draft } from "immer";
import { StateFn } from "./stateFn";

export type ReducerWithoutPayload<S> = (
  getState: StateFn<Draft<S>>
) => Draft<S>;

export type ReducerWithoutPayloadWithDispatch<S, D> = (
  getState: StateFn<Draft<S>>
) => Draft<S>;

export type ReducerWithPayload<S, P> = (
  getState: StateFn<Draft<S>>,
  payload: P
) => Draft<S>;

export type ReducerLike =
  | ReducerWithoutPayload<any>
  | ReducerWithPayload<any, any>;

export type ReducerMap<State, P> = {
  [actionType: string]:
    | ReducerWithoutPayload<State>
    | ReducerWithPayload<State, P>;
};

export type ReducerMapLike = { [actionType: string]: ReducerLike };
