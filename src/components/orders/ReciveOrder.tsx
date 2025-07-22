"use client";

import { useState } from "react";
import { CustomDialog } from "../ui/CustomDialog";
import { CheckCheck } from "lucide-react";
import { Order } from "@/interfaces/Order";
import { Book } from "@/interfaces/Book";
import Loading from "@/app/dashboard/loading";
import { capitalizeWords } from "@/utils/capitalize";
import { getBookCategory, getBookName } from "./utils";
import { Input } from "../ui/input";
import { LoadingSpinner } from "../ui/LoadingSpinner";

interface Props {
  order: Order;
  bookList: Book[];
}

export const ReciveOrder = ({ order, bookList }: Props) => {
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
  const [note, setNote] = useState<string | null>(order.note);
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

    const handleReciveOrder = async () => {
        setIsLoading(true);
        setIsOpen(false);
    
        // Aquí se puede agregar la lógica para recibir el pedido
        // Por ejemplo, actualizar el estado del pedido en la base de datos
    
        setIsLoading(false);
    };

  return (
    <>
      {isLoading && <Loading />}
      <CustomDialog
        title="Recibir Pedido"
        onOpenChange={setIsOpen}
        open={isOpen}
        trigger={
          <button className="btn-blue !w-auto self-center !min-h-auto">
            <CheckCheck size={18} />
          </button>
        }
        size="xl"
      >
        <ul className="space-y-5 max-h-[27rem] overflow-y-auto">
          {order.detail.map((item) => (
            <li key={item.id} className="flex items-center gap-5">
              <div>
                <span className="font-bold">
                  {capitalizeWords(
                    getBookName(item.bookId, bookList).replaceAll("_", " ")
                  )}
                </span>{" "}
                -{" "}
                <span>
                  {capitalizeWords(
                    getBookCategory(item.bookId, bookList).replaceAll("_", " ")
                  )}
                </span>
              </div>
              <Input
                defaultValue={item.quantity}
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
          onClick={handleReciveOrder}
        >
          Aceptar
        </button>
      </CustomDialog>
    </>
  );
};
