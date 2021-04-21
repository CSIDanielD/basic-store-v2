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
    amount: number;
  }>(async (getState, payload, dispatch) => {
    // First, dispatch an action to remove the
    const state = getState();
    return state;
  })
};
