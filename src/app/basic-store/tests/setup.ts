export interface Book {
  id: number;
  title: string;
  price: number;
}

export interface Customer {
  id: number;
  name: string;
}

export interface Inventory {
  [bookId: number]: number;
}

export interface Purchases {
  [customerId: number]: { [bookId: number]: number };
}

export interface TestState {
  books: Book[];
  customers: Customer[];
  inventory: Inventory;
  purchases: Purchases;
}

export const defaultState: TestState = {
  books: [],
  customers: [],
  inventory: {},
  purchases: {}
};
