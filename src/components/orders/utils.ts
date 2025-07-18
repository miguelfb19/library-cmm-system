import { Book } from "@/interfaces/Book";

export const getBookName = (id: string, books: Book[]) => {
  const book = books.find((book) => book.id === id);
  return book ? book.name : "Desconocido";
};

export const getBookCategory = (id: string, books: Book[]) => {
  const book = books.find((book) => book.id === id);
  return book ? book.category : "Desconocido";
}
