export interface Action<T extends string = string> {
  type: T;
}

export interface PayloadAction<P = any, T extends string = string> {
  type: T;
  payload: P;
}

export type ActionLike = Action<any> | PayloadAction<any>;
