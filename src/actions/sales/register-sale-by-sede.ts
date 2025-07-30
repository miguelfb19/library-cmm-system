"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface Data {
  origin: string;
  book: string;
  quantity: number;
}

export const registerSaleBySede = async (data: Data) => {
  try {
    // Convertir quantity a número para asegurar que sea un entero
    const quantity = Number(data.quantity);
    
    if (isNaN(quantity) || quantity <= 0) {
      return {
        ok: false,
        message: "La cantidad debe ser un número válido mayor a 0",
        status: 400,
      };
    }

    const currentStock = await prisma.inventory.findUnique({
      where: {
        sedeId_bookId: {
          sedeId: data.origin,
          bookId: data.book,
        },
      },
      select: { stock: true },
    });

    if (!currentStock || currentStock.stock < quantity) {
      return {
        ok: false,
        message: "No hay suficiente stock para registrar la venta",
        status: 400,
      };
    }

    await prisma.sede.update({
      where: { id: data.origin },
      data: {
        inventory: {
          update: {
            where: {
              sedeId_bookId: {
                sedeId: data.origin,
                bookId: data.book,
              },
            },
            data: {
              stock: {
                decrement: quantity,
              },
            },
          },
        },
      },
    });

    revalidatePath("dashboard/leader/inventory");

    return {
      ok: true,
      message: "Venta registrada con éxito",
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al registrar la venta",
      status: 500,
    };
  }
};
