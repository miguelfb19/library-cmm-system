"use server";

import prisma from "@/lib/prisma";

export const createNewNotification = async (
  userIds: string[],
  message: string,
  to: "admin" | "productor" | "leader" = "admin"
) => {

  console.log(userIds)
  try {
    const notificationsToCreate = userIds.map((userId) => ({
      userId,
      message,
      to,
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
