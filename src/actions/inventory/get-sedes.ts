"use server";

import prisma from "@/lib/prisma";

export const getSedes = async () => {
  try {
    const sedes = await prisma.sede.findMany({
      orderBy: {
        city: "asc",
      },
    });

    return {
      ok: true,
      message: "Sedes obtenidas correctamente",
      status: 200,
      sedes,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al obtener las sedes",
      status: 500,
    };
  }
};
