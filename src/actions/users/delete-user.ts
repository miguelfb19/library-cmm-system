"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteUser = async (id: string) => {
  try {

    const validation = await validateUserId(id);
    if (!validation.ok) {
      return {
        ok: false,
        message: validation.message,
        status: validation.status,
      };
    }

    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/dashboard");

    return {
      ok: true,
      message: "Usuario eliminado exitosamente",
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al eliminar el usuario",
      status: 500,
    };
  }
};

const validateUserId = async (id: string) => {

  try {

    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return {
        ok: false,
        message: "Usuario no encontrado",
        status: 404,
      };
    }

    if( user.role === "admin") {
      return {
        ok: false,
        message: "No puedes eliminar a un usuario superadministrador",
        status: 403,
      };
    }

    return {
      ok: true,
      message: "Usuario válido",
      status: 200,
    };
    
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al validar el usuario",
      status: 500,
    };
  }
}
