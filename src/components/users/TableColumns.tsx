"use client";

import { deleteUser } from "@/actions/users/delete-user";
import { submitAlert } from "@/utils/submitAlert";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  role: "admin" | "productor" | "leader";
};

const handleDeleteUser = async (
  id: string,
  setLoading: (id: string | null) => void
) => {
  setLoading(id);

  try {
    const result = await submitAlert({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará al usuario permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (result.isConfirmed) {
      const { ok, message } = await deleteUser(id);
      if (!ok) {
        submitAlert({ title: message, icon: "error" });
        return;
      }
      submitAlert({ title: message, icon: "success" });
    }
  } finally {
    setLoading(null);
  }
};

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
          <ArrowUpDown size={15} />
        </button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "role",
    header: () => <div className="font-bold">Rol</div>,
  },
  {
    accessorKey: "email",
    header: () => <div className="font-bold">Correo electrónico</div>,
  },
  {
    accessorKey: "phone",
    header: () => <div className="font-bold">Teléfono</div>,
  },
  {
    accessorKey: "city",
    header: () => <div className="font-bold">Ciudad</div>,
  },
  {
    id: "actions",
    header: () => <div className="font-bold">Acciones</div>,
    cell: ({ row }) => {
      const [loadingId, setLoadingId] = useState<string | null>(null);
      const isLoading = loadingId === row.original.id;
      const { data: session } = useSession();

      return (
        <div className="flex items-center justify-center gap-2">
          {session?.user.role === "admin" && (
            <button
              onClick={() => handleDeleteUser(row.original.id, setLoadingId)}
              className="text-red-500 cursor-pointer bg-red-500/20 rounded p-1 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Trash size={20} />
              )}
            </button>
          )}
        </div>
      );
    },
  },
];
