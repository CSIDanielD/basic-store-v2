import { createActionBuilder } from "../actionBuilder";
import { inventoryActions } from "./inventoryActions";
import { TestState } from "./setup";

const builder = createActionBuilder<TestState>().withReducers<
  typeof inventoryActions
>();

export const purchaseActions = {
  purchaseBook: builder.createReducer.withPayload<{
    bookId: number;
    customerId: number;
  }>(async (getState, payload, dispatch) => {
    const { bookId, customerId } = payload;

    // First, dispatch an action to remove the book from inventory.
    const { removeStock } = dispatch.actions;
    const removedBook = await dispatch.dispatch(
      removeStock({ bookId: bookId, amount: 1 })
    );

    if (!removedBook.success) {
      return getState(); // Do nothing if there are errors.
    }

    const state = getState();

    // Log the book purchase.
    if (!state.purchases[customerId]) {
      state.purchases[customerId] = {};
    }

    if (!state.purchases[customerId][bookId]) {
      state.purchases[customerId][bookId] = 0;
    }

    state.purchases[customerId][bookId] += 1;

    return state;
  })
};
