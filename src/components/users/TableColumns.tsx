"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  id: string
  name: string
  email: string
  phone: string
  city: string
  role: "admin" | "user"
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 text-left cursor-pointer font-bold"
        >
          Nombre
          <ArrowUpDown size={15}/>
        </button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: () => (<div className="font-bold">Rol</div>),
  },
  {
    accessorKey: "email",
    header: () => (<div className="font-bold">Correo electrónico</div>),
  },
  {
    accessorKey: "phone",
    header: () => (<div className="font-bold">Teléfono</div>),
  },
  {
    accessorKey: "city",
    header: () => (<div className="font-bold">Ciudad</div>),
  },
]