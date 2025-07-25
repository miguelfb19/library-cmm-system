"use client";

// Importaciones necesarias para el componente
import { Book } from "@/interfaces/Book";
import { Input } from "../ui/input";
import { useState } from "react";
import { Title } from "../ui/Title";
import { PopoverEditBookName } from "./PopoverEditBookName";

/**
 * Interface que define las props del componente
 * @property books - Array opcional de libros a mostrar
 */
interface Props {
  books: Book[] | undefined;
}

/**
 * Componente que muestra y permite buscar todos los libros del sistema
 * Incluye funcionalidad de búsqueda en tiempo real y edición de nombres
 */
export const AllBooks = ({ books }: Props) => {
  // Estado para manejar el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Renderiza mensaje de error si no hay datos de libros
  if (!books)
    return (
      <p className="text-center text-gray-500 mt-5">
        No se pudieron obtener los datos de los libros
      </p>
    );

  // Filtra los libros basado en el término de búsqueda
  // Normaliza el texto removiendo guiones bajos y considerando mayúsculas/minúsculas
  const filteredBooks = books.filter((book) =>
    book.name
      .replaceAll("_", " ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Título de la sección */}
      <Title title="Todos los Libros" />

      {/* Campo de búsqueda */}
      <Input
        id="search-books"
        name="searchBooks"
        className="md:w-1/2"
        placeholder="Buscar libro..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Grid de libros filtrados */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
        {filteredBooks.map((book) => (
          <div key={book.id} className="flex items-center gap-2">
            {/* Indicador visual (punto) */}
            <div className="w-2 h-2 bg-primary rounded-full" />
            {/* Componente para editar el nombre del libro */}
            <PopoverEditBookName book={book} />
          </div>
        ))}
      </div>
    </div>
  );
};
