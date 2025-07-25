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
import { submitAlert } from "@/utils/submitAlert";
import { toast } from "sonner";
import { receiveOrder } from "@/actions/orders/receive-order";
import { addOrderToInventory } from "@/actions/inventory/add-order-to-inventory";
import { substractOrderFromWarehouse } from "@/actions/warehouse/substract-order-from-warehouse";

interface Props {
  order: Order;
  bookList: Book[];
}

export const ReceiveOrder = ({ order, bookList }: Props) => {
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
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReciveOrder = async () => {
    setIsLoading(true);
    setIsOpen(false);

    const result = await submitAlert({
      title: "Aceptar Pedido",
      text: "¿Estás seguro de que deseas aceptar este pedido?",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
      icon: "warning",
    });

    if (result.isDismissed || result.isDenied) {
      setIsOpen(true);
      setIsLoading(false);
      return toast.error("Operación cancelada");
    }

    const { ok, message } = await receiveOrder({
      ...order,
      detail: detail,
      note: note,
    });

    if (!ok) {
      setIsOpen(true);
      setIsLoading(false);
      return toast.error(message);
    }

    // Actualizar el inventario de la sede y restar de la bodega
    const { message: inventoryMessage, ok: inventoryOk } =
      await addOrderToInventory(order.origin.id, detail);

    if (!order.isProduction) {
      // Restar de la bodega los libros recibidos
      const { message: warehouseMessage, ok: warehouseOk } =
        await substractOrderFromWarehouse(detail);
      // Mostrar mensajes de error si alguno falla en la actualizacion de la bodega
      if (!warehouseOk) {
        console.error(warehouseMessage);
      }
    }

    // Si la actualización del inventario de la sede falla, mostrar mensaje de error
    if (!inventoryOk) {
      setIsOpen(true);
      setIsLoading(false);
      return toast.error(inventoryMessage);
    }

    // Si todo sale bien, mostrar mensajes de éxito
    toast.success(message);
    toast.success(inventoryMessage);
    setDetail([]);
    setNote(null);
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
          {detail.map((item) => (
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
                id={`receive-quantity-${item.id}`}
                name={`receiveQuantity-${item.id}`}
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
          onClick={handleReciveOrder}
        >
          Aceptar
        </button>
      </CustomDialog>
    </>
  );
};
