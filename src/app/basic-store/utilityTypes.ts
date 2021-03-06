import { Action, ActionLike, PayloadAction } from "./action";
import {
  ActionCreatorLike,
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload
} from "./actionCreator";
import {
  ActionReducerLike,
  ActionReducerWithoutPayload,
  ActionReducerWithoutPayloadWithDispatch,
  ActionReducerWithPayload,
  ActionReducerWithPayloadWithDispatch
} from "./actionReducer";
import { Dispatcher } from "./dispatcher";
import {
  ReducerLike,
  ReducerMap,
  ReducerMapLike,
  ReducerWithoutPayload,
  ReducerWithoutPayloadWithDispatch,
  ReducerWithPayload,
  ReducerWithPayloadWithDispatch
} from "./reducer";

//// Type guards ////
export function isPayloadAction(
  obj: ActionLike
): obj is PayloadAction<any, any> {
  return (obj as any).payload !== undefined;
}

//// Utility type inferences ////
export type InferTypeFromAction<A> = A extends ActionLike
  ? A extends PayloadAction<any, infer T>
    ? T
    : A extends Action<infer T>
    ? T
    : never
  : never;

export type InferPayloadFromPayloadAction<A> = A extends PayloadAction<
  infer P,
  any
>
  ? P
  : never;

export type InferStateFromReducer<R> = R extends ReducerLike
  ? R extends ReducerWithoutPayload<infer S>
    ? S
    : R extends ReducerWithoutPayloadWithDispatch<infer S, any>
    ? S
    : R extends ReducerWithPayload<infer S, any>
    ? S
    : R extends ReducerWithPayloadWithDispatch<infer S, any, any>
    ? S
    : never
  : never;

export type InferPayloadFromReducer<R> = R extends ReducerWithPayload<
  any,
  infer P
>
  ? P
  : never;

export type InferActionCreatorFromAction<A> = A extends ActionLike
  ? A extends PayloadAction<infer P, infer T>
    ? ActionCreatorWithPayload<PayloadAction<P, T>>
    : A extends Action<infer T>
    ? ActionCreatorWithoutPayload<Action<T>>
    : never
  : never;

export type InferActionCreatorMapFromReducerMap<M> = M extends ReducerMapLike
  ? {
      [K in keyof M]: K extends string
        ? M[K] extends ReducerWithoutPayloadWithDispatch<infer S, infer AD>
          ? ActionCreatorWithoutPayload<Action<K>>
          : M[K] extends ReducerWithPayloadWithDispatch<
              infer S,
              infer P,
              infer AD
            >
          ? ActionCreatorWithPayload<PayloadAction<P, K>>
          : M[K] extends ReducerWithoutPayload<infer S>
          ? ActionCreatorWithoutPayload<Action<K>>
          : M[K] extends ReducerWithPayload<infer S, infer P>
          ? ActionCreatorWithPayload<PayloadAction<P, K>>
          : never
        : never;
    }
  : never;

export type InferActionReducerMapFromReducerMap<M> = M extends ReducerMapLike
  ? {
      [K in keyof M]: K extends string
        ? M[K] extends ReducerWithoutPayloadWithDispatch<infer S, infer AD>
          ? ActionReducerWithoutPayloadWithDispatch<
              Action<K>,
              ReducerWithoutPayloadWithDispatch<S, AD>
            >
          : M[K] extends ReducerWithPayloadWithDispatch<
              infer S,
              infer P,
              infer AD
            >
          ? ActionReducerWithPayloadWithDispatch<
              PayloadAction<P, K>,
              ReducerWithPayloadWithDispatch<S, P, AD>
            >
          : M[K] extends ReducerWithoutPayload<infer S>
          ? ActionReducerWithoutPayload<Action<K>, ReducerWithoutPayload<S>>
          : M[K] extends ReducerWithPayload<infer S, infer P>
          ? ActionReducerWithPayload<
              PayloadAction<P, K>,
              ReducerWithPayload<S, P>
            >
          : never
        : never;
    }
  : never;

export type InferTypeFromActionCreator<AC> = AC extends ActionCreatorLike
  ? AC extends ActionCreatorWithoutPayload<infer A>
    ? InferTypeFromAction<A>
    : AC extends ActionCreatorWithPayload<infer A>
    ? InferTypeFromAction<A>
    : never
  : never;

export type InferTypeFromActionReducer<AR> = AR extends ActionReducerLike
  ? AR extends ActionReducerWithoutPayload<infer A, any>
    ? InferTypeFromAction<A>
    : AR extends ActionReducerWithPayload<infer A, any>
    ? InferTypeFromAction<A>
    : never
  : never;

export type InferTypeFromActionCreatorMap<M> = M extends {
  [K in keyof M]: ActionCreatorLike;
}
  ? {
      [K in keyof M]: InferTypeFromActionCreator<M[K]>;
    }
  : never;

export type InferStateFromReducerMap<M> = M extends ReducerMap<
  infer S,
  any,
  any
>
  ? S
  : never;

export type InferActionDispatcherFromReducerMap<M> = M extends ReducerMapLike
  ? {
      actions: InferActionCreatorMapFromReducerMap<M>;
      dispatch: Dispatcher<InferStateFromReducerMap<M>, any>;
    }
  : never;
