"use server";

import prisma from "@/lib/prisma";

type NotificationType = "ToProductor" | "ToAdmin";

export const getUsersToNotify = async (notificationType: NotificationType) => {
  try {
    const usersIds = await prisma.user.findMany({
      where: {
        role: notificationType === "ToProductor" ? "productor" : "admin",
      },
      select: {
        id: true,
      }
    });

    return {
        ok: true,
        message: "Usuarios obtenidos correctamente",
        status: 200,
        users: usersIds.map(user => user.id),
    }

  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al obtener los usuarios a notificar",
      status: 500,
    };
  }
};
