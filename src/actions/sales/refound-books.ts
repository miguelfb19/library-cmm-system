"use server";

import { ParishSale } from "@/interfaces/ParishSale";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const refoundBooks = async (sale: ParishSale, quantity: number) => {
  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. Actualizar la venta parroquial restando el numero de libros devueltos y cambiando el estado
      await tx.parishSale.update({
        where: { id: sale.id },
        data: {
          quantity: {
            decrement: quantity,
          },
          isActive: false,
          refundedAt: new Date(),
        },
      });

      // 2. Actualizar el inventario de la sede sumando los libros devueltos
      await tx.inventory.updateMany({
        where: {
          sedeId: sale.sedeId,
          bookId: sale.bookId,
        },
        data: {
          stock: {
            increment: quantity,
          },
        },
      });

      return { ok: true, message: "Libros devueltos con éxito", status: 200 };
    });

    revalidatePath(`/dashboard/leader/inventory/sede/${sale.sedeId}`);

    return prismaTx;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al devolver los libros",
      status: 500,
    };
  }
};
