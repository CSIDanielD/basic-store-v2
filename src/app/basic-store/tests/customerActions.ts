import { createActionBuilder } from "../actionBuilder";
import { Customer, TestState } from "./setup";

const builder = createActionBuilder<TestState>();
export const customerActions = {
  addCustomer: builder.createReducer.withPayload<Customer>(
    (getState, customer) => {
      const state = getState();
      state.customers.push(customer);
      return state;
    }
  ),
  updateCustomer: builder.createReducer.withPayload<{
    customerId: number;
    customer: Customer;
  }>((getState, payload) => {
    const state = getState();

    const foundIndex = state.customers.findIndex(
      (b) => b.id === payload.customerId
    );
    if (foundIndex > -1) {
      state.customers.splice(foundIndex, 1, payload.customer);
    }

    return state;
  }),
  removeCustomer: builder.createReducer.withPayload<number>(
    (getState, customerId) => {
      const state = getState();

      const foundIndex = state.customers.findIndex((b) => b.id === customerId);
      if (foundIndex > -1) {
        state.customers.splice(foundIndex, 1);
      }

      return state;
    }
  )
};
