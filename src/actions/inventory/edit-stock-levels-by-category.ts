"use server";

import { Category } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const editStockLevelsByCategory = async (
  sedeId: string,
  category: Category,
  data: { criticalStock: string; lowStock: string }
) => {
  try {
    const res = await prisma.inventory.updateMany({
      where: {
        AND: [
            {
                sedeId: sedeId,
            },
            {
                book: {
                category: category,
                },
            },
        ]
      },
      data: {
        criticalStock: parseInt(data.criticalStock),
        lowStock: parseInt(data.lowStock),
      },
    });

    revalidatePath(`/dashboard/leader`, "layout");

    return {
        ok: true,
        message: `Niveles de stock actualizados correctamente para la categoría ${category.replaceAll("_", " ")}`,
        status: 200,
        updatedCount: res.count,
    }
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al editar los niveles de stock",
      status: 500,
    };
  }
};
