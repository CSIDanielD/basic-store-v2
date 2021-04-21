import { createActionBuilder } from "../actionBuilder";
import { TestState } from "./setup";

const builder = createActionBuilder<TestState>();
export const inventoryActions = {
  addStock: builder.createReducer.withPayload<{
    bookId: number;
    amount: number;
  }>((getState, payload) => {
    const { bookId, amount } = payload;

    const state = getState();
    state.inventory[bookId] += amount;
    return state;
  }),
  removeStock: builder.createReducer.withPayload<{
    bookId: number;
    amount: number;
  }>((getState, payload) => {
    const { bookId, amount } = payload;
    const state = getState();

    if (state.inventory[bookId] - amount < 0) {
      throw new Error(
        `BookId ${bookId} - Tried to remove ${amount} when there is ${state.inventory[bookId]} in stock!`
      );
    }

    state.inventory[bookId] -= amount;

    return state;
  })
};
