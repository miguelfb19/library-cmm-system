"use server";

import prisma from "@/lib/prisma";
import { createNewNotification } from "../notifications/create-new-notification";
import { getUsersToNotify } from "../notifications/get-users-to-notify";
import { revalidatePath } from "next/cache";

interface OrderData {
  origin: {
    id: string;
    city: string;
  };
  limitDate: Date | null;
  isProduction: boolean;
  detail: {
    quantity: number;
    bookId: string;
  }[];
  userId: string;
  note: string | null;
}

export const createNewOrder = async (data: OrderData) => {
  try {
    const res = await prisma.order.create({
      data: {
        origin: {
          connect: {
            id: data.origin.id,
          },
        },
        limitDate: data.limitDate,
        isProduction: data.isProduction,
        detail: {
          create: data.detail,
        },
        user: {
          connect: {
            id: data.userId,
          },
        },
        note: data.note,
      },
    });

    // GET USER TO NOTIFY
    const userToNotify = await getUsersToNotify(
      data.isProduction ? "ToProductor" : "ToAdmin"
    );

    if (!userToNotify.ok || !userToNotify.ids) {
      return {
        ok: false,
        message: userToNotify.message,
        status: userToNotify.status,
      };
    }

    // CREATE NOTIFICATION
    await createNewNotification(
      userToNotify.ids,
      data.isProduction
        ? "Se ha creado un nuevo pedido para producción, click para ver más detalles"
        : `Se ha creado un nuevo pedido para ${data.origin.city.toUpperCase()}, click para ver más detalles`,
      data.isProduction ? "productor" : "admin"
    );

    revalidatePath("/dashboard");

    return {
      ok: true,
      message: "Pedido creado correctamente",
      status: 201,
      order: res,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al crear el pedido",
      status: 500,
    };
  }
};
