"use client";

import { submitAlert } from "@/utils/submitAlert";
import { LoaderCircle, Trash } from "lucide-react";
import { useState } from "react";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { toast } from "sonner";
import { deleteSede } from "@/actions/inventory/delete-sede";

interface Props {
  userRole: "admin" | "productor" | "leader";
  sedeId: string;
}

export const DeleteSedeButton = ({ userRole, sedeId }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteSede = async () => {
    setIsDeleting(true);

    const result = await submitAlert({
      title: "Eliminar Sede",
      text: "¿Estás seguro de que quieres eliminar esta sede? Se eliminará toda la información relacionada con esta sede.",
      icon: "warning",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });

    if (result.isDenied || result.isDismissed) {
      toast.error("Operación cancelada");
      setIsDeleting(false);
      return;
    }

    const res = await deleteSede(sedeId);
    if (!res.ok) {
      toast.error(res.message);
      setIsDeleting(false);
      return;
    }

    toast.success(res.message);
    setIsDeleting(false);
  };

  if (userRole !== "admin") {
    return null;
  }

  return (
    <button
      onClick={handleDeleteSede}
      className={` ${
        isDeleting ? "opacity-50 cursor-not-allowed" : ""
      } absolute top-5 right-5 text-red-500 p-2 bg-red-100 rounded cursor-pointer hover:bg-red-200 transition-colors`}
      disabled={isDeleting}
    >
      {isDeleting ? <LoaderCircle className="animate-spin" size={15}/> : <Trash size={15} />}
    </button>
  );
};
