"use server";

import { OrderDetails } from "@/interfaces/Order";
import prisma from "@/lib/prisma";

export const addOrderToInventory = async (
  sedeId: string,
  orderDetail: OrderDetails[]
) => {
  try {
    const prismaTransaction = await prisma.$transaction(async (tx) => {
      // Buscar la sede por ID
      await tx.sede.findUnique({
        where: { id: sedeId },
        include: { inventory: true },
      });

      // Actualizar el inventario de la sede con los detalles de la orden
      for (const book of orderDetail) {
        const inventoryUpdate = await tx.inventory.update({
          where: {
            sedeId_bookId: {
              sedeId,
              bookId: book.bookId,
            },
          },
          data: {
            stock: { increment: book.quantity },
          },
        });
        if (!inventoryUpdate) {
          throw new Error(`No se pudo actualizar el inventario para el libro con ID ${book.bookId}`);
        }
      }

      return {
        ok: true,
        message: "Inventario actualizado correctamente",
        status: 200,
      };
    });

    return prismaTransaction;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al agregar la orden al inventario",
      status: 500,
    };
  }
};
