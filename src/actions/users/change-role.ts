"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const changeRole = async (
  userId: string,
  newRole: "admin" | "productor" | "leader"
) => {
  try {
    const { ok, message, status } = await verifyRoles(userId, newRole);

    if (!ok) {
      return {
        ok: false,
        message,
        status,
      };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    revalidatePath("/dashboard");

    return {
      ok: true,
      message: "Rol del usuario actualizado correctamente",
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al cambiar el rol del usuario",
      status: 500,
    };
  }
};

const verifyRoles = async (userId: string, newRole: string) => {
  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    // Si el usuario actual es admin y se intenta cambiar a otro rol
    if (currentUser?.role === "admin") {
      const adminCount = await prisma.user.count({
        where: { role: "admin" }
      });

      if (newRole !== "admin" && adminCount <= 1) {
        return {
          ok: false,
          message: "Debe quedar al menos un administrador en el sistema",
          status: 400,
        };
      }
    }

    return {
      ok: true,
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al obtener los roles de los usuarios",
      status: 500,
    };
  }
};
