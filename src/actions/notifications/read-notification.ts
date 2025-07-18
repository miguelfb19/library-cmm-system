"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const readNotification = async (id: string, userId: string) => {
  try {
    await prisma.notification.update({
      where: { id, userId },
      data: { read: true },
    });

    revalidatePath("/dashboard/");

    return {
      ok: true,
      message: "Notificación marcada como leída",
      status: 200,
    };
  } catch (error) {
    console.error("Error reading notification:", error);
    return {
      ok: false,
      message: "Error al marcar la notificación como leída",
      status: 500,
    };
  }
};
