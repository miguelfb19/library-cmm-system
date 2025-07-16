"use client";

import { Warehouse } from "@/interfaces/Warehouse";
import Link from "next/link";
import { PackagePlus, Settings } from "lucide-react";
import { CustomTooltip } from "../ui/CustomTooltip";

interface Props {
  warehouse: Warehouse;
}

export const WarehouseActions = ({ warehouse }: Props) => {
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
      <CustomTooltip text="Realizar pedido a producción">
        <Link
          href={`/dashboard/leader/inventory/sede/${warehouse.id}`}
          className="btn-blue !w-auto text-center"
        >
          <PackagePlus />
        </Link>
      </CustomTooltip>
    </div>
  );
};
