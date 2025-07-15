"use client";

import { Warehouse } from "@/interfaces/Warehouse";
import { capitalizeWords } from "@/utils/capitalize";
import { Input } from "../ui/input";
import { useState } from "react";
import Link from "next/link";

interface Props {
  warehouse: Warehouse;
}

export const WarehouseTable = ({ warehouse }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTerm2, setSearchTerm2] = useState("");

  const filteredInventory = warehouse.inventory.filter((item) =>
    item.book.name
      .toLowerCase()
      .replaceAll("_", " ")
      .includes(searchTerm.toLowerCase())
  );
  const filteredInventoryByCategory = filteredInventory.filter((item) =>
    item.book.category
      .toLowerCase()
      .replaceAll("_", " ")
      .includes(searchTerm2.toLowerCase())
  );

  return (
    <>
      <div className="flex max-md:flex-col-reverse items-center justify-between gap-2">
        <Input
          type="text"
          placeholder="Buscar libro..."
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        <Input
          type="text"
          placeholder="Buscar categoría..."
          onChange={(e) => setSearchTerm2(e.target.value)}
          value={searchTerm2}
        />
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
            {filteredInventoryByCategory.map((item) => (
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
