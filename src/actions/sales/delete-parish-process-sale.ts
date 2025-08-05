"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteParishProcessSale = async (saleId: string, sedeId: string) => {
  try {
    await prisma.parishSale.delete({
      where: { id: saleId },
    });

    revalidatePath(`/dashboard/leader/inventory/sede/${sedeId}`);
    return {
      ok: true,
      message: "Venta de proceso parroquial eliminada con éxito",
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al eliminar la venta de proceso parroquial",
      status: 500,
    };
  }
};
