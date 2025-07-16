"use client";

import { Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import { CustomDialog } from "../../ui/CustomDialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { editSedeLeaderName } from "@/actions/inventory/edit-sede-leader-name";
import { toast } from "sonner";
import { CustomTooltip } from '../../ui/CustomTooltip';

interface Props {
  sedeId: string;
}

export const EditSedeLeader = ({ sedeId }: Props) => {
  const { data: session } = useSession();
  const [newName, setNewName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!session || session.user.role !== "admin") {
    return null; // Only admins can edit sede leaders
  }

  const onUpdateName = async () => {
    setIsLoading(true);

    const { ok, message } = await editSedeLeaderName(sedeId, newName);

    if (!ok) {
      toast.error(message);
      setIsLoading(false);
      return;
    }

    toast.success(message);
    setIsOpen(false);
    setNewName("");
    setIsLoading(false);
  };

  return (
    <CustomDialog
      title="Editar nombre de líder de sede"
      trigger={
        <CustomTooltip text="Editar nombre de líder de sede">
          <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="bg-slate-200 text-primary p-1 rounded cursor-pointer hover:brightness-105 transition-all"
            >
              <Pencil size={20} />
            </button>
        </CustomTooltip>
      }
      footer={
        <button
          type="button"
          className={`btn-blue ${
            isLoading ? "pointer-events-none opacity-50" : ""
          }`}
          onClick={onUpdateName}
        >
          {isLoading ? <LoadingSpinner size={10} /> : "Guardar"}
        </button>
      }
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <Input
        type="text"
        placeholder="Nuevo nombre"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
    </CustomDialog>
  );
};
