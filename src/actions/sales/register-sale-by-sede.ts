"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Estructura de datos para registrar una venta por sede
 */
interface Data {
  /** ID de la sede donde se registra la venta */
  sedeId: string;
  /** ID del libro que se vende */
  bookId: string;
  /** Cantidad de libros vendidos */
  quantity: number;
  /** Nombre de la parroquia, si aplica */
  parishName?: string;
  /** Nombre del encargado de la parroquia, si aplica */
  parishManager?: string;
}

/**
 * Server Action para registrar ventas de libros por sede
 *
 * @description Esta función procesa el registro de una venta, validando
 * el stock disponible y actualizando automáticamente el inventario de la sede.
 * Implementa transacciones para garantizar la integridad de los datos.
 *
 * @features
 * - Validación de cantidad positiva
 * - Verificación de stock suficiente
 * - Actualización atómica del inventario
 * - Revalidación automática de rutas
 * - Manejo robusto de errores
 *
 * @param data - Datos de la venta a registrar
 * @returns Promise con resultado de la operación
 */
export const registerSaleBySede = async (data: Data) => {
  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // Validar y normalizar la cantidad
      const quantity = Number(data.quantity);

      if (isNaN(quantity) || quantity <= 0) {
        return {
          ok: false,
          message: "La cantidad debe ser un número válido mayor a 0",
          status: 400,
        };
      }

      // Verificar stock actual en la sede
      const currentStock = await tx.inventory.findUnique({
        where: {
          sedeId_bookId: {
            sedeId: data.sedeId,
            bookId: data.bookId,
          },
        },
        select: { stock: true },
      });

      // Validar que existe suficiente stock
      if (!currentStock || currentStock.stock < quantity) {
        return {
          ok: false,
          message: "No hay suficiente stock para registrar la venta",
          status: 400,
        };
      }

      // Actualizar inventario decrementando el stock
      await tx.sede.update({
        where: { id: data.sedeId },
        data: {
          inventory: {
            update: {
              where: {
                sedeId_bookId: {
                  sedeId: data.sedeId,
                  bookId: data.bookId,
                },
              },
              data: {
                stock: {
                  decrement: quantity, // Decrementar stock por la cantidad vendida
                },
              },
            },
          },
        },
      });

      // Registrar venta de parroquia si aplica
      if (data.parishName && data.parishManager) {
        await tx.parishSale.create({
          data: {
            name: data.parishName,
            manager: data.parishManager,
            bookId: data.bookId,
            quantity,
            sedeId: data.sedeId,
          },
        });
      }

      // Revalidar rutas relacionadas para actualizar la UI
      revalidatePath("dashboard/leader/inventory");

      return {
        ok: true,
        message: data.parishName
          ? "Venta de proceso parroquial registrada con éxito"
          : "Venta registrada con éxito",
        status: 200,
      };
    });

    return prismaTx;
  } catch (error) {
    // Log del error para debugging
    console.error("Error en registerSaleBySede:", error);

    return {
      ok: false,
      message: "Error al registrar la venta",
      status: 500,
    };
  }
};
