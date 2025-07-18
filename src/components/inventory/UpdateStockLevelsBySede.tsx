"use client";

import { ShortSede } from "@/interfaces/Sede";
import { getAllCategoriesInventory } from "./utils/get-all-categories-inventory";
import { useState } from "react";
import { submitAlert } from "@/utils/submitAlert";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { capitalizeWords } from "@/utils/capitalize";
import { editStockLevelsByCategory } from "@/actions/inventory/edit-stock-levels-by-category";
import { Category } from "@/generated/prisma";
import { CustomDialog } from "../ui/CustomDialog";

/**
 * Interface que define las propiedades del componente
 * @property sede - Sede cuyos niveles de stock se van a actualizar
 */
interface Props {
  sede: ShortSede;
}

/**
 * Componente que permite actualizar los niveles de stock crítico y bajo para cada categoría en una sede
 * Proporciona una interfaz modal para editar los valores de stock
 */
export const UpdateStockLevelsBySede = ({ sede }: Props) => {
  // Estado para controlar qué item está siendo editado
  const [editingItem, setEditingItem] = useState<string | number | null>(null);
  
  // Estados para almacenar los nuevos valores de stock
  const [newCriticalStocks, setNewCriticalStocks] = useState<Record<string, string>>({});
  const [newLowStocks, setNewLowStocks] = useState<Record<string, string>>({});
  
  // Estado para controlar la visibilidad del modal
  const [openModal, setOpenModal] = useState(false);

  /**
   * Maneja el cambio en el valor del stock crítico
   * @param inventoryId - ID del inventario a modificar
   * @param value - Nuevo valor de stock crítico
   */
  const handleCriticalStockChange = (inventoryId: string, value: string) => {
    setEditingItem(inventoryId);
    setNewCriticalStocks((prev) => ({ ...prev, [inventoryId]: value }));
  };

  /**
   * Maneja el cambio en el valor del stock bajo
   * @param inventoryId - ID del inventario a modificar
   * @param value - Nuevo valor de stock bajo
   */
  const handleLowStockChange = (inventoryId: string, value: string) => {
    setEditingItem(inventoryId);
    setNewLowStocks((prev) => ({ ...prev, [inventoryId]: value }));
  };

  /**
   * Maneja la actualización de los niveles de stock
   * Muestra una alerta de confirmación antes de realizar los cambios
   * @param category - Categoría del inventario a modificar
   * @param values - Nuevos valores de stock crítico y bajo
   */
  const handleChangeStock = async (
    category: Category,
    values: { criticalStock: string; lowStock: string }
  ) => {
    setOpenModal(false);

    const result = await submitAlert({
      title: "Cambiar stock",
      html: `¿Estás seguro de que quieres cambiar el stock de ${category.replaceAll(
        "_",
        " "
      )}?`,
      icon: "warning",
      confirmButtonText: "Cambiar stock",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      await editStockLevelsByCategory(sede.id, category, {
        criticalStock: values.criticalStock,
        lowStock: values.lowStock,
      });
      setEditingItem(null);
      return toast.success("Stock del libro editado correctamente");
    }
    toast.info("Cambios cancelados");
    setEditingItem(null);
  };

  return (
    <CustomDialog
      trigger={
        <button className="btn-blue !w-auto">Cambiar niveles de stock</button>
      }
      title={`Cambiar niveles de stock en ${sede.city}`}
      onOpenChange={setOpenModal}
      open={openModal}
      footer={
        <button type="button" className="btn-blue">
          Guardar cambios
        </button>
      }
    >
      {/* Contenedor con scroll para la lista de categorías */}
      <div className="max-h-[60vh] overflow-y-auto">
        {/* Mapeo de categorías de inventario */}
        {getAllCategoriesInventory(sede).map((inventory, index) => (
          <div key={index} className="flex flex-col gap-2 mb-5">
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-primary text-xl">
                {capitalizeWords(
                  inventory[0]?.book.category.replaceAll("_", " ")
                )}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-yellow-600">Stock bajo:</p>
                    <input
                      className="w-20 pl-5"
                      type="number"
                      defaultValue={inventory[0].lowStock || 0}
                      onChange={(e) =>
                        handleLowStockChange(inventory[0].id, e.target.value)
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-red-600">Stock crítico:</p>
                    <input
                      className="w-20 pl-5"
                      type="number"
                      defaultValue={inventory[0].criticalStock || 0}
                      onChange={(e) =>
                        handleCriticalStockChange(
                          inventory[0].id,
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <div
                  className="flex items-center gap-1"
                  hidden={editingItem !== inventory[0].id}
                >
                  <button
                    className="p-1 bg-green-500 rounded hover:bg-green-300 transition-colors text-white cursor-pointer"
                    onClick={() => {
                      handleChangeStock(
                        inventory[0].book.category as Category,
                        {
                          // Usa el nuevo valor si existe, sino mantiene el valor actual
                          criticalStock:
                            newCriticalStocks[inventory[0].id] ||
                            inventory[0].criticalStock.toString(),
                          lowStock:
                            newLowStocks[inventory[0].id] ||
                            inventory[0].lowStock.toString(),
                        }
                      );
                    }}
                  >
                    <Check size={15} />
                  </button>
                  
                  {/* Botón para cancelar la edición */}
                  <button
                    className="p-1 bg-red-500 rounded hover:bg-red-300 transition-colors text-white cursor-pointer"
                    onClick={() => {
                      setEditingItem(null); // Resetea el estado de edición
                    }}
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CustomDialog>
  );
};
