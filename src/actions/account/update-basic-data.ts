'use server'

import prisma from "@/lib/prisma";

interface UpdateUserBasicData {
  name: string;
  phone: string;
    city: string;
}

export const updateUserBasicData = async (data: UpdateUserBasicData, userId: string) => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data
    });

    if (!user) {
      return {
        ok: false,
        message: 'Error al actualizar los datos',
        status: 500,
      };
    }

    
    return {
      ok: true,
      message: 'Datos actualizados correctamente.',
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: 'Error al actualizar los datoss',
      status: 500,
    };
  }
};