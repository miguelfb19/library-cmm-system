"use server";

import { InventoryItem } from "@/interfaces/Warehouse";
import prisma from "@/lib/prisma";
import { normalizeString } from "@/utils/normalize-string";
import { revalidatePath } from "next/cache";

export const editPaqueteStock = async (
  data: InventoryItem,
  action: "increment" | "decrement"
) => {
  try {
    const normalizedBookName = normalizeString(data.book.name.toLowerCase());
    const whichCategory = normalizedBookName.includes("sanacion")
      ? "seminario_sanacion"
      : normalizedBookName.includes("armadura")
      ? "seminario_armadura"
      : "seminario_como_vivir";

    const prismaTx = await prisma.$transaction(async (tx) => {
      // Verificar que existen las existencias para crear el paquete
      const currentStock = await tx.inventory.findMany({
        where: {
          sedeId: data.sedeId,
          book: { category: whichCategory },
          stock: { lt: 1 },
        },
        select: { stock: true },
      });

      if (action === "increment" && currentStock.length > 0) {
        return {
          ok: false,
          message: "No hay suficiente stock para sumar el paquete",
          status: 400,
        };
      }

      // Verificar que el stock del paquete no sea menor a 0
      if (action === "decrement" && data.stock < 1) {
        return {
          ok: false,
          message: "El paquete no tiene stock para restar",
          status: 400,
        };
      }

      // Actualizamos el stock del paquete
      await tx.inventory.update({
        where: { id: data.id },
        data: {
          stock: { [action]: 1 },
        },
      });

      // Incrementamos o decrementamos en 1 el stock de los libros relacionados a la categoria del libro del inventario
      await tx.inventory.updateMany({
        where: {
          sedeId: data.sedeId,
          book: {
            category: whichCategory,
          },
        },
        data: {
          // Aqui debe ser al contrario porque si incrementamos el paquete, debemos decrementar los libros
          // y viceversa
          stock: { [action === "decrement" ? "increment" : "decrement"]: 1 },
        },
      });

      return {
        ok: true,
        message: `Stock del paquete ${data.book.name} actualizado correctamente`,
        status: 200,
      };
    });

    revalidatePath(`/dashboard/leader/inventory/sede/${data.sedeId}`);

    return prismaTx;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al editar el stock del paquete",
      status: 500,
    };
  }
};
