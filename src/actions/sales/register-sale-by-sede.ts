"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Estructura de datos para registrar una venta por sede
 */
interface Data {
  /** ID de la sede donde se registra la venta */
  origin: string;
  /** ID del libro que se vende */
  book: string;
  /** Cantidad de libros vendidos */
  quantity: number;
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
    const currentStock = await prisma.inventory.findUnique({
      where: {
        sedeId_bookId: {
          sedeId: data.origin,
          bookId: data.book,
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
                decrement: quantity, // Decrementar stock por la cantidad vendida
              },
            },
          },
        },
      },
    });

    // Revalidar rutas relacionadas para actualizar la UI
    revalidatePath("dashboard/leader/inventory");

    return {
      ok: true,
      message: "Venta registrada con éxito",
      status: 200,
    };
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
