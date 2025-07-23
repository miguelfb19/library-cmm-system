"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createNewNotification } from "../notifications/create-new-notification";
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
    // Actualiza la orden en la base de datos
    // Primero elimina todos los detalles existentes y luego crea los nuevos
    await prisma.order.update({
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
        note: order.note
      },
    });

    // Obtiene la lista de usuarios que deben ser notificados
    const { ids } = await getUsersToNotify(to);

    // Filtra al usuario que realizó la edición de la lista de notificaciones
    const filteredUsers = ids?.filter((id) => id !== order.userId);

    // Crea una notificación para el usuario dueño de la orden y los usuarios filtrados
    await createNewNotification(
      // Crear la notidicación para los admin y los usuarios relacionados al pedido
      // Filtramos en los admin en caso de que haya sido quien edito el pedido
      [order.userId, ...(filteredUsers ?? [])],
      `El pedido con ID ${
        order.id
      } para la ciudad de ${order.origin.city.toUpperCase()} ha sido editado.`
    );

    // Revalida la ruta del dashboard para actualizar los datos en el cliente
    revalidatePath("/dashboard/");

    // Retorna respuesta exitosa
    return {
      ok: true,
      message: "Pedido editado correctamente",
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al editar el pedido",
      status: 500,
    };
  }
};
