import { enablePatches } from "immer";
import { sample } from "rxjs/operators";
import { BasicStore } from "../basicStore";
import { getTestActions } from "./actions";
import { getDefaultState, Inventory } from "./setup";

enablePatches();

describe("State selection", () => {
  let store = new BasicStore(getDefaultState(), getTestActions());

  beforeEach(() => {
    store = new BasicStore(getDefaultState(), getTestActions());
  });

  it("can select the whole state", () => {
    const state = store.select((s) => s);

    const alteredDefault = getDefaultState();
    alteredDefault.customers.push({ id: 20, name: "Jim" });

    expect(state).toStrictEqual(getDefaultState());
    expect(state).not.toStrictEqual(alteredDefault);
  });

  it("can select a single state property", () => {
    const books = store.select((s) => s.books);

    const alteredDefault = getDefaultState();
    alteredDefault.books.push({ id: 20, title: "Fake book", price: 100 });

    expect(books).toStrictEqual(getDefaultState().books);
    expect(books).not.toStrictEqual(alteredDefault);
  });

  it("can select a combination of state properties", () => {
    const props = store.select((s) => {
      return { customers: s.customers, purchases: s.purchases };
    });

    const defaultState = getDefaultState();
    expect(props).toStrictEqual({
      customers: defaultState.customers,
      purchases: defaultState.purchases
    });

    const alteredDefault = getDefaultState();
    alteredDefault.customers.push({ id: 123, name: "Customer" });
    alteredDefault.purchases[123] = { 5: 10 };
    const alteredProps = {
      customers: alteredDefault.customers,
      purchases: alteredDefault.purchases
    };

    expect(props).not.toStrictEqual(alteredProps);
  });

  it("can select an observable of the whole state");

  it("can select an observable of a single state property");

  it("can select an observable of a combination of state properties");
});

describe("Dispatching actions", () => {
  beforeEach(() => {});

  it("can dispatch an action");

  it("doesn't allow unregistered actions");

  it("can handle reducer errors");

  it("can listen for actions of a particular type");
});

describe("Updating state", () => {
  let store = new BasicStore(getDefaultState(), getTestActions());

  beforeEach(() => {
    store = new BasicStore(getDefaultState(), getTestActions());
  });

  it("updates the state when an action is dispatched", async () => {
    expect(store.select((s) => s)).toStrictEqual(getDefaultState());

    const { addBook } = store.actions;
    await store.dispatch(addBook({ id: 123, title: "Test Book", price: 10 }));

    const expectedState = getDefaultState();
    expectedState.books.push({ id: 123, title: "Test Book", price: 10 });

    expect(store.select((s) => s)).not.toStrictEqual(getDefaultState());
    expect(store.select((s) => s)).toStrictEqual(expectedState);
  });

  it("does not update state when reducer errors", async () => {
    // Set the amount of book #4 in stock to 2
    const sampleState = getDefaultState();
    sampleState.inventory[4] = 2;

    // Test that the sample store has its state equal to sampleState
    const sampleStore = new BasicStore(sampleState, getTestActions());
    expect(sampleStore.select((s) => s)).toStrictEqual(sampleState);

    // Attempt to remove 10 copies of book #4 from stock when there are only 2 available.
    // This should throw an error, and the state should be untouched.
    const { removeStock } = sampleStore.actions;
    const tran = await sampleStore.dispatch(
      removeStock({ bookId: 4, amount: 10 })
    );

    expect(tran.success).toBeFalsy();
    expect(tran.errors.length).toBeGreaterThan(0);
    expect(tran.result).toStrictEqual(sampleState);
    expect(sampleStore.select((s) => s)).toStrictEqual(sampleState);
  });

  it("does not allow updating the state by changing selected state", () => {
    expect(store.select((s) => s)).toStrictEqual(getDefaultState());

    const state = store.select((s) => s);
    (state.inventory as Inventory)[10] = 5; // Attempt to assign a value by circumventing Immutable type.

    expect(store.select((s) => s)).not.toStrictEqual(state);
    expect(store.select((s) => s)).toStrictEqual(getDefaultState());
  });
});

describe("Change detection", () => {});
