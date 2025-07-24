"use server";

import { OrderDetails } from "@/interfaces/Order";
import prisma from "@/lib/prisma";

export const substractOrderFromWarehouse = async (
  orderDetail: OrderDetails[]
) => {
  try {
    const prismaTransaction = await prisma.$transaction(async (tx) => {
      // Buscar la bodega
      const warehouse = await tx.sede.findUnique({
        where: { city: "bodega" },
        select: {
          id: true,
        },
      });

      if (!warehouse) {
        throw new Error("Bodega no encontrada");
      }

      // Actualizar el inventario de la bodega con los detalles de la orden
      for (const book of orderDetail) {
        const inventoryUpdate = await tx.inventory.update({
          where: {
            sedeId_bookId: {
              sedeId: warehouse.id,
              bookId: book.bookId,
            },
          },
          data: {
            stock: { decrement: book.quantity },
          },
        });
        if (!inventoryUpdate) {
          throw new Error(
            `No se pudo actualizar el inventario de bodega para el libro con ID ${book.bookId}`
          );
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
