"use client";

// Importaciones necesarias para el componente
import { InventoryItem, Warehouse } from "@/interfaces/Warehouse";
import { capitalizeWords } from "@/utils/capitalize";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import { OrderDetails } from "@/interfaces/Order";
import { toast } from "sonner";
import { CustomTable } from "../ui/CustomTable";

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

  const columns = [
    {
      key: "book.name",
      header: "Libro",
      render: (_: string, item: InventoryItem) => (
        <div className="text-start w-60 md:w-80">
          {capitalizeWords(item.book.name.replaceAll("_", " "))}
        </div>
      ),
    },
    {
      key: "book.category",
      header: "Categoría",
      render: (_: string, item: InventoryItem) => (
        <div className="text-center">
          {capitalizeWords(item.book.category.replaceAll("_", " "))}
        </div>
      ),
    },
    {
      key: "stock",
      header: "Actual",
      render: (value: number, _: InventoryItem) => <div>{value}</div>,
    },
    {
      key: "production",
      header: "Producción",
      render: (_: number, item: InventoryItem) => (
        <div className="text-purple-500">
          {getProductionQuantity(item.book.id, { isProduction: true })}
        </div>
      ),
    },
    {
      key: "orders",
      header: "Pedidos",
      render: (_: number, item: InventoryItem) => (
        <div className="text-yellow-500">
          {getProductionQuantity(item.book.id, { isProduction: false })}
        </div>
      ),
    },
    {
      key: "expected",
      header: "Esperado",
      render: (_: number, item: InventoryItem) => {
        const finalInventory =
          item.stock +
          getProductionQuantity(item.book.id, { isProduction: true }) -
          getProductionQuantity(item.book.id, { isProduction: false });
        return (
          <div
            className={`${
              finalInventory < 0 ? "text-red-500" : "text-green-500"
            } font-bold`}
          >
            {finalInventory}
          </div>
        );
      },
    },
  ];
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

      <CustomTable
        columns={columns}
        data={filteredInventoryByCategory}
        rowClassName="!h-7"
      />
    </>
  );
};
