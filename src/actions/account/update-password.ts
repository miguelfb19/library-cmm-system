"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const updatePassword = async (newPassword: string, id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new Error("Usuario no encontrado");

    if (bcrypt.compareSync(newPassword, user.password))
      return {
        ok: false,
        message: "La nueva contraseña no puede ser igual a la anterior",
        status: 400,
      };

    const hashedNewPassword = bcrypt.hashSync(newPassword);
    await prisma.user.update({
      where: { id },
      data: {
        password: hashedNewPassword,
      },
    });

    return {
      ok: true,
      message: "Contraseña actualizada correctamente",
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Error al actualizar la contraseña",
      status: 500,
    };
  }
};
