"use client";

import { Warehouse } from "@/interfaces/Warehouse";
import Link from "next/link";
import { Settings } from "lucide-react";
import { CustomTooltip } from "../ui/CustomTooltip";
import { NewOrder } from "../orders/NewOrder";
import { Book } from "@/interfaces/Book";

interface Props {
  warehouse: Warehouse;
  books: Book[];
  sedes: { id: string; city: string }[];
  sessionUserId: string;
}

export const WarehouseActions = ({
  warehouse,
  books,
  sedes,
  sessionUserId,
}: Props) => {
  return (
    <div className="flex items-center gap-3">
      <CustomTooltip text="Modificar inventario de bodega">
        <Link
          href={`/dashboard/leader/inventory/sede/${warehouse.id}`}
          className="btn-blue !w-auto text-center"
        >
          <Settings />
        </Link>
      </CustomTooltip>
      <NewOrder
        sedes={sedes || []}
        books={books || []}
        userId={sessionUserId}
        isProduction={true}
        userSede={null}
      />
    </div>
  );
};
