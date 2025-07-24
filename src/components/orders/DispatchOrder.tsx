"use client";

import { Send } from "lucide-react";
import { CustomDialog } from "../ui/CustomDialog";
import { Order } from "@/interfaces/Order";
import { capitalizeWords } from "@/utils/capitalize";
import { Input } from "../ui/input";
import { Book } from "@/interfaces/Book";
import { getBookCategory, getBookName } from "./utils";
import { useState, useEffect } from "react";
import { dispatchOrder } from "@/actions/orders/dispatch-order";
import { submitAlert } from "@/utils/submitAlert";
import { toast } from "sonner";
import Loading from "@/app/dashboard/loading";

interface Props {
  order: Order;
  booksList: Book[];
}

export const DispatchOrder = ({ order, booksList }: Props) => {
  // Estado para manejar los detalles de la orden que pueden ser modificados
  const [detail, setDetail] = useState<
    { bookId: string; quantity: number; id: string; orderId: string }[]
  >(
    order.detail.map((item) => ({
      bookId: item.bookId,
      quantity: item.quantity,
      id: item.id,
      orderId: item.orderId,
    }))
  );
  const [note, setNote] = useState<string | null>(null);

  // Estados para controlar el diálogo y el estado de carga
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Actualizar el estado detail cuando cambie la orden (para reflejar anexados)
  useEffect(() => {
    setDetail(
      order.detail.map((item) => ({
        bookId: item.bookId,
        quantity: item.quantity,
        id: item.id,
        orderId: item.orderId,
      }))
    );
  }, [order.detail]);

  const handleDispathOrder = async () => {
    setIsLoading(true);
    setOpen(false);

    const result = await submitAlert({
      title: "¿Estás seguro de despachar este pedido?",
      confirmButtonText: "Despachar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
      icon: "question",
    });

    if (result.isDenied || result.isDismissed) {
      toast.error("Despacho cancelado");
      setIsLoading(false);
      setOpen(false);
      return;
    }

    const { ok, message } = await dispatchOrder({
      ...order,
      detail,
      note,
      dispatchData: order.dispatchData,
    });

    if (!ok) {
      toast.error(message);
      setIsLoading(false);
      setOpen(true);
      return;
    }

    toast.success(message);
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <Loading />}
      <CustomDialog
        trigger={
          <button className="btn-blue !w-auto self-center !min-h-auto">
            <Send size={17} />
          </button>
        }
        title="Detalles del Pedido"
        size="xl"
        open={open}
        onOpenChange={setOpen}
      >
        <ul className="space-y-5 max-h-[27rem] overflow-y-auto">
          {detail.map((item) => (
            <li key={item.id} className="flex items-center gap-5">
              <div>
                <span className="font-bold">
                  {capitalizeWords(
                    getBookName(item.bookId, booksList).replaceAll("_", " ")
                  )}
                </span>{" "}
                -{" "}
                <span>
                  {capitalizeWords(
                    getBookCategory(item.bookId, booksList).replaceAll("_", " ")
                  )}
                </span>
              </div>
              <Input
                min={0}
                value={item.quantity === 0 ? "" : item.quantity}
                type="number"
                onChange={(e) =>
                  setDetail((prev) =>
                    prev.map((detail) =>
                      detail.id === item.id
                        ? { ...detail, quantity: Number(e.target.value) }
                        : detail
                    )
                  )
                }
                className="w-24"
                placeholder="Cantidad"
              />
            </li>
          ))}
        </ul>
        <textarea
          name="note"
          id="note"
          placeholder="Notas sobre el pedido"
          maxLength={500}
          className="w-full min-h-10 max-h-24 h-24 p-2 border border-gray-300 rounded"
          value={note || undefined}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          className="btn-blue md:!w-1/2 m-auto"
          onClick={handleDispathOrder}
        >
          Despachar
        </button>
      </CustomDialog>
    </>
  );
};
