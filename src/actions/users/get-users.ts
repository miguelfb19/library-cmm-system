"use server";

import prisma from "@/lib/prisma";

export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      include: {
        Sede: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    if (!users) {
      return {
        ok: false,
        message: "Error al obtener los usuarios",
        status: 500,
      };
    }

    return {
      ok: true,
      message: "usuarios obtenidos correctamente",
      status: 200,
      data: users,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al obtener los usuarios",
      status: 500,
    };
  }
};
