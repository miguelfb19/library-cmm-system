"use server";

import prisma from "@/lib/prisma";
import { createNewNotification } from "../notifications/create-new-notification";
import { getUsersToNotify } from "../notifications/get-users-to-notify";

interface OrderData {
  origin: {
    id: string;
    city: string;
  };
  limitDate: Date | null;
  isProduction: boolean;
  detail: {
    quantity: number;
    book: string;
  }[];
  userId: string;
}

export const createNewOrder = async (data: OrderData) => {
  try {
    const { ok, message, status, details } = await formatDetails(data.detail);

    if (!ok) {
      return {
        ok: false,
        message: message,
        status: status,
      };
    }

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
          create: details,
        },
        user: {
          connect: {
            id: data.userId,
          },
        },
      },
    });

    // GET USER TO NOTIFY
    const userToNotify = await getUsersToNotify(
      data.isProduction ? "ToProductor" : "ToAdmin"
    );

    if (!userToNotify.ok || !userToNotify.users) {
      return {
        ok: false,
        message: userToNotify.message,
        status: userToNotify.status,
      };
    }

    // CREATE NOTIFICATION
    await createNewNotification(
      userToNotify.users,
      data.isProduction
        ? "Se ha creado un nuevo pedido para producción, click para ver más detalles"
        : `Se ha creado un nuevo pedido para ${data.origin.city}, click para ver más detalles`
    );

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

// Funcion para formatear los detalles del pedido cambiando el nombre del libro por su ID

const formatDetails = async (
  details: {
    quantity: number;
    book: string;
  }[]
) => {
  try {
    const formattedDetailsPromises = details.map(async (detail) => {
      const book = await prisma.book.findUnique({
        where: { name: detail.book },
        select: { id: true },
      });

      if (!book?.id) {
        throw new Error(`Libro no encontrado: ${detail.book}`);
      }

      return {
        quantity: detail.quantity,
        bookId: book.id,
      };
    });

    return {
      ok: true,
      message: "Detalles del pedido formateados correctamente",
      status: 200,
      details: await Promise.all(formattedDetailsPromises),
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al formatear los detalles del pedido",
      status: 500,
    };
  }
};
