"use client";

import { editSingleBookStock } from "@/actions/inventory/edit-single-book-stock";
import { Category } from "@/generated/prisma";
import { ShortSede } from "@/interfaces/Sede";
import { capitalizeWords } from "@/utils/capitalize";
import { formatBookName } from "@/utils/format-book-name";
import { submitAlert } from "@/utils/submitAlert";
import { Check, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { CustomTable } from '../ui/CustomTable';

/**
 * Interface que define la estructura del inventario y la sede
 * @property inventory - Array de items de inventario con detalles del libro y niveles de stock
 * @property sede - Información básica de la sede
 */
interface Props {
  inventory: {
    id: string;
    book: {
      id: string;
      name: string;
      category: Category;
    };
    stock: number;
    criticalStock: number;
    lowStock: number;
  }[];
  sede: ShortSede;
}

/**
 * Componente que muestra y permite editar los detalles del inventario de una sede
 * Incluye funcionalidades de:
 * - Visualización de niveles de stock por libro
 * - Edición de stock (solo para admin o líder de sede)
 * - Indicadores visuales de estado de stock
 */
export const SedeInventoryDetails = ({ inventory, sede }: Props) => {
  // Estado para controlar qué item está siendo editado
  const [editingItem, setEditingItem] = useState<string | number | null>(null);
  // Estado para almacenar los nuevos valores de stock
  const [newStocks, setNewStocks] = useState<Record<string, string>>({});
  // Obtiene la sesión del usuario
  const { data: session } = useSession();

  // Validación de autenticación
  if (!session?.user) return null;

  /**
   * Maneja el cambio en el valor del stock
   * @param bookId - ID del libro a modificar
   * @param value - Nuevo valor de stock
   */
  const handleStockChange = (bookId: string, value: string) => {
    setEditingItem(bookId);
    setNewStocks((prev) => ({ ...prev, [bookId]: value }));
  };

  /**
   * Maneja la confirmación y actualización del stock
   * @param bookId - ID del libro a actualizar
   * @param bookName - Nombre del libro para mostrar en la alerta
   */
  const handleChangeStock = async (bookId: string, bookName: string) => {
    const result = await submitAlert({
      title: "Cambiar stock",
      html: `¿Estás seguro de que quieres cambiar el stock de <b>${capitalizeWords(
        bookName.replaceAll("_", " ")
      )}</b>?`,
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
    toast.error("Cambios cancelados");
    setEditingItem(null);
  };

  // Determina si el usuario puede editar el inventario
  const enableEditing =
    session.user.role === "admin" || session.user.name!.includes(sede.leader);

  /**
   * Definición de columnas para la tabla de inventario
   * Incluye columna de libro y columna de stock editable con controles
   */
  const columns = [
    {
      key: "book.name",
      header: "Libro",
      render: (_: string, item: Props['inventory'][0]) => (
        <h4 className="text-sm text-start">{formatBookName(item.book.name)}</h4>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      render: (_: number, item: Props['inventory'][0]) => {
        const { stock, criticalStock, lowStock, book } = item;
        return (
          <div className="relative w-44">
            <div
              className={`text-sm ${
                stock >= lowStock
                  ? "text-primary"
                  : stock >= criticalStock
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              <div className="flex items-center px-2">
                <div className="flex items-center gap-2">
                  <span>Stock:</span>
                  <input
                    id={`stock-${book.id}`}
                    name={`stock-${book.id}`}
                    className="border-none rounded p-1 w-16"
                    type="number"
                    value={
                      editingItem === book.id
                        ? newStocks[book.id]
                        : stock
                    }
                    onChange={(e) => {
                      handleStockChange(book.id, e.target.value);
                    }}
                    disabled={!enableEditing}
                  />
                </div>
                <div
                  className="flex items-center gap-1 absolute right-0"
                  hidden={editingItem !== book.id}
                >
                  <button
                    className="p-1 bg-green-500 rounded hover:bg-green-300 transition-colors text-white cursor-pointer"
                    onClick={() => {
                      handleChangeStock(book.id, book.name);
                    }}
                  >
                    <Check size={15} />
                  </button>
                  <button
                    className="p-1 bg-red-500 rounded hover:bg-red-300 transition-colors text-white cursor-pointer"
                    onClick={() => {
                      setEditingItem(null);
                    }}
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Título de la categoría */}
        <h3 className="font-bold text-primary text-xl">
          {capitalizeWords(inventory[0]?.book.category.replaceAll("_", " "))}
        </h3>

        {/* Tabla de inventario usando CustomTable con datos ordenados alfabéticamente */}
        <CustomTable 
          columns={columns} 
          data={inventory.sort((a, b) => a.book.name.localeCompare(b.book.name))}
          rowClassName="!h-auto"
        />
      </div>
    </>
  );
};
