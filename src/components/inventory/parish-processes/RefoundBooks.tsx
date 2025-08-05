"use client";

import { ParishSale } from "@/interfaces/ParishSale";
import { BookDown } from "lucide-react";
import { CustomDialog } from "../../ui/CustomDialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { submitAlert } from "@/utils/submitAlert";
import { refoundBooks } from "@/actions/sales/refound-books";
import { toast } from "sonner";
import Loading from "@/app/dashboard/loading";

interface Props {
  sale: ParishSale;
  bookName: string;
}

export const RefoundBooks = ({ sale, bookName }: Props) => {
  const [refoundedBooks, setRefoundedBooks] = useState<number>(sale.quantity);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefound = async () => {
    setIsLoading(true);
    setIsOpen(false);

    const result = await submitAlert({
      title: "Devolviendo libros...",
      html: `Serán devueltos <b style="color: red;">${refoundedBooks}</b> libros de <b style="color: #0050b3;">${bookName}</b> al <b style="color: #0050b3;">INVENTARIO</b>.`,
      icon: "info",
      showCancelButton: true,
    });

    if (result.isDenied || result.isDismissed) {
      setIsLoading(false);
      setIsOpen(true);
      return;
    }

    const { ok, message } = await refoundBooks(sale, refoundedBooks);

    if (!ok) {
      toast.error(message);
      setIsLoading(false);
      setIsOpen(true);
      return;
    }

    toast.success(message);
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <Loading size={10}/>}
      <CustomDialog
        title="Libros devueltos"
        trigger={
          <button className="btn-blue" disabled={isLoading}>
            <BookDown />
          </button>
        }
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <div className="flex items-center justify-center gap-4">
          {/* Aquí puedes agregar el contenido del diálogo */}
          <p className="font-bold">
            ¿Cuántos libros fueron devueltos en la venta de esta parroquia?
          </p>
          <Input
            type="number"
            min={0}
            className="w-30"
            value={refoundedBooks}
            onChange={(e) => setRefoundedBooks(Number(e.target.value))}
          />
        </div>
        <button
          className="btn-blue"
          onClick={handleRefound}
          disabled={isLoading}
        >
          {isLoading ? "Devolviendo..." : "Aceptar"}
        </button>
      </CustomDialog>
    </>
  );
};
