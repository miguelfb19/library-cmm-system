"use client";

import { Input } from "@/components/ui/input";
import { Title } from "../../../components/ui/Title";
import { EyeOff, Eye } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { authenticate } from "@/actions/auth/login";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { submitAlert } from "@/utils/submitAlert";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state && !state.ok) {
      submitAlert({
        title: state.message || "Error al iniciar sesión",
        icon: "error",
      });
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="flex flex-col items-center justify-center gap-5"
    >
      <Title title="Gestión de librería" />
      <Title title="Inicio de Sesión" className="!text-3xl" />
      {/* email */}
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="Ingrese su correo electrónico"
        disabled={isPending}
      />
      {/* password */}
      <div className="relative w-full">
        <Input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Ingrese su contraseña"
          disabled={isPending}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
          {showPassword ? (
            <EyeOff onClick={() => setShowPassword(false)} />
          ) : (
            <Eye onClick={() => setShowPassword(true)} />
          )}
        </div>
      </div>
      {/* boton */}
      <button
        type="submit"
        className={`btn-blue ${
          isPending ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isPending}
      >
        {isPending ? (
          <LoadingSpinner className="text-white" size={10} />
        ) : (
          "Iniciar Sesión"
        )}
      </button>
    </form>
  );
}
