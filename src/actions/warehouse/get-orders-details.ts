"use server";

import prisma from "@/lib/prisma";

export const getOrdersDetails = async () => {
  try {
    const details = await prisma.bookOrder.findMany({
      where: {
        order: {
          OR: [{ state: "pending" }, { state: "dispatched" }],
        },
      },
      include: {
        order: {
          select: {
            isProduction: true,
          },
        },
      },
    });

    if (!details || details.length === 0) {
      return {
        ok: false,
        message: "No se encontraron detalles de las ordenes",
        status: 404,
      };
    }

    return {
      ok: true,
      message: "Detalles de las ordenes obtenidos correctamente",
      status: 200,
      data: details,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al obtener los detalles de la ordenes",
      status: 500,
    };
  }
};
