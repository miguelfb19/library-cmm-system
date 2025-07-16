"use client";

import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { PackagePlus, Plus } from "lucide-react";
import { CustomDialog } from "../ui/CustomDialog";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { capitalizeWords } from "@/utils/capitalize";
import { DatePicker } from "../ui/DatePicker";
import { Book } from "@/interfaces/Book";
import { CustomTooltip } from "../ui/CustomTooltip";

interface OrderForm {
  origin: string;
  limitDate: Date | undefined;
}

interface Props {
  isProduction?: boolean;
  sedes: { id: string; city: string }[];
  books: Book[];
}

export const NewOrder = ({ isProduction = false, sedes, books }: Props) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const { register, handleSubmit } = useForm<OrderForm>();

  const onSubmit = (data: OrderForm) => {
    // Handle form submission logic here

    console.log({
      origin: sedes.find((sede) => sede.id === data.origin),
      limitDate: date || null,
    });
  };

  return (
    <CustomDialog
      title="Crear nuevo pedido"
      description="Los campos marcados con * son obligatorios"
      trigger={
        <CustomTooltip text="Hacer un nuevo pedido">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="btn-blue !w-auto"
          >
            <PackagePlus />
          </button>
        </CustomTooltip>
      }
      open={open}
      onOpenChange={setOpen}
      size="lg"
    >
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="origin" className="font-bold">
            ¿Para cual sede es el pedido? <b className="text-red-500">*</b>
          </label>
          <select id="origin" className="custom-select" {...register("origin")}>
            <option value="">Seleccione una sede</option>
            {sedes.map((sede) =>
              sede.city === "bodega" ? null : (
                <option key={sede.id} value={sede.id}>
                  {capitalizeWords(sede.city)}
                </option>
              )
            )}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-bold">
            ¿Cual es la fecha límite de recepción?
          </label>
          <DatePicker
            date={date}
            setDate={setDate}
            triggerText="Fecha límite"
          />
        </div>
        {/* LISTADO DE LIBROS A PEDIR */}
        <div className="md:col-span-2 flex gap-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="book" className="font-bold">
              Seleccione el libro:
            </label>
            <select name="book" id="book" className="custom-select w-full">
              <option value="">Seleccione un libro</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {capitalizeWords(book.name.replaceAll("_", " "))} -{" "}
                  {capitalizeWords(book.category.replaceAll("_", " "))}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="quantity" className="font-bold">
              Cantidad:
            </label>
            <Input type="number" id="quantity" placeholder="Cantidad" />
          </div>
        </div>
        <CustomTooltip text="Agregar otro libro">
          <button type="button" className="btn-blue !w-14" onClick={() => {}}>
            <Plus />
          </button>
        </CustomTooltip>

        <button type="submit" className="btn-blue md:col-span-2">
          Hacer pedido
        </button>
      </form>
    </CustomDialog>
  );
};
