"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { submitAlert } from "@/utils/submitAlert";
import { toast } from "sonner";
import { createNewSede } from "@/actions/inventory/create-new-sede";
import { capitalizeWord, capitalizeWords } from "@/utils/capitalize";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { CustomDialog } from "../ui/CustomDialog";

/**
 * Componente para crear nuevas sedes
 * Incluye:
 * - Validación de formato para el nombre de la sede
 * - Modal de confirmación
 * - Manejo de estados de carga
 */
export const CreateSede = () => {
  // Estados para manejar el formulario y modal
  const [sedeCity, setsedeCity] = useState("");           // Nombre de la sede
  const [sedeLeader, setsedeLeader] = useState("");       // Líder de la sede
  const [isCreating, setIsCreating] = useState(false);    // Estado de creación
  const [openModal, setOpenModal] = useState(false);      // Control del modal

  // Expresión regular para validar el formato del nombre de la sede
  // Debe estar en minúsculas y usar guiones bajos para espacios
  const regex = /^[a-z]+(_[a-z]+)*$/;

  /**
   * Maneja la creación de una nueva sede
   * Incluye:
   * - Validación del formato del nombre
   * - Confirmación mediante modal
   * - Creación y feedback
   */
  const onCreateSede = async () => {
    // Validación del formato del nombre de la sede
    if(regex.test(sedeCity) === false) {
      toast.error(
        "El nombre de la sede debe estar en minúsculas y separado por guiones bajos (_)."
      );
      return;
    }
    
    // Activar estado de carga y cerrar modal
    setIsCreating(true);
    setOpenModal(false);

    // Mostrar alerta de confirmación
    const result = await submitAlert({
      title: "Crear sede",
      html: `¿Estás seguro de que quieres crear la sede <b>${sedeCity}</b>?`,
      icon: "warning",
      confirmButtonText: "Crear",
      showCancelButton: true,
    });

    // Manejar cancelación
    if (result.isDenied || result.isDismissed) {
      toast.info("Creación de sede cancelada");
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
      description="El nombre de la sede debe ser único, escrito en minúsculas y espacios separados por guión bajo (_)."
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
      size="lg"
    >
      <form className="flex flex-col gap-4">
        <div className="flex max-md:flex-col gap-2">
          <Input
            id="sede-city"
            name="sedeCity"
            placeholder="Ciudad de la sede"
            value={sedeCity}
            onChange={(e) => setsedeCity(e.target.value)}
          />
          <Input
            id="sede-leader"
            name="sedeLeader"
            placeholder="Nombre del líder o responsable"
            value={sedeLeader}
            onChange={(e) => setsedeLeader(e.target.value)}
          />
        </div>
      </form>
    </CustomDialog>
  );
};
