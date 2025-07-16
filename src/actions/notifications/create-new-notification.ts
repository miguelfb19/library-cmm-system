"use server";

import prisma from "@/lib/prisma";

export const createNewNotification = async (
  userIds: string[],
  message: string
) => {
  try {
    const notificationsToCreate = userIds.map((userId) => ({
      userId,
      message,
    }));

    await prisma.notification.createMany({
      data: notificationsToCreate,
    });

    return {
      ok: true,
      message: "Notificación creada correctamente",
      status: 201,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al crear la notificación",
      status: 500,
    };
  }
};
