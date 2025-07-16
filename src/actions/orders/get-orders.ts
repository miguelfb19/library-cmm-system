"use server";

import prisma from "@/lib/prisma";

export const getOrders = async () => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        detail: true,
        origin: {
          select: {
            id: true,
            leader: true,
            city: true,
          },
        },
      },
      orderBy: {
        limitDate: "asc",
      },
    });

    return {
      ok: true,
      message: "Pedidos obtenidos correctamente",
      status: 200,
      orders,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al obtener los pedidos",
      status: 500,
    };
  }
};
