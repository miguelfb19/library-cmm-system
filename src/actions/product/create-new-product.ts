"use server";

import { Category } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { capitalizeWords } from "@/utils/capitalize";
import { revalidatePath } from "next/cache";

export const createNewProduct = async (data: {
  name: string;
  category: string;
}) => {
  try {
    const res = await prisma.book.create({
      data: {
        name: capitalizeWords(data.name),
        category: data.category as Category,
      },
    });

    await addNewProductToInventory(res.id);

    revalidatePath("/dashboard/");

    return {
      ok: true,
      message: "Producto creado exitosamente",
      product: res,
      status: 201,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "No se pudo crear el producto",
      status: 500,
    };
  }
};

const addNewProductToInventory = async (productId: string) => {
  try {
    const sedes = await prisma.sede.findMany();

    const updates = sedes.map((sede) =>
      prisma.inventory.create({
        data: {
          sedeId: sede.id,
          bookId: productId,
          stock: 0,
        },
      })
    );

    await Promise.all(updates);

    return {
      ok: true,
      message: "Producto agregado al inventario de todas las sedes",
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al agregar el producto al inventario",
      status: 500,
    };
  }
};
