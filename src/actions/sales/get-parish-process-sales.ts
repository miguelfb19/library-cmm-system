"use server";

import prisma from "@/lib/prisma";

export const getParishProcessSales = async (sedeId?: string) => {
  try {
    const res = await prisma.parishSale.findMany({
      where: {
        ...(sedeId && { sedeId }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      ok: true,
      message: "Ventas en procesos parroquiales obtenidas correctamente",
      status: 200,
      data: res,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al obtener las ventas en procesos parroquiales",
      status: 500,
    };
  }
};
