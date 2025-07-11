"use server";

import prisma from "@/lib/prisma";

export const getAllBooks = async () => {
  try {
    const books = await prisma.book.findMany({
      orderBy:{
        name: "asc",
      }
    });

    return {
      ok: true,
      message: "Libros obtenidos exitosamente",
      books,
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al obtener los libros",
      status: 500,
    };
  }
};
