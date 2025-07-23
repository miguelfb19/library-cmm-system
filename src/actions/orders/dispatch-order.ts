"use server";

import { Order } from "@/interfaces/Order";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { calculatePendingItems } from "./helpers";

export const dispatchOrder = async (dispatchedOrder: Order) => {
  try {
    const prismaTransaction = await prisma.$transaction(async (tx) => {
      // Actualizar el estado de la orden a "despachada"
      const order = await tx.order.update({
        where: { id: dispatchedOrder.id },
        data: {
          state: "dispatched",
          limitDate: null,
          note: dispatchedOrder.note,
        },
        include: {
          detail: true,
          origin: true,
          dispatchData: true,
        },
      });

      //   Crear la notificacion de actualizacion de la orden
      await tx.notification.create({
        data: {
          userId: order.userId,
          message: `Tu pedido ${
            order.id
          } ha sido despachado hacía la ciudad de ${order.origin.city.toUpperCase()}`,
        },
      });

      // Obtener la diferencia entre las cantidades despachadas y las originales
      const pendingItems = calculatePendingItems(
        order.detail,
        dispatchedOrder.detail
      );

      // Crear nueva orden si hay items pendientes
      let newOrder = null;
      if (pendingItems.some((item) => item.quantity > 0)) {
        newOrder = await tx.order.create({
          data: {
            userId: order.userId,
            originId: order.origin.id,
            detail: {
              create: pendingItems
                .filter((item) => item.quantity > 0)
                .map((item) => ({
                  bookId: item.bookId,
                  quantity: item.quantity,
                })),
            },

            limitDate: order.limitDate,
            isProduction: order.isProduction,
            note: dispatchedOrder.note,
            dispatchData: { 
              create: {
                name: dispatchedOrder.dispatchData!.name,
                phone: dispatchedOrder.dispatchData!.phone,
                address: dispatchedOrder.dispatchData!.address,
                city: dispatchedOrder.dispatchData!.city,
                document: dispatchedOrder.dispatchData!.document,
              }
            },
          },
        });
        if (!newOrder) {
          throw new Error("Error al crear la nueva orden");
        }
      }

      // Actualizar los detalles de la orden despachada
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          detail: {
            update: order.detail.map((originalItem) => {
              const dispatchedItem = dispatchedOrder.detail.find(
                (item) => item.bookId === originalItem.bookId
              );
              return {
                where: { id: originalItem.id },
                data: { quantity: dispatchedItem?.quantity || originalItem.quantity },
              };
            }),
          },
        },
      });
      if (!updatedOrder) {
        throw new Error("Error al actualizar la orden despachada");
      }

      return { order, newOrder };
    });

    revalidatePath("/dashboard");

    return {
      ok: true,
      message: prismaTransaction?.newOrder
        ? "Se despachó la orden y se creó una nueva con los items restantes de la orden original"
        : "Orden despachada",
      newOrder: prismaTransaction?.newOrder,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al despachar la orden",
      status: 500,
    };
  }
};
