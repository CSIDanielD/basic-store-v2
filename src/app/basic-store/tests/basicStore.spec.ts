import { BasicStore } from "../basicStore";
import { defaultState } from "./setup";

describe("Basic store", () => {
  let store = new BasicStore(defaultState, {});

  beforeEach(() => {
    store = new BasicStore(defaultState, {});
  });

  it("Has initial state", () => {
    expect(store.select((s) => s)).toBeDefined();
  });
});
