"use server";

import { seedInventory } from "@/constants/initial-inventory";
import { Sede } from "@/interfaces/Sede";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const createNewSede = async (data: Omit<Sede, "id" | "isPrincipal">) => {
  try {

    // Crea la sede
    const newSede = await prisma.sede.create({
      data,
    });

    // Busca los libros de la DB
    const books = await prisma.book.findMany();

    // Hace el seed del inventario con la nueva sedeº
    seedInventory([newSede], books)

    revalidatePath("/dashboard");

    return {
      ok: true,
      message: "Sede creada correctamente",
      sede: newSede,
      status: 201,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al crear la sede",
      status: 500,
    };
  }
};
