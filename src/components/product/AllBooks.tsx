"use client";

import { Book } from "@/interfaces/Book";
import { Input } from "../ui/input";
import { useState } from "react";
import { Title } from "../ui/Title";
import { PopoverEditBookName } from "./PopoverEditBookName";

interface Props {
  books: Book[] | undefined;
}

export const AllBooks = ({ books }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!books)
    return (
      <p className="text-center text-gray-500 mt-5">
        No se pudieron obtener los datos de los libros
      </p>
    );

  const filteredBooks = books.filter((book) =>
    book.name
      .replaceAll("_", " ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  return (
    <div className="flex flex-col gap-5">
      <Title title="Todos los Libros" />
      <Input
        className="md:w-1/2"
        placeholder="Buscar libro..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
        {filteredBooks.map((book) => (
          <div key={book.id} className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <PopoverEditBookName book={book} />
          </div>
        ))}
      </div>
    </div>
  );
};
