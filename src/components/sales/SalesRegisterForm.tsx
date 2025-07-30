"use client";

import { Book } from "@/interfaces/Book";
import { Input } from "../ui/input";
import { capitalizeWords } from "@/utils/capitalize";
import { Category } from "@/generated/prisma";
import { useForm } from "react-hook-form";
import { submitAlert } from "@/utils/submitAlert";
import { toast } from "sonner";
import { useState } from "react";
import { LoadingSpinner } from "../ui/LoadingSpinner";

interface Props {
  sedes: { id: string; city: string }[];
  books: Book[];
}

interface FormData {
  origin: string;
  category: Category;
  book: string;
  quantity: number;
}

export const SalesRegisterForm = ({ sedes, books }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const selectedCategory = watch("category");
  const categories = Object.values(Category);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    // Handle form submission logic here
    const result = await submitAlert({
      title: "Registro de Venta",
      text: `¿Desea registrar esta venta? \n\n Sede: ${data.origin.split("/")[1]}\n\n Categoría: ${data.category}\n\n Libro: ${data.book}\n\n Cantidad: ${data.quantity}`,
      icon: "info",
      confirmButtonText: "Registrar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });

    if (result.isDenied || result.isDismissed) {
      setIsLoading(false);
      return toast.error("Registro de venta cancelado");
    }

    console.log("Form submitted with data:", data);
  };

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="origin" className="font-semibold">
          Sede
        </label>
        <select
          id="origin"
          className="custom-select"
          {...register("origin", { required: true })}
        >
          <option value="">Seleccione una sede</option>
          {sedes.map((sede) =>
            sede.city === "bodega" ? null : (
              <option key={sede.id} value={sede.id+"/"+sede.city}>
                {capitalizeWords(sede.city.replaceAll("_", " "))}
              </option>
            )
          )}
        </select>
        {errors.origin && (
          <span className="text-red-500 text-xs">Este campo es requerido</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="font-semibold">
          Categoría
        </label>
        <select
          id="category"
          className="custom-select"
          {...register("category", { required: true })}
        >
          <option value="">Seleccione un seminario o categoría</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {capitalizeWords(category.replaceAll("_", " "))}
            </option>
          ))}
        </select>
        {errors.category && (
          <span className="text-red-500 text-xs">Este campo es requerido</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="book" className="font-semibold">
          Libro
        </label>
        <select
          id="book"
          className="custom-select"
          {...register("book", { required: true })}
        >
          <option value="">Seleccione un libro</option>
          {books
            .filter((book) => book.category === selectedCategory)
            .map((book) => (
              <option key={book.id} value={book.id}>
                {capitalizeWords(book.name.replaceAll("_", " "))}
              </option>
            ))}
        </select>
        {errors.book && (
          <span className="text-red-500 text-xs">Este campo es requerido</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="quantity" className="font-semibold">
          Cantidad
        </label>
        <Input
          type="number"
          id="quantity"
          {...register("quantity", { required: true })}
          placeholder="Cantidad"
        />
        {errors.quantity && (
          <span className="text-red-500 text-xs">Este campo es requerido</span>
        )}
      </div>
      <button
        type="submit"
        className="btn-blue md:col-span-2"
        disabled={isLoading}
      >
        {isLoading ? <LoadingSpinner /> : "Registrar"}
      </button>
    </form>
  );
};
