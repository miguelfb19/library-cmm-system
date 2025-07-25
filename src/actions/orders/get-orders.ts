"use server";

import prisma from "@/lib/prisma";

export const getOrders = async ({isProduction}: {isProduction: boolean}) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        isProduction,
      },
      include: {
        detail: true,
        origin: {
          select: {
            id: true,
            leader: true,
            city: true,
          },
        },
        dispatchData: true,
      },
    });

    // Ordenar las órdenes con prioridad por fecha límite y luego por estado
    const sortedOrders = orders.sort((a, b) => {
      // Primero ordenar por fecha límite (más cercana primero)
      // Si no hay fecha límite, se considera menos prioritaria
      const dateA = a.limitDate ? new Date(a.limitDate).getTime() : Infinity;
      const dateB = b.limitDate ? new Date(b.limitDate).getTime() : Infinity;
      
      if (dateA !== dateB) {
        return dateA - dateB;
      }
      
      // Si las fechas límite son iguales, ordenar por estado
      const stateOrder = { pending: 1, dispatched: 2, approved: 3 };
      const stateA = stateOrder[a.state as keyof typeof stateOrder] || 4;
      const stateB = stateOrder[b.state as keyof typeof stateOrder] || 4;
      
      return stateA - stateB;
    });

    return {
      ok: true,
      message: "Pedidos obtenidos correctamente",
      status: 200,
      orders: sortedOrders,
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
