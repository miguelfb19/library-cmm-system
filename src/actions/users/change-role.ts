"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const changeRole = async (userId: string, newRole: "admin" | "user") => {
  try {
    const { ok, message, status } = await verifyRoles(newRole);

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

const verifyRoles = async (newRole: string) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        role: true,
      },
    });

    if (users.filter((user) => user.role === "admin").length === 1 && newRole === "user") {
      return {
        ok: false,
        message: "No puedes eliminar el último administrador",
        status: 400,
      };
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
