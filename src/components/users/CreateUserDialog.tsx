"use client";

import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { createUser } from "@/actions/users/create-user";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { toast } from "sonner";
import { capitalizeWords } from "@/utils/capitalize";
import { useSession } from "next-auth/react";
import { Sede } from "@/interfaces/Sede";
import { useState } from "react";

interface Props {
  sedes: Sede[];
}

interface FormInputs {
  name: string;
  email: string;
  phone: string;
  city: string;
  role: boolean;
  sedeId: string | null;
}

export const CreateUserDialog = ({ sedes }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>();

  const [hasSede, setHasSede] = useState(false);

  const { data: session } = useSession();

  const onSubmit = async (data: FormInputs) => {
    const { name, email, phone, city, role } = data;
    const formattedRole = role ? "admin" : "leader";

    const userData = {
      name: capitalizeWords(name),
      email,
      phone,
      city: capitalizeWords(city),
      role: formattedRole as "admin" | "productor" | "leader",
      sedeId:
        data.sedeId === "all" || !hasSede || watch("role") ? null : data.sedeId,
    };

    const { ok, message } = await createUser(userData);

    if (!ok) {
      toast.error(message);
      return;
    }

    toast.success(message);
    reset();
  };

  return (
    <DialogContent aria-describedby={undefined} className="!max-w-3xl">
      <DialogHeader>
        <DialogTitle className="text-primary text-2xl mb-5">
          Crear un nuevo usuario
        </DialogTitle>
      </DialogHeader>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="flex flex-col gap-1">
          <Input
            id="user-name"
            type="text"
            placeholder="Nombre del usuario"
            {...register("name", { required: "Este campo es obligatorio" })}
            disabled={isSubmitting}
          />
          {errors.name && (
            <span className="text-red-500 text-xs">{errors.name.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Input
            id="user-email"
            type="email"
            placeholder="Correo electrónico"
            {...register("email", { required: "Este campo es obligatorio" })}
            disabled={isSubmitting}
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Input
            id="user-phone"
            type="tel"
            placeholder="Teléfono"
            {...register("phone", {
              required: "Este campo es obligatorio",
              validate: {
                indicative: (value) => {
                  return (
                    value.startsWith("+") ||
                    "Por favor, incluye el indicativo del país"
                  );
                },
              },
            })}
            disabled={isSubmitting}
          />
          {errors.phone && (
            <span className="text-red-500 text-xs">{errors.phone.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Input
            id="user-city"
            type="text"
            placeholder="Ciudad"
            {...register("city", { required: "Este campo es obligatorio" })}
            disabled={isSubmitting}
          />
          {errors.city && (
            <span className="text-red-500 text-xs">{errors.city.message}</span>
          )}
        </div>

        <div className="flex max-md:flex-col gap-2 md:gap-5">
          <div className=" flex items-center gap-2 md:col-span-2">
            <input
              type="checkbox"
              id="role"
              className="cursor-pointer"
              {...register("role")}
              disabled={isSubmitting}
            />
            <label htmlFor="role">¿Es Administrador?</label>
          </div>
          {!watch("role") ? (
            <div className=" flex items-center gap-2 md:col-span-2">
              <input
                type="checkbox"
                id="has-sede"
                className="cursor-pointer"
                checked={hasSede}
                onChange={() => setHasSede(!hasSede)}
                disabled={isSubmitting}
              />
              <label htmlFor="role">¿Asociar a sede?</label>
            </div>
          ) : null}
        </div>
        {hasSede && !watch("role") ? (
          <div className="flex flex-col gap-1">
            <select
              id="sedeId"
              className="custom-select"
              disabled={session?.user.role !== "admin"}
              {...register("sedeId", { required: "Seleccione una sede" })}
            >
              {sedes.map((sede) =>
                sede.city !== "bodega" ? (
                  <option key={sede.id} value={sede.id}>
                    {capitalizeWords(sede.city)}
                  </option>
                ) : null
              )}
              <option value="all">Todas</option>
            </select>
            {errors.sedeId && (
              <span className="text-red-500 text-xs">
                {errors.sedeId.message}
              </span>
            )}
          </div>
        ) : null}

        <button
          className={`btn-blue md:col-span-2 !w-1/2 justify-self-center ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? <LoadingSpinner size={10} /> : "Crear usuario"}
        </button>
      </form>
    </DialogContent>
  );
};
