"use client";

// Importaciones necesarias para la funcionalidad de la tabla
import { deleteUser } from "@/actions/users/delete-user";
import { submitAlert } from "@/utils/submitAlert";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

/**
 * Tipo que define la estructura de un usuario en la tabla
 * @property id - Identificador único del usuario
 * @property name - Nombre completo del usuario
 * @property email - Correo electrónico del usuario
 * @property phone - Número telefónico del usuario
 * @property city - Ciudad de residencia del usuario
 * @property role - Rol del usuario en el sistema (admin/productor/leader)
 */
export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  role: "admin" | "productor" | "leader";
};

/**
 * Función auxiliar para manejar la eliminación de usuarios
 * Incluye confirmación y feedback visual
 * @param id - ID del usuario a eliminar
 * @param setLoading - Función para actualizar el estado de carga
 */
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

/**
 * Definición de columnas para la tabla de usuarios
 * Incluye:
 * - Nombre (ordenable)
 * - Rol
 * - Correo electrónico
 * - Teléfono
 * - Ciudad
 * - Acciones (eliminación para admin)
 */
export const columns: ColumnDef<User>[] = [
  // Columna de nombre con capacidad de ordenamiento
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

  // Columna de rol (sin ordenamiento)
  {
    accessorKey: "role",
    header: () => <div className="font-bold">Rol</div>,
  },

  // Columna de correo electrónico
  {
    accessorKey: "email",
    header: () => <div className="font-bold">Correo electrónico</div>,
  },

  // Columna de teléfono
  {
    accessorKey: "phone",
    header: () => <div className="font-bold">Teléfono</div>,
  },

  // Columna de ciudad
  {
    accessorKey: "city",
    header: () => <div className="font-bold">Ciudad</div>,
  },

  // Columna de acciones (botón de eliminar)
  {
    id: "actions",
    header: () => <div className="font-bold">Acciones</div>,
    cell: ({ row }) => {
      // Estado local para manejar la carga durante la eliminación
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
