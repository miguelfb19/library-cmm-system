"use server";

import { Order } from "@/interfaces/Order";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createNewOrder } from "./create-new-order";

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
        },
      });

      // Validar si la orden existe
      if (!order) {
        throw new Error("Ups, no se encontró la orden a despachar");
      }

      //   Crear la notificacion de actualizacion de la orden
      await tx.notification.create({
        data: {
          userId: order.userId,
          message: `Tu pedido ${order.id} ha sido despachado hacía la ciudad de ${order.origin.city.toUpperCase()}`,
        },
      });

      // Obtener la diferencia entre las cantidades despachadas y las originales
      const updatedDetail = order.detail.map((item) => {
        const dispatchedItem = dispatchedOrder.detail.find(
          (d) => d.id === item.id
        );
        return {
          ...item,
          quantity: item.quantity - (dispatchedItem?.quantity || 0),
        };
      });

      // Si hay algún item con cantidad mayor a 0, crea una orden nuevo con los items restantes
      if (updatedDetail.some((item) => item.quantity > 0)) {
        const newOrder = await createNewOrder({
          userId: order.userId,
          origin: {
            id: order.origin.id,
            city: order.origin.city,
          },
          detail: updatedDetail
            .filter((item) => item.quantity > 0)
            .map((item) => ({
              bookId: item.bookId,
              quantity: item.quantity,
            })),

          limitDate: order.limitDate,
          isProduction: order.isProduction,
          note: dispatchedOrder.note,
        });
        if (!newOrder.order || !newOrder.ok) {
          throw new Error("Error al crear la nueva orden");
        }

        // Actualizar los detalles de la orden despachada
        const updatedOrder = await tx.order.update({
          where: { id: order.id },
          data: {
            detail: {
              update: dispatchedOrder.detail.map((item) => ({
                where: { id: item.id },
                data: { quantity: item.quantity },
              })),
            },
          },
        });
        if (!updatedOrder) {
          throw new Error("Error al actualizar la orden despachada");
        }

        return { order };
      }
    });

    revalidatePath("/dashboard");

    return {
      ok: true,
      message: prismaTransaction?.order
        ? "Se despachó la orden y se creó una nueva con los items restantes de la orden original"
        : "Orden despachada",
      newOrder: prismaTransaction?.order,
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
