"use client";

import { User } from "@/interfaces/User";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { submitAlert } from "@/utils/submitAlert";
import { useSession } from "next-auth/react";
import { updateUserBasicData } from "@/actions/account/update-basic-data";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { Input } from "../ui/input";

/**
 * Interface que define la estructura del formulario
 * @property name - Nombre completo del usuario
 * @property phone - Número de teléfono con indicativo
 * @property city - Ciudad de residencia
 */
interface FormInputs {
  name: string;
  phone: string;
  city: string;
}

/**
 * Interface para las props del componente
 * @property user - Datos del usuario excluyendo password y role
 */
interface Props {
  user: Omit<User, "password" | "role">;
}

/**
 * Componente para editar la información básica del usuario
 * Incluye validaciones y actualización de sesión
 */
export const EditBasicInformationForm = ({ user }: Props) => {
  // Estado para manejar la carga durante la actualización
  const [isLoading, setIsLoading] = useState(false);
  const { update } = useSession();

  // Configuración del formulario con React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: { name: user.name, phone: user.phone, city: user.city },
  });

  /**
   * Maneja el envío del formulario
   * Incluye validaciones y actualización de datos
   * @param data - Datos del formulario
   */
  const onPressUpdate = async (data: FormInputs) => {
    if (data.name === "" || data.phone === "") return;
    if (data.name === user.name && data.phone === user.phone) return;
    setIsLoading(true);

    const { ok, message } = await updateUserBasicData(data, user.id);

    if (!ok) {
      submitAlert({ title: message, icon: "error" });
      setIsLoading(false);
      return;
    }

    submitAlert({ title: message, icon: "success" });
    setIsLoading(false);
    update();
  };

  return (
    <form
      onSubmit={handleSubmit(onPressUpdate)}
      className="border border-primary/50 rounded p-5 flex flex-col gap-5"
    >
      <h4 className="text-green-primary font-bold text-lg">Datos básicos</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {/* Email del usuario (no editable) */}
        <div className="border border-primary rounded-full place-content-center pl-5 opacity-40 max-md:col-span-2 py-2">
          {user.email}
        </div>

        {/* Campo de nombre */}
        <div className="relative flex flex-col max-md:col-span-2">
          <Input
            id="name"
            className="custom-input"
            type="text"
            placeholder="Nombre"
            {...register("name", { required: "El nombre es requierido" })}
          />
          {/* Mensaje de error para el nombre */}
          {errors.name && (
            <span className="text-red-500 text-xs absolute -bottom-5 pl-5">
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Campo de ciudad */}
        <div className="relative flex flex-col max-md:col-span-2">
          <Input
            id="city"
            placeholder="Ciudad"
            {...register("city", { required: "La ciudad es requerida" })}
          />
          {/* Mensaje de error para la ciudad */}
          {errors.city && (
            <span className="text-red-500 text-xs absolute -bottom-5 pl-5">
              {errors.city.message}
            </span>
          )}
        </div>

        {/* Campo de teléfono con validación de indicativo */}
        <div className="relative flex flex-col max-md:col-span-2">
          <Input
            type="tel"
            id="whatsapp"
            placeholder="Whatsapp"
            {...register("phone", {
              required: "El número de teléfono es requerido",
              validate: {
                indicative: (value) => {
                  return value.startsWith("+") || "Por favor, incluye el indicativo del país";
                }
              }
            })}
          />
          {/* Mensaje de error para el teléfono */}
          {errors.phone && (
            <span className="text-red-500 text-xs absolute -bottom-5 pl-5">
              {errors.phone.message}
            </span>
          )}
        </div>

        {/* Botón de actualización con estado de carga */}
        <button
          type="submit"
          className={`${
            isLoading && "pointer-events-none"
          } btn-blue min-h-10 col-span-2 relative`}
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner size={10} /> : "Actualizar datos"}
        </button>
      </div>
    </form>
  );
};
