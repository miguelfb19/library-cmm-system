"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "../ui/input";
import { Fragment } from "react";
import { DialogTrigger } from "../ui/dialog";
import { changeRole } from "@/actions/users/change-role";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Role } from "@/generated/prisma";
import { UserPlus } from "lucide-react";
import { CustomTooltip } from '../ui/CustomTooltip';

/**
 * Interface que define las propiedades necesarias para la tabla de usuarios
 * @template TData - Tipo de datos que debe extender un objeto con id
 * @template TValue - Tipo de valor para las columnas
 * @property columns - Definición de columnas para la tabla
 * @property data - Datos a mostrar en la tabla
 */
interface UsersTableProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

/**
 * Componente que renderiza una tabla interactiva de usuarios
 * Incluye funcionalidades como:
 * - Filtrado por nombre
 * - Ordenamiento de columnas
 * - Cambio de roles (solo admin)
 * - Creación de nuevos usuarios (solo admin)
 */
export function UsersTable<TData extends { id: string }, TValue>({
  columns,
  data,
}: UsersTableProps<TData, TValue>) {
  // Hook para manejar la sesión del usuario y actualizarla
  const { update, data: session } = useSession();
  
  // Configuración de la tabla usando tanstack/react-table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Obtiene todos los roles disponibles del enum Role
  const roles = Object.values(Role);

  return (
    <>
      {/* Contenedor de controles superiores */}
      <div className="flex max-md:flex-col-reverse gap-5 justify-between items-center mb-4">
        {/* Input de búsqueda por nombre */}
        <Input
          placeholder="Buscar por nombre..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="md:max-w-sm"
        />
        {/* Botón para crear nuevo usuario (solo visible para admin) */}
        {session?.user.role === "admin" && (
          <DialogTrigger
            className="btn-blue !w-auto"
            disabled={session?.user.role !== "admin"}
          >
            <CustomTooltip text="Crear Nuevo Usuario">
              <UserPlus />
            </CustomTooltip>
          </DialogTrigger>
        )}
      </div>
      {/* Tabla de usuarios */}
      <div className="rounded border border-primary/30 overflow-auto max-w-[calc(100vw-7rem)] ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <Fragment key={cell.id}>
                      {cell.column.id === "role" ? (
                        <TableCell>
                          <select
                            name="role"
                            className={`border ${
                              session?.user.role === "admin"
                                ? "border-primary/40"
                                : "border-white"
                            } rounded focus-visible:outline-primary/50 p-1`}
                            defaultValue={cell.getValue() as string}
                            onChange={async (event) => {
                              const select = event.target;
                              const originalValue = cell.getValue() as string;
                              const newRole = select.value;

                              const res = await changeRole(
                                row.original.id,
                                newRole as "admin" | "productor" | "leader"
                              );
                              if (!res.ok) {
                                select.value = originalValue; // Restaurar el valor original
                                toast.error(res.message);
                                return;
                              }
                              toast.success(
                                `Rol del usuario ${row.getValue(
                                  "name"
                                )} cambiado a ${newRole}`
                              );
                              update();
                            }}
                          >
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </TableCell>
                      ) : (
                        <TableCell>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      )}
                    </Fragment>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
