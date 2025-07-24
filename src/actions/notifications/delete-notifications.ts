'use server'

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteNotifications = async (userId: string) => {
    try {
    await prisma.notification.deleteMany({
      where: { userId },
    });

    revalidatePath("/dashboard/");

    return {
      ok: true,
      message: "Notificaciones eliminadas correctamente",
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: 'Error al eliminar la notificación',
      status: 500,
    };
  }
}