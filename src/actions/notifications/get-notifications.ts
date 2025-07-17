"use server";

import prisma from "@/lib/prisma";

export const getNotifications = async () => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      ok: true,
      message: "Notificaciones obtenidas correctamente",
      status: 200,
      data: notifications,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al obtener las notificaciones",
      status: 500,
    };
  }
};
