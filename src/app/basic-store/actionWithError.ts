export interface ActionWithError<A extends ActionLike> {
  action: A;
  errors?: Error[];
}
