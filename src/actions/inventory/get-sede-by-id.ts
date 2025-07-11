"use server";

import prisma from "@/lib/prisma";

export const getSedeById = async (id: string) => {
  try {
    const sede = await prisma.sede.findUnique({
      where: {
        id,
      },
      include: {
        inventory: {
          select: {
            id: true,
            stock: true,
            criticalStock: true,
            lowStock: true,
            book: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
        },
      },
    });

    if (!sede) {
      return {
        ok: false,
        message: "Sede no encontrada",
        status: 404,
      };
    }

    return {
      ok: true,
      sede,
      message: "Sede obtenida correctamente",
      status: 200,
    };

  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al obtener la sede",
      status: 500,
    };
  }
};
