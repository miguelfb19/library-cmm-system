"use client";

import { Warehouse } from "@/interfaces/Warehouse";
import Link from "next/link";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { PackagePlus, Settings } from "lucide-react";

interface Props {
  warehouse: Warehouse;
}

export const WarehouseActions = ({ warehouse }: Props) => {
  return (
    <div className="flex items-center gap-3">
      <Tooltip>
        <TooltipContent>Modificar inventario de bodega</TooltipContent>
        <TooltipTrigger asChild>
          <Link
            href={`/dashboard/leader/inventory/sede/${warehouse.id}`}
            className="btn-blue md:!w-auto text-center"
          >
            <Settings />
          </Link>
        </TooltipTrigger>
      </Tooltip>
      <Tooltip>
        <TooltipContent>Realizar pedido a producción</TooltipContent>
        <TooltipTrigger asChild>
          <Link
            href={`/dashboard/leader/inventory/sede/${warehouse.id}`}
            className="btn-blue md:!w-auto text-center"
          >
            <PackagePlus />
          </Link>
        </TooltipTrigger>
      </Tooltip>
    </div>
  );
};
