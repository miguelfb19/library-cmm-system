"use server";

import { User } from "@/interfaces/User";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export const createUser = async (data: Omit<User, "id" | "password">) => {
  try {
    const { ok, message, status } = await verifyNewUser(data.email, data.phone);
    if (!ok) {
      return {
        ok: false,
        message,
        status,
      };
    }

    const newUser = await prisma.user.create({
      data: { ...data, password: bcrypt.hashSync(data.phone) },
    });

    revalidatePath("/dashboard");

    return {
      ok: true,
      message: "Usuario creado exitosamente",
      status: 201,
      user: newUser,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al crear el usuario",
      status: 500,
    };
  }
};

const verifyNewUser = async (email: string, phone: string) => {
  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });
  const existingPhone = await prisma.user.findUnique({
    where: { phone },
  });
  if (existingEmail) {
    return {
      ok: false,
      message: "El correo electrónico ya está en uso",
      status: 400,
    };
  }
  if (existingPhone) {
    return {
      ok: false,
      message: "El número de teléfono ya está en uso",
      status: 400,
    };
  }

  return { ok: true, message: "Correo electrónico disponible", status: 200 };
};
