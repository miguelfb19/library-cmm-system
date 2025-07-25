"use client";

// Importaciones necesarias para el componente
import { Warehouse } from "@/interfaces/Warehouse";
import { capitalizeWords } from "@/utils/capitalize";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import { OrderDetails } from "@/interfaces/Order";
import { toast } from "sonner";

/**
 * Interface que define las propiedades del componente
 * @property warehouse - Objeto que contiene el inventario completo de la bodega
 */
interface Props {
  warehouse: Warehouse;
  ordersDetails:
    | (OrderDetails & { order: { isProduction: boolean } })[]
    | undefined;
}

export const WarehouseTable = ({ warehouse, ordersDetails }: Props) => {
  // Estados para los términos de búsqueda
  const [searchTerm, setSearchTerm] = useState(""); // Búsqueda por nombre
  const [searchTerm2, setSearchTerm2] = useState(""); // Búsqueda por categoría

  /**
   * Filtra el inventario por nombre de libro
   * Normaliza el texto eliminando guiones bajos y considerando mayúsculas/minúsculas
   */
  const filteredInventory = warehouse.inventory.filter((item) =>
    item.book.name
      .toLowerCase()
      .replaceAll("_", " ")
      .includes(searchTerm.toLowerCase())
  );

  /**
   * Filtra el resultado anterior por categoría
   * Aplica el mismo proceso de normalización de texto
   */
  const filteredInventoryByCategory = filteredInventory.filter((item) =>
    item.book.category
      .toLowerCase()
      .replaceAll("_", " ")
      .includes(searchTerm2.toLowerCase())
  );

  // Mostrar toast solo una vez cuando no hay orderDetails
  useEffect(() => {
    if (!ordersDetails || ordersDetails.length === 0) {
      toast.info("No se encontraron detalles o cantidades de pedidos.");
    }
  }, [ordersDetails]);

  /**
   * Calcula la cantidad total de producción para un libro específico
   * sumando todas las cantidades de orderDetails que coincidan con el bookId
   */
  const getProductionQuantity = (
    bookId: string,
    { isProduction }: { isProduction: boolean }
  ): number => {
    if (!ordersDetails || ordersDetails.length === 0) return 0;

    return ordersDetails
      .filter(
        (detail) =>
          detail.bookId === bookId && detail.order.isProduction === isProduction
      )
      .reduce((total, detail) => total + detail.quantity, 0);
  };

  return (
    <>
      {/* Contenedor de campos de búsqueda */}
      <div className="flex max-md:flex-col-reverse items-center justify-between gap-2">
        {/* Input para búsqueda por nombre de libro */}
        <Input
          id="search-book-name"
          name="searchBookName"
          type="text"
          placeholder="Buscar libro..."
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        {/* Input para búsqueda por categoría */}
        <Input
          id="search-category"
          name="searchCategory"
          type="text"
          placeholder="Buscar categoría..."
          onChange={(e) => setSearchTerm2(e.target.value)}
          value={searchTerm2}
        />
      </div>

      {/* Contenedor de la tabla con scroll horizontal */}
      <div className="overflow-x-auto">
        <table className="min-w-[50rem] md:min-w-full text-sm">
          {/* Encabezados de la tabla */}
          <thead className="bg-secondary">
            <tr className="border-b h-10">
              <th>Libro</th>
              <th>Categoría</th>
              <th>Actual</th>
              <th>Producción</th>
              <th>Pedidos</th>
              <th>Esperado</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventoryByCategory.map((item) => {
              const finalInventory =
                item.stock +
                getProductionQuantity(item.book.id, { isProduction: true }) -
                getProductionQuantity(item.book.id, { isProduction: false });
              return (
                <tr
                  key={item.id}
                  className="text-center border-b hover:bg-secondary h-7"
                >
                  <td className="text-start w-60 md:w-80">
                    {capitalizeWords(item.book.name.replaceAll("_", " "))}
                  </td>
                  <td className="text-center">
                    {capitalizeWords(item.book.category.replaceAll("_", " "))}
                  </td>
                  <td>{item.stock}</td>
                  <td className="text-purple-500">
                    {getProductionQuantity(item.book.id, {
                      isProduction: true,
                    })}
                  </td>
                  <td className="text-yellow-500">
                    {getProductionQuantity(item.book.id, {
                      isProduction: false,
                    })}
                  </td>
                  <td
                    className={`${
                      finalInventory < 0 ? "text-red-500" : "text-green-500"
                    } font-bold`}
                  >
                    {finalInventory}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
