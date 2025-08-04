"use server";

import prisma from "@/lib/prisma";

export const changeSede = async (userId: string, sedeId: string | null) => {
  try {
    const res = await prisma.user.update({
      where: { id: userId },
      data: { sedeId },
    });

    return {
      ok: true,
      message: "Sede del usuario actualizada correctamente",
      data: res,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al cambiar la sede del usuario",
      status: 500,
    };
  }
};
