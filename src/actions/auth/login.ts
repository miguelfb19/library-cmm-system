"use server";

import { signIn } from "@/auth.config";
import { AuthError } from "next-auth";

interface Response {
  status: number;
  message: string;
  ok: boolean;
}

export async function authenticate(
  prevState: Response | undefined,
  formData: FormData
) {
  try {
    console.log({formData})
    if( !formData || !formData.get("email") || !formData.get("password") ) {
      return { status: 400, message: "Datos inválidos o incompletos.", ok: false };
    }
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirect: true,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    console.log({ error });

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { status: 401, message: "Credenciales incorrectas.", ok: false };
        default:
          return { status: 401, message: "Algo salió mal.", ok: false };
      }
    }
    throw error;
  }
}
