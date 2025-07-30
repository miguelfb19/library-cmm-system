"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Order } from "@/interfaces/Order";
import { getUsersToNotify } from "../notifications/get-users-to-notify";

/**
 * Acción del servidor para editar una orden existente y notificar a los usuarios relevantes
 * @param order - Orden con los nuevos detalles a actualizar
 * @param to - Destinatarios de la notificación (Administradores o Productores)
 * @returns Objeto con el resultado de la operación
 */
export const editOrder = async (
  order: Order,
  to: "ToAdmin" | "ToProductor"
) => {
  try {
    const prismaTransaction = await prisma.$transaction(async (tx) => {
      // Actualiza la orden en la base de datos
      // Primero elimina todos los detalles existentes y luego crea los nuevos
      await tx.order.update({
        where: { id: order.id },
        data: {
          detail: {
            deleteMany: {}, // Elimina todos los detalles existentes
            create: order.detail.map((item) => ({
              bookId: item.bookId,
              quantity: item.quantity,
            })), // Crea los nuevos detalles
          },
          limitDate: order.limitDate,
          note: order.note,
        },
      });

      // Obtiene la lista de usuarios que deben ser notificados
      const { ids } = await getUsersToNotify(to);

      // Filtra al usuario que realizó la edición de la lista de notificaciones
      const filteredUsers = ids?.filter((id) => id !== order.userId);

      // CREATE NOTIFICATION
      const notificationMessage = order.isProduction
        ? `El pedido con ID ${order.id} para producción ha sido editado`
        : `El pedido con ID ${
            order.id
          } para la ciudad de ${order.origin.city.toUpperCase()} ha sido editado.`;

      const notificationsToCreate = [order.userId, ...(filteredUsers ?? [])].map((userId) => ({
        userId,
        message: notificationMessage,
        to: order.isProduction ? "productor" as const : "admin" as const,
      }));

      await tx.notification.createMany({
        data: notificationsToCreate,
      });

      return {
        ok: true,
        message: "Pedido editado correctamente",
        status: 200,
      };
    });

    // Revalida la ruta del dashboard para actualizar los datos en el cliente
    revalidatePath("/dashboard/");

    // Retorna respuesta exitosa
    return prismaTransaction;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al editar el pedido",
      status: 500,
    };
  }
};
