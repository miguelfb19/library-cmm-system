"use client";

import { capitalizeWords } from "@/utils/capitalize";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { Book } from "@/interfaces/Book";
import { submitAlert } from "@/utils/submitAlert";
import { useState } from "react";
import { toast } from "sonner";
import { editProductName } from "@/actions/product/edit-product-name";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { CustomTooltip } from "../ui/CustomTooltip";

interface Props {
  book: Book;
}

export const PopoverEditBookName = ({ book }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newName, setNewName] = useState("");

  const onEditName = async (newName: string) => {
    setIsLoading(true);

    const result = await submitAlert({
      title: "Editar nombre del libro",
      text: `¿Estás seguro de que quieres cambiar el nombre del libro a "${newName}"?`,
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
      icon: "question",
    });

    if (result.isDenied || result.isDismissed) {
      toast.error("Edición cancelada");
      setIsLoading(false);
      return;
    }

    console.log(newName);

    const res = await editProductName(book.id, newName);

    if (!res.ok) {
      toast.error(res.message);
      setIsLoading(false);
      return;
    }

    toast.success(res.message);
    setIsLoading(false);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <CustomTooltip text="Editar nombre del libro">
          <div className="cursor-pointer hover:underline text-start">
            {capitalizeWords(book.name.replaceAll("_", " "))}
          </div>
        </CustomTooltip>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2">
        <h3 className="text-primary font-bold text-center">
          Editar nombre del libro{" "}
          <span className="font-normal text-yellow-600">
            "{capitalizeWords(book.name.replaceAll("_", " "))}"
          </span>
        </h3>
        <Input
          type="text"
          placeholder="Nuevo nombre"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          className="btn-blue"
          onClick={() => onEditName(newName)}
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner size={10} /> : "Editar nombre"}
        </button>
      </PopoverContent>
    </Popover>
  );
};
