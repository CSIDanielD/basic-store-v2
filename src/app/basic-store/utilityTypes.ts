import { Action, ActionLike, PayloadAction } from "./action";
import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload
} from "./actionCreator";
import {
  ActionReducerWithoutPayload,
  ActionReducerWithPayload
} from "./actionReducer";
import {
  ReducerLike,
  ReducerMapLike,
  ReducerWithoutPayload,
  ReducerWithPayload
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
        ? M[K] extends ReducerWithoutPayload<infer S>
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
        ? M[K] extends ReducerWithoutPayload<infer S>
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
