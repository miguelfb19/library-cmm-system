"use server";

import prisma from "@/lib/prisma";
import { getUsersToNotify } from "../notifications/get-users-to-notify";
import { revalidatePath } from "next/cache";
import { DispatchData } from "@/interfaces/DispatchData";

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
  dispatchData: DispatchData;
}

export const createNewOrder = async (data: OrderData) => {
  try {
    const prismaTransaction = await prisma.$transaction(async (tx) => {
      const res = await tx.order.create({
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
          dispatchData: {
            create: {
              name: data.dispatchData.name,
              phone: data.dispatchData.phone,
              address: data.dispatchData.address,
              city: data.dispatchData.city,
              document: data.dispatchData.document,
            },
          },
        },
      });

      // GET USER TO NOTIFY
      const userToNotify = await getUsersToNotify(
        data.isProduction ? "ToProductor" : "ToAdmin"
      );

      if (!userToNotify.ok || !userToNotify.ids)
        throw new Error(userToNotify.message);
      
      // CREATE NOTIFICATION
      const notificationMessage = data.isProduction
        ? "Se ha creado un nuevo pedido para producción, click para ver más detalles"
        : `Se ha creado un nuevo pedido para ${data.origin.city.toUpperCase()}, click para ver más detalles`;

      const notificationsToCreate = userToNotify.ids.map((userId) => ({
        userId,
        message: notificationMessage,
        to: data.isProduction ? "productor" as const : "admin" as const,
      }));

      await tx.notification.createMany({
        data: notificationsToCreate,
      });

      return {
        ok: true,
        message: "Pedido creado correctamente",
        status: 201,
        order: res,
      };
    });

    revalidatePath("/dashboard");

    return prismaTransaction;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "No se pudo crear el pedido, por favor intente nuevamente",
      status: 500,
      order: null,
    };
  }
};
