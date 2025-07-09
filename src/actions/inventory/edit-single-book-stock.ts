"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const editSingleBookStock = async (
  sedeId: string,
  bookId: string,
  newStock: string | number
) => {

    console.log("console en server action: ", { sedeId, bookId, newStock });
  try {
    const updatedInventory = await prisma.inventory.update({
      where: {
        sedeId_bookId: {
          sedeId,
          bookId,
        },
      },
      data: {
        stock: parseInt(newStock as string),
      },
    });

    if (!updatedInventory) {
      return {
        ok: false,
        message: "No se encontró el libro en el inventario de la sede",
        status: 404,
      };
    }

    revalidatePath(`/dashboard/admin/inventory/sede/${sedeId}`);
    return {
      ok: true,
      message: "Stock del libro editado correctamente",
      status: 200,
      inventory: updatedInventory,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al editar el stock del libro",
      status: 500,
    };
  }
};
