import { castImmutable } from "immer";

export class StateBuilder<State> {
  constructor(public state: State) {}

  get asImmutable() {
    return castImmutable(this.state);
  }

  mergeState<NewState>(state: NewState) {
    return new StateBuilder<State & NewState>({ ...this.state, ...state });
  }
}
