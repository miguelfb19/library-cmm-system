"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from 'next/cache';

export const markAsReadAll = async () => {
  try {
    await prisma.notification.updateMany({
      where: {
        read: false,
      },
      data: {
        read: true, // Mark all unread notifications as read
      },
    });

    revalidatePath('/dashboard/');

    return {
      ok: true,
      message: "Todas las notificaciones han sido marcadas como leídas",
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al marcar todas las notificaciones como leídas",
      status: 500,
    };
  }
};
