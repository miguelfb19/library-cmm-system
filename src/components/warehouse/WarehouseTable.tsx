"use client";

import { Warehouse } from "@/interfaces/Warehouse";
import { capitalizeWords } from "@/utils/capitalize";
import { Input } from "../ui/input";
import { useState } from "react";
import Link from "next/link";

interface Props {
  warehouse: Warehouse;
  userRole: string;
}

export const WarehouseTable = ({ warehouse, userRole }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInventory = warehouse.inventory.filter((item) =>
    item.book.name
      .toLowerCase()
      .replaceAll("_", " ")
      .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <Input
          type="text"
          placeholder="Buscar libro..."
          className="md:w-1/2"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        {userRole === "admin" && (
          <Link
            href={`/dashboard/leader/inventory/sede/${warehouse.id}`}
            className="btn-blue !w-auto"
          >
            Modificar inventario de bodega
          </Link>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[50rem] md:min-w-full text-sm">
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
            {filteredInventory.map((item) => (
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
                <td className="text-green-500">100</td>
                <td className="text-red-500">50</td>
                <td className="text-primary">{item.stock + 100 - 50}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
