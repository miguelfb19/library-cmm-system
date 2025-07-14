"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const editProductName = async (id: string, newName: string) => {
  try {
    const { ok, message } = await verifyName(newName);

    if (!ok) {
      return {
        ok: false,
        message,
        status: 400,
      };
    }

    await prisma.book.update({
      where: { id },
      data: { name: newName.replaceAll(" ", "_").toLowerCase().trim() },
    });

    revalidatePath("/dashboard");

    return {
      ok: true,
      message: "Nombre del producto editado correctamente",
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al editar el nombre del producto",
      status: 500,
    };
  }
};

const verifyName = async (name: string) => {
  try {
    const existingProduct = await prisma.book.findUnique({
      where: {
        name,
      },
    });

    if (existingProduct) {
      return {
        ok: false,
        message: "El nombre del producto ya existe",
        status: 400,
      };
    }

    return {
      ok: true,
      message: "Nombre del producto verificado",
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "No se pudo verificar el nombre del producto",
      status: 500,
    };
  }
};
