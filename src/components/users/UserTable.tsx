"use client";

import { changeRole } from "@/actions/users/change-role";
import { deleteUser } from "@/actions/users/delete-user";
import { Role } from "@/generated/prisma";
import { User } from "@/interfaces/User";
import { submitAlert } from "@/utils/submitAlert";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { useState } from "react";
import { Loader2, Trash, UserPlus } from "lucide-react";
import { Sede } from "@/interfaces/Sede";
import { capitalizeWords } from "../../utils/capitalize";
import { changeSede } from "@/actions/users/change-link-sede";
import { DialogTrigger } from "../ui/dialog";

interface Props {
  users: User[];
  sedes: Sede[];
}

export const UserTable = ({ users, sedes }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loadingUsers, setLoadingUsers] = useState<Set<string>>(new Set());

  const { update, data: session } = useSession();
  const roles = Object.values(Role);

  const handleDeleteUser = async (id: string) => {
    setLoadingUsers((prev) => new Set(prev).add(id));

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
      setLoadingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangeRole = async (
    user: User,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const select = event.target;
    const originalValue = user.role;
    const newRole = select.value;

    const res = await changeRole(
      user.id,
      newRole as "admin" | "productor" | "leader"
    );
    if (!res.ok) {
      select.value = originalValue; // Restaurar el valor original
      toast.error(res.message);
      return;
    }
    toast.success(`Rol del usuario ${user.name} cambiado a ${newRole}`);
    update();
  };

  const handleChangeSede = async (
    user: User,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const select = event.target;
    const originalValue = user.sedeId;
    const newSedeId = select.value === "all" ? null : select.value;

    const res = await changeSede(user.id, newSedeId);
    if (!res.ok) {
      select.value = originalValue || user.Sede?.city || "all"; // Restaurar el valor original
      toast.error(res.message);
      return;
    }
    toast.success(
      `Sede del usuario ${user.name} cambiada a ${
        newSedeId
          ? capitalizeWords(
              sedes.find((s) => s.id === newSedeId)?.city || "Todas"
            )
          : "Todas"
      }`
    );
    update();
  };

  return (
    <div>
      <div className="flex justify-between">
        <Input
          id="search-users-name"
          name="searchUsersName"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:max-w-sm mb-7"
        />
        <DialogTrigger>
          <button className="btn-blue">
            <UserPlus />
          </button>
        </DialogTrigger>
      </div>
      <div className="overflow-auto flex-1">
        <table className="min-w-[50rem] md:min-w-full text-sm text-center">
          {/* Encabezados de la tabla con campos principales */}
          <thead className="bg-secondary font-bold">
            <tr className="border-b h-10">
              <td>Nombre</td>
              <td>Rol</td>
              <td>Correo electrónico</td>
              <td>Teléfono</td>
              <td>Ciudad</td>
              <td>Sede asociada</td>
              <td>Acciones</td>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b h-10">
                <td className="!text-start pl-2">{user.name}</td>
                <td>
                  <select
                    key={`role-select-${user.id}`}
                    id={`role-${user.id}`}
                    name="role"
                    className={`border ${
                      session?.user.role === "admin"
                        ? "border-primary/40"
                        : "border-white"
                    } rounded focus-visible:outline-primary/50 p-1`}
                    value={user.role}
                    disabled={session?.user.role !== "admin"}
                    onChange={(event) => handleChangeRole(user, event)}
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.city}</td>
                <td>
                  <select
                    name="sede"
                    id={`sede-${user.id}`}
                    className={`border ${
                      session?.user.role === "admin"
                        ? "border-primary/40"
                        : "border-white"
                    } rounded focus-visible:outline-primary/50 p-1`}
                    value={
                      user.sedeId
                        ? sedes.filter((sede) => sede.id === user.sedeId)[0]?.id
                        : "all"
                    }
                    disabled={session?.user.role !== "admin"}
                    onChange={(event) => handleChangeSede(user, event)}
                  >
                    {sedes.map((sede) =>
                      sede.city !== "bodega" ? (
                        <option key={sede.id} value={sede.id}>
                          {capitalizeWords(sede.city)}
                        </option>
                      ) : null
                    )}
                    <option value="all">Todas</option>
                  </select>
                </td>
                <td>
                  <div className="flex items-center justify-center gap-2">
                    {session?.user.role === "admin" && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-500 cursor-pointer bg-red-500/20 rounded p-1 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loadingUsers.has(user.id)}
                      >
                        {loadingUsers.has(user.id) ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          <Trash size={20} />
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
