'use server'

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteNotification = async (id: string) => {
  try {
    await prisma.notification.delete({
      where: { id },
    });

    revalidatePath("/dashboard/");

    return {
      ok: true,
      message: "Notificación eliminada correctamente",
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