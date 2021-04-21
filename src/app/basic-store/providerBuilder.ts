import { ReducerMap } from "./reducer";

/**
 * Useful to merge many ReducerMap-like objects into a combined ReducerMap. You can use this
 * to transform objects or classes whose only public properties are reducer methods
 * into one ReducerMap that can be provided to a BasicStore. Providers need to be passed
 * using the object spread operator to ensure that only the public methods are given to
 * the function.
 * @use `@Injectable()
 *  class ActionServiceA {
 *    providedActionA = context.createReducer(getState => getState());
 *  }
 *
 *  @Injectable()
 *  class ActionServiceB {
 *    providedActionB = context.createReducer(getState => getState());
 *  }
 *
 * // Elsewhere in code...
 *
 *  const merged = createProviderFrom({...ActionServiceA}).mergeProvider({...ActionServiceB});`
 * */
export class ProviderBuilder<Provider extends ReducerMap<any, any, any>> {
  constructor(public provider?: Provider) {}

  mergeProvider<NewProvider extends ReducerMap<any, any, any>>(
    provider: NewProvider
  ) {
    return new ProviderBuilder<Provider & NewProvider>({
      ...this.provider,
      ...provider
    });
  }
}
