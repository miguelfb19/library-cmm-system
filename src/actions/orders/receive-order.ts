"use server";

import prisma from "@/lib/prisma";

export const receiveOrder = async () => {
  try {
    const prismaTransaction = await prisma.$transaction(async (tx) => {
        
    });
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error en la operación",
      status: 500,
    };
  }
};
