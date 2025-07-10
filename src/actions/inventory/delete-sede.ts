'use server'

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteSede = async (sedeId: string) => {
  try {
    
    await prisma.sede.delete({
      where: { id: sedeId },
    });

    revalidatePath("/dashboard/leader/inventory");

    return {
      ok: true,
      message: 'Sede eliminada correctamente',
      status: 200,
    };

  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: 'Error al eliminar la sede o no existe',
      status: 500,
    };
  }
}