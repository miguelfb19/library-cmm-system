"use client";

import { Book } from "@/interfaces/Book";
import { capitalizeWords } from "@/utils/capitalize";
import { Input } from "../ui/input";
import { useState } from "react";
import { Title } from "../ui/Title";

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
      <ul className="list-disc list-inside space-y-2 mt-5 pl-3 grid grid-cols-1 md:grid-cols-2">
        {filteredBooks.map((book) => (
          <li key={book.id}>
            {capitalizeWords(book.name.replaceAll("_", " "))}
          </li>
        ))}
      </ul>
    </div>
  );
};
