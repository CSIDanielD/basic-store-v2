import { Patch } from "immer";

export interface Transaction<State> {
  result?: State;
  changes: Patch[];
  inverseChanges: Patch[];
  errors: Error[];
  success: boolean;
}
