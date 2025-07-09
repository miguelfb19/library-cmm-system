"use server";

import prisma from "@/lib/prisma";

export const getSedesWithInventory = async () => {
  try {
    const sedes = await prisma.sede.findMany({
      orderBy: {
        city: "asc",
      },
      select: {
        id: true,
        city: true,
        isPrincipal: true,
        inventory: {
          include: {
            book: {
              select: {
                name: true,
                category: true,
              },
            },
          },
        },
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
