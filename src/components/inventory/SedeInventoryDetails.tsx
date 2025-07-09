"use client";

import { editSingleBookStock } from "@/actions/inventory/edit-single-book-stock";
import { Category } from "@/generated/prisma";
import { capitalizeWords } from "@/utils/capitalize";
import { formatBookName } from "@/utils/format-book-name";
import { submitAlert } from "@/utils/submitAlert";
import { Check, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

interface Sede {
  id: string;
  city: string;
  leader: string;
  isPrincipal: boolean;
  inventory: {
    id: string;
    stock: number;
    book: {
      id: string;
      name: string;
      category: Category;
    };
  }[];
}

interface Props {
  inventory: {
    id: string;
    book: {
      id: string;
      name: string;
      category: Category;
    };
    stock: number;
  }[];
  sede: Sede;
}

export const SedeInventoryDetails = ({ inventory, sede }: Props) => {
  const [editingItem, setEditingItem] = useState<string | number | null>(null);
  const [newStocks, setNewStocks] = useState<Record<string, string>>({});
  const { data: session } = useSession();

  if(!session?.user) return null;

  const handleStockChange = (bookId: string, value: string) => {
    setEditingItem(bookId);
    setNewStocks((prev) => ({ ...prev, [bookId]: value }));
  };

  const handleChangeStock = async (bookId: string, bookName: string) => {
    const result = await submitAlert({
      title: "Cambiar stock",
      html: `¿Estás seguro de que quieres cambiar el stock de <b>${bookName}</b>?`,
      icon: "warning",
      confirmButtonText: "Cambiar stock",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      await editSingleBookStock(sede.id, bookId, newStocks[bookId]);
      setEditingItem(null);
      return toast.success("Stock del libro editado correctamente");
    }
    toast.info("Cambios cancelados");
    setEditingItem(null);
  };

  const enableEditing = session.user.role === "admin" || session.user.name!.includes(sede.leader);

  return (
    <div>
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-primary text-xl">
          {capitalizeWords(inventory[0]?.book.category.replaceAll("_", " "))}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {inventory
            .sort((a, b) => a.book.name.localeCompare(b.book.name))
            .map(({ stock, book, id }) => (
              <div key={id} className="shadow-lg rounded p-2 bg-secondary/70">
                <h4 className="font-bold text-sm">
                  {formatBookName(book.name)}
                </h4>
                <div
                  className={`text-sm ${
                    stock >= 150
                      ? "text-primary"
                      : stock >= 50
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <span>Stock:</span>
                      <input
                        // defaultValue={stock}
                        className="border-none rounded p-1 w-16"
                        type="number"
                        value={
                          editingItem === book.id ? newStocks[book.id] : stock
                        }
                        onChange={(e) => {
                          handleStockChange(book.id, e.target.value);
                        }}
                        disabled={!enableEditing}
                      />
                    </div>
                    <div
                      className="flex items-center gap-2"
                      hidden={editingItem !== book.id}
                    >
                      <button
                        className="p-1 bg-green-500 rounded hover:bg-green-300 transition-colors text-white cursor-pointer"
                        onClick={() => {
                          handleChangeStock(book.id, book.name);
                        }}
                      >
                        <Check size={20} />
                      </button>
                      <button
                        className="p-1 bg-red-500 rounded hover:bg-red-300 transition-colors text-white cursor-pointer"
                        onClick={() => {
                          setEditingItem(null);
                        }}
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
