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

export function getDefaultState(): TestState {
  return {
    books: [
      { id: 1, title: "Animal Farm", price: 1.0 },
      { id: 2, title: "Infinite Jest", price: 2.3 },
      { id: 4, title: "Ulysses", price: 0.1 },
      { id: 5, title: "1984", price: 0.99 },
      { id: 7, title: "Moby Dick", price: 5 },
      { id: 13, title: "A Brief History of Time", price: 7 }
    ],
    customers: [
      { id: 2, name: "Jon" },
      { id: 5, name: "Jenn" },
      { id: 6, name: "Chris" },
      { id: 7, name: "Dan" },
      { id: 14, name: "Brandon" }
    ],
    inventory: {},
    purchases: {}
  };
}
