"use client";

import { ShortSede } from "@/interfaces/Sede";
import { ParishSale } from "@/interfaces/ParishSale";
import { useParishProcessStore } from "@/store/parish-process-store";
import { SedeInventoryDetails } from "./SedeInventoryDetails";
import { getAllCategoriesInventory } from "./utils/get-all-categories-inventory";
import { ParishProcessesTable } from "./parish-processes/ParishProcessesTable";
import { Book } from "@/interfaces/Book";

/**
 * Props para el componente SedeInventoryHandler
 */
interface Props {
  /** Información básica de la sede (ID, nombre, líder) */
  sede: ShortSede;
  /** Lista de ventas parroquiales asociadas a la sede */
  parishSales: ParishSale[];
  books?: Book[]; // Opcional: lista de libros para mostrar en procesos parroquiales
}

/**
 * Componente manejador de inventario de sede
 *
 * Este componente actúa como un controlador que determina qué vista mostrar
 * basándose en el estado global de la aplicación:
 *
 * - Si `isViewProcesses` es true: Muestra la tabla de procesos parroquiales
 * - Si `isViewProcesses` es false: Muestra los detalles del inventario por categorías
 *
 * @param sede - Información básica de la sede
 * @param parishSales - Ventas parroquiales para mostrar en la tabla de procesos
 * @returns JSX.Element - La vista correspondiente según el estado actual
 */
export const SedeInventoryHandler = ({ sede, parishSales, books }: Props) => {
  // Obtiene el estado para determinar si se debe mostrar la vista de procesos parroquiales
  const { isViewProcesses } = useParishProcessStore();

  // Si está activada la vista de procesos parroquiales
  if (isViewProcesses) {
    // Renderiza la tabla con las ventas parroquiales
    return (
      <ParishProcessesTable
        parishSales={parishSales}
        books={books || []}
        sedeLeader={sede.leader}
      />
    );
  } else {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {getAllCategoriesInventory(sede).map((inventory, index) => (
          <SedeInventoryDetails inventory={inventory} sede={sede} key={index} />
        ))}
      </div>
    );
  }
};
