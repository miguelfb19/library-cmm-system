"use server";

import { seedInventory } from "@/constants/initial-inventory";
import { Sede } from "@/interfaces/Sede";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const createNewSede = async (data: Omit<Sede, "id" | "isPrincipal">) => {
  try {
    const { ok, message, status } = await verifySede(data.city, data.leader);

    if (!ok) {
      return {
        ok,
        message,
        status,
      };
    }

    // Crea la sede
    const newSede = await prisma.sede.create({
      data,
    });

    // Busca los libros de la DB
    const books = await prisma.book.findMany();

    // Hace el seed del inventario con la nueva sedeº
    seedInventory([newSede], books);

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

const verifySede = async (city: string, leader: string) => {
  try {
    const existingSede = await prisma.sede.findMany({
      where: {
        OR: [
          { city: { equals: city, mode: "insensitive" } },
          { leader: { equals: leader, mode: "insensitive" } },
        ],
      },
    });

    if (existingSede.length > 0) {
      return {
        ok: false,
        message: "La ciudad o el líder ya están registrados",
        status: 400,
      };
    }

    return { ok: true, message: "Nombre de sede válido", status: 200 };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al verificar el nombre de la sede",
      status: 500,
    };
  }
};
