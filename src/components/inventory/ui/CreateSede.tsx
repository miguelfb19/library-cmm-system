"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { submitAlert } from "@/utils/submitAlert";
import { toast } from "sonner";
import { createNewSede } from "@/actions/inventory/create-new-sede";
import { capitalizeWord, capitalizeWords } from "@/utils/capitalize";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import { CustomDialog } from "../../ui/CustomDialog";

export const CreateSede = () => {
  const [sedeCity, setsedeCity] = useState("");
  const [sedeLeader, setsedeLeader] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const onCreateSede = async () => {
    setIsCreating(true);
    setOpenModal(false);

    const result = await submitAlert({
      title: "Crear sede",
      html: `¿Estás seguro de que quieres crear la sede <b>${sedeCity}</b>?`,
      icon: "warning",
      confirmButtonText: "Crear",
      showCancelButton: true,
    });

    if (result.isDenied || result.isDismissed) {
      toast.info("Creación de sede cancelada");
      setsedeCity("");
      setsedeLeader("");
      setIsCreating(false);
      return;
    }

    const data = {
      city: capitalizeWord(sedeCity),
      leader: capitalizeWords(sedeLeader),
    };

    const { ok, message, sede } = await createNewSede(data);
    if (!ok) {
      toast.error(message);
      setsedeCity("");
      setsedeLeader("");
      setIsCreating(false);
      return;
    }

    toast.success(`Sede ${sede?.city} creada correctamente`);
    setsedeCity("");
    setsedeLeader("");
    setIsCreating(false);
  };

  return (
    <CustomDialog
      trigger={
        <button className="btn-blue mt-5" onClick={() => setOpenModal(true)}>
          Agregar sede
        </button>
      }
      title="Crear una sede"
      open={openModal}
      onOpenChange={setOpenModal}
      footer={
        <button
          type="button"
          className={`btn-blue ${
            isCreating ? "pointer-events-none opacity-50" : ""
          }`}
          onClick={onCreateSede}
          disabled={isCreating}
        >
          {isCreating ? <LoadingSpinner size={10} /> : "Crear sede"}
        </button>
      }
    >
      <form className="flex flex-col gap-4">
        <div className="flex max-md:flex-col gap-2">
          <Input
            placeholder="Ciudad de la sede"
            value={sedeCity}
            onChange={(e) => setsedeCity(e.target.value)}
          />
          <Input
            placeholder="Nombre del líder o responsable"
            value={sedeLeader}
            onChange={(e) => setsedeLeader(e.target.value)}
          />
        </div>
      </form>
    </CustomDialog>
  );
};
