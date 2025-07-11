"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { submitAlert } from "@/utils/submitAlert";
import { updatePassword } from "@/actions/account/update-password";
import { Eye, EyeOff } from "lucide-react";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { Input } from "../ui/input";

interface FormInputs {
  password: string;
  confirmPassword: string;
}

interface Props {
  userId: string;
}

export const EditPasswordForm = ({ userId }: Props) => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();

  const onPressSave = async (data: FormInputs) => {
    if (data.password === "") return;

    setIsLoading(true);

    const { ok, message, status } = await updatePassword(
      data.confirmPassword,
      userId
    );

    if (!ok) {
      if (status === 400) submitAlert({title: message, icon: "warning"});
      else submitAlert({title: message, icon: "error"});
      setIsLoading(false);
      reset()
      return;
    }

    submitAlert({title: message, icon: "success"});
    setIsLoading(false);
    reset();
  };

  return (
    <form
      className="flex flex-col gap-5 p-5 border border-primary/50 rounded"
      onSubmit={handleSubmit(onPressSave)}
    >
      <h4 className="text-green-primary font-bold text-lg">
        Actualizar contraseña
      </h4>
      <div className="flex gap-3 max-md:flex-col">
        <div className="w-full">
          <div id="input-with-eye" className="relative">
            <Input
              type={isVisible ? "text" : "password"}
              id="password"
              placeholder="Contraseña"
              className={`custom-input ${
                errors.password ? "!border-red-500" : ""
              }`}
              {...register("password", {
                required: "La contraseña es requerida",
                validate: {
                  large: (value) => {
                    return value.length >= 8 || "La contraseña debe tener al menos 8 caracteres";
                  },
                }
              })}
            />
            <button
              aria-label="toggle password visibility"
              className="absolute right-5 top-1/4 cursor-pointer text-primary"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeOff />
              ) : (
                <Eye />
              )}
            </button>
          </div>
          {errors.password && (
            <FormError data={errors.password.message ?? ""} />
          )}
        </div>
        <div className="w-full">
          <Input
            type={isVisible ? "text" : "password"}
            id="confirm-password"
            placeholder="Confirmar contraseña"
            className={`custom-input ${
              errors.confirmPassword ? "!border-red-500" : ""
            }`}
            {...register("confirmPassword", {
              required: "Debes confirmar la contraseña",
              // Validate that the passwords match
              validate: (value) => {
                if (value !== getValues().password) {
                  return "Las contraseñas no coinciden";
                }
                return true;
              },
            })}
          />
          {errors.confirmPassword && (
            <FormError data={errors.confirmPassword.message ?? ""} />
          )}
        </div>

        <button
          type="submit"
          className={`btn-blue flex-1/2 self-start relative min-h-10 ${
            isLoading && "pointer-events-none opacity-50"
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <LoadingSpinner size={10} />
          ) : (
            "Guardar"
          )}
        </button>
      </div>
    </form>
  );
};

const FormError = ({ data }: { data: string }) => {
  return <span className="text-xs text-red-500">{data}</span>;
};
