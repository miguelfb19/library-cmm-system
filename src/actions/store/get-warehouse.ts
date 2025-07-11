"use server";

import prisma from "@/lib/prisma";

export const getWarehouse = async () => {
  try {
    const warehouse = await prisma.sede.findFirst({
      where: {
        city: "Bodega",
      },
      include: {
        inventory: {
          include: {
            book: true,
          },
          orderBy: {
            book: {
              name: "asc",
            },
          },
        },
      },
    });

    if (!warehouse) {
      return {
        ok: false,
        message: "Bodega no encontrada",
        status: 404,
      };
    }

    return {
      ok: true,
      message: "Bodega obtenida correctamente",
      status: 200,
      warehouse,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al obtener los datos de la bodega",
      status: 500,
    };
  }
};
