"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createNewNotification } from "../notifications/create-new-notification";
import { Order } from "@/interfaces/Order";
import { getUsersToNotify } from "../notifications/get-users-to-notify";

export const editOrder = async (order: Order) => {
  try {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        detail: {
          deleteMany: {},
          create: order.detail.map((item) => ({
            bookId: item.bookId,
            quantity: item.quantity,
          })),
        },
      },
    });

    const { users } = await getUsersToNotify("ToAdmin");

    

    await createNewNotification(
      // Crear la notidicación para los admin y los usuarios relacionados al pedido
      // Filtramos en los admin en caso de que haya sido quien edito el pedido
      [order.userId, ...((users ?? []).filter((user) => user !== order.userId))],
      `El pedido con ID ${order.id} para la ciudad de ${order.origin.city} ha sido editado.`
    );

    revalidatePath("/dashboard/");

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
