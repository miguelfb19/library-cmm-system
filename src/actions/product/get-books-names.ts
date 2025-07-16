"use server";

import prisma from "@/lib/prisma";

export const getBooksNames = async () => {
  try {
    const books = await prisma.book.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    if (!books || books.length === 0) {
      return {
        ok: false,
        message: "No se encontraron libros",
        status: 404,
      };
    }

    return {
      ok: true,
      message: "Nombres de libros obtenidos correctamente",
      status: 200,
      books,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al obtener los nombres de los libros",
      status: 500,
    };
  }
};
