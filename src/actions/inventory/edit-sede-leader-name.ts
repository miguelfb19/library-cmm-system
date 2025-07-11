"use server";

import prisma from "@/lib/prisma";
import { capitalizeWords } from "@/utils/capitalize";
import { revalidatePath } from "next/cache";

export const editSedeLeaderName = async (sedeId: string, newName: string) => {
  try {
    // Format name
    newName = capitalizeWords(newName.trim());

    // Verify if the name is available
    const { ok, message } = await verifySedeLeaderName(newName);
    if (!ok) {
      return {
        ok: false,
        message: message,
        status: 400,
      };
    }

    await prisma.sede.update({
      where: { id: sedeId },
      data: { leader: newName },
    });

    revalidatePath(`/dashboard/leader/inventory/sede/${sedeId}`);

    return {
      ok: true,
      message: "Nombre del líder de sede actualizado correctamente",
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al editar el nombre del líder de sede",
      status: 500,
    };
  }
};

const verifySedeLeaderName = async (name: string) => {
  const res = await prisma.sede.findFirst({
    where: {
      leader: name,
    },
  });

  if (!res) {
    return {
      ok: true,
      message: "Nombre disponible",
      status: 200,
    };
  }

  return {
    ok: false,
    message: "El nombre ya está en uso",
    status: 400,
  };
};
