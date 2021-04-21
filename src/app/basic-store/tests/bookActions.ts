import { createActionBuilder } from "../actionBuilder";
import { Book, TestState } from "./setup";

const builder = createActionBuilder<TestState>();
export const bookActions = {
  addBook: builder.createReducer.withPayload<Book>((getState, book) => {
    const state = getState();
    state.books.push(book);
    return state;
  }),
  updateBook: builder.createReducer.withPayload<{ bookId: number; book: Book }>(
    (getState, payload) => {
      const state = getState();

      const foundIndex = state.books.findIndex((b) => b.id === payload.bookId);
      if (foundIndex > -1) {
        state.books.splice(foundIndex, 1, payload.book);
      }

      return state;
    }
  ),
  removeBook: builder.createReducer.withPayload<number>((getState, bookId) => {
    const state = getState();

    const foundIndex = state.books.findIndex((b) => b.id === bookId);
    if (foundIndex > -1) {
      state.books.splice(foundIndex, 1);
    }

    return state;
  })
};
