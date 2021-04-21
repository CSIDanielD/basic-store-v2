import { Draft } from "immer";
import { ActionDispatch } from "./dispatcher";
import { StateFn } from "./stateFn";

export type ReducerWithoutPayload<S> = (
  getState: StateFn<Draft<S>>
) => Draft<S> | Promise<Draft<S>>;

export type ReducerWithoutPayloadWithDispatch<
  S,
  AD extends ActionDispatch<any, any>
> = (getState: StateFn<Draft<S>>, dispatch: AD) => Draft<S> | Promise<Draft<S>>;

export type ReducerWithPayload<S, P> = (
  getState: StateFn<Draft<S>>,
  payload: P
) => Draft<S> | Promise<Draft<S>>;

export type ReducerWithPayloadWithDispatch<
  S,
  P,
  AD extends ActionDispatch<any, any>
> = (
  getState: StateFn<Draft<S>>,
  payload: P,
  dispatch: AD
) => Draft<S> | Promise<Draft<S>>;

export type ReducerLike =
  | ReducerWithoutPayload<any>
  | ReducerWithPayload<any, any>
  | ReducerWithoutPayloadWithDispatch<any, any>
  | ReducerWithPayloadWithDispatch<any, any, any>;

export type ReducerMap<State, P, AD extends ActionDispatch<any, any>> = {
  [actionType: string]:
    | ReducerWithoutPayload<State>
    | ReducerWithPayload<State, P>
    | ReducerWithoutPayloadWithDispatch<State, AD>
    | ReducerWithPayloadWithDispatch<State, P, AD>;
};

export type ReducerMapLike = { [actionType: string]: ReducerLike };
