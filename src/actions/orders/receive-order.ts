"use server";

import prisma from "@/lib/prisma";
import { Order } from "@/interfaces/Order";
import { getUsersToNotify } from "../notifications/get-users-to-notify";
import { createNewNotification } from "../notifications/create-new-notification";
import { createNewOrder } from "./create-new-order";
import { revalidatePath } from "next/cache";
import { calculatePendingItems } from "./helpers";

/**
 * Recibe una orden y actualiza su estado a "despachada".
 * Si hay items restantes, crea una nueva orden con ellos.
 * @param orderToReceive - La orden a recibir.
 * @returns Un objeto con el estado de la operación.
 */
export const receiveOrder = async (orderToReceive: Order) => {
  try {
    const prismaTransaction = await prisma.$transaction(async (tx) => {
      // Actualizar el estado de la orden a "Completada"
      const order = await tx.order.update({
        where: { id: orderToReceive.id },
        data: {
          state: "approved",
        },
        include: {
          detail: true,
          origin: true,
          dispatchData: true,
        },
      });

      // Actualizar los detalles de la orden con las cantidades realmente recibidas
      for (const receivedItem of orderToReceive.detail) {
        await tx.bookOrder.update({
          where: { id: receivedItem.id },
          data: {
            quantity: receivedItem.quantity,
            order: {
              update: {
                note: orderToReceive.note,
              }
            }
          },
        });
      }

      // Calcular items pendientes después de la recepción
      const pendingItems = calculatePendingItems(
        order.detail,
        orderToReceive.detail
      );

      // GET USER TO NOTIFY
      // Obtener los usuarios a notificar según el tipo de orden
      // Si es una orden de producción, notificar al productor, si no, al administrador
      const usersToNotify = await getUsersToNotify(
        order.isProduction ? "ToProductor" : "ToAdmin"
      );
      if (!usersToNotify.ok || !usersToNotify.ids)
        throw new Error(usersToNotify.message);

      // CREATE NOTIFICATION
      // Si hay algún item con cantidad mayor a 0, se notifica que se aprobó parcialmente
      // Si no, se notifica que se aprobó completamente
      const hasPendingItems = pendingItems.some((item) => item.quantity > 0);
      
      const notif = await createNewNotification(
        usersToNotify.ids,
        hasPendingItems
          ? `El pedido ${
              order.id
            } despachado hacia ${order.origin.city.toUpperCase()} se aprobó parcialmente, quedan items pendientes.`
          : `El pedido ${
              order.id
            } despachado hacia ${order.origin.city.toUpperCase()} se aprobó completamente.`,
        order.isProduction ? "productor" : "admin"
      );

      if (!notif.ok) throw new Error(notif.message);

      // Solo crear/anexar nueva orden si realmente hay items pendientes con cantidad > 0
      if (hasPendingItems) {
        const ordersBySede = await tx.order.findMany({
          where: {
            originId: order.originId,
            state: "pending",
          },
          include: {
            detail: true,
          },
        });

        // Buscar una orden existente que tenga al menos un libro que coincida con restDetail
        const selectedOrderToUpdate = ordersBySede.find((order) =>
          order.detail.some((orderItem) =>
            pendingItems.some(
              (restItem) =>
                restItem.bookId === orderItem.bookId && restItem.quantity > 0
            )
          )
        );

        // Si no hay una orden existente que coincida, crear una nueva orden
        // con los items restantes de restDetail
        // y anexar los libros de restDetail a esa orden
        // Si no hay órdenes pendientes en la sede, crear una nueva orden
        // con los items restantes de restDetail
        // y anexar los libros de restDetail a esa orden
        if (
          !ordersBySede ||
          ordersBySede.length === 0 ||
          !selectedOrderToUpdate
        ) {
          const newOrder = await createNewOrder({
            userId: order.userId,
            origin: {
              id: order.origin.id,
              city: order.origin.city,
            },
            detail: pendingItems
              .filter((item) => item.quantity > 0)
              .map((item) => ({
                bookId: item.bookId,
                quantity: item.quantity,
              })),

            limitDate: order.limitDate,
            isProduction: order.isProduction,
            note: orderToReceive.note,
            dispatchData: orderToReceive.dispatchData!,
          });

          if (!newOrder) throw new Error("Error al crear la nueva orden");

          return { newOrder, order };
        } else {
          // Anexar todos los libros del pendingItems a la orden encontrada
          for (const pendingItem of pendingItems.filter(
            (item) => item.quantity > 0
          )) {
            // Verificar si el libro ya existe en la orden
            const existingDetailItem = selectedOrderToUpdate.detail.find(
              (orderItem) => orderItem.bookId === pendingItem.bookId
            );

            if (existingDetailItem) {
              // Si el libro ya existe, actualizar la cantidad
              await tx.bookOrder.update({
                where: { id: existingDetailItem.id },
                data: {
                  quantity: existingDetailItem.quantity + pendingItem.quantity,
                },
              });
            } else {
              // Si el libro no existe, crear un nuevo detalle
              await tx.bookOrder.create({
                data: {
                  orderId: selectedOrderToUpdate.id,
                  bookId: pendingItem.bookId,
                  quantity: pendingItem.quantity,
                },
              });
            }
          }

          const updatedOrder = await tx.order.findUnique({
            where: { id: selectedOrderToUpdate.id },
          });

          return { updatedOrder, order };
        }
      }

      // Si no hay items pendientes, solo retornar la orden original
      return { order };
    });

    revalidatePath("/dashboard");

    return {
      ok: true,
      message: prismaTransaction?.updatedOrder
        ? `Se recibió la orden correctamente y se anexaron los libros restantes a la orden ${prismaTransaction.updatedOrder.id}`
        : "Se recibió la orden correctamente",
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error en la operación",
      status: 500,
    };
  }
};
