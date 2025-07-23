"use client";

import { Pencil } from "lucide-react";
import { CustomDialog } from "../ui/CustomDialog";
import { Order } from "@/interfaces/Order";
import { capitalizeWords } from "@/utils/capitalize";
import { Input } from "../ui/input";
import { Book } from "@/interfaces/Book";
import { useState } from "react";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { toast } from "sonner";
import { editOrder } from "@/actions/orders/edit-order";
import { DatePicker } from "../ui/DatePicker";

/**
 * Interface para las propiedades del componente EditOrder
 * @property order - Orden a editar con todos sus detalles
 * @property booksList - Lista completa de libros disponibles para selección
 */
interface Props {
  order: Order;
  booksList: Book[];
}

/**
 * Componente que permite editar los detalles de una orden existente
 * Maneja la modificación de libros y cantidades en una orden
 * Incluye validaciones y comunicación con el servidor
 */
export const EditOrder = ({ order, booksList }: Props) => {
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
  const [limitDate, setLimitDate] = useState<Date | undefined>(
    new Date(order.limitDate || "")
  );
  const [note, setNote] = useState<string | null>(null); // Notas del pedido

  // Estados para controlar el diálogo y el estado de carga
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //Actualiza el libro seleccionado en una línea específica del detalle

  const handleBookChange = (index: number, bookId: string) => {
    const newDetail = [...detail];
    newDetail[index].bookId = bookId;
    setDetail(newDetail);
  };

  //Actualiza la cantidad de libros en una línea específica del detalle

  const handleQuantityChange = (index: number, quantity: number) => {
    const newDetail = [...detail];
    newDetail[index].quantity = quantity;
    setDetail(newDetail);
  };

  const onEditOrder = async () => {
    if (detail.some((item) => item.bookId === "" || item.quantity <= 0)) {
      return toast.error("Por favor, complete todos los campos correctamente.");
    }

    setIsLoading(true);
    const updatedOrder = {
      ...order,
      detail: detail,
      limitDate: limitDate ? limitDate : null,
      note,
    };
    const res = await editOrder(updatedOrder, "ToAdmin");

    if (res.ok) {
      toast.success(res.message);
      setOpen(false);
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };

  return (
    <CustomDialog
      trigger={
        <button className="btn-blue !w-auto self-center !min-h-auto">
          <Pencil size={17} />
        </button>
      }
      title="Detalles del Pedido"
      size="xl"
      open={open}
      onOpenChange={setOpen}
    >
      <div className="flex flex-col gap-2 mb-5">
        <label htmlFor="limitDate" className="font-bold">
          Fecha Límite:
        </label>
        <DatePicker date={limitDate} setDate={setLimitDate} futureDatesOnly />
      </div>
      <ul className="space-y-5 max-h-[27rem] overflow-y-auto">
        {order.detail.map((item, index) => (
          <li key={item.id} className="flex items-center gap-5">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor={`book-${index}`} className="font-bold">
                Seleccione el libro:
              </label>
              <select
                name={`book-${index}`}
                id={`book-${index}`}
                className="custom-select w-full"
                value={detail[index].bookId}
                onChange={(e) => handleBookChange(index, e.target.value)}
              >
                <option value="">Seleccione un libro</option>
                {booksList.map((book) => (
                  <option key={book.id} value={book.id}>
                    {capitalizeWords(book.name.replaceAll("_", " "))} -{" "}
                    {capitalizeWords(book.category.replaceAll("_", " "))}
                  </option>
                ))}
              </select>
            </div>
            <Input
              type="number"
              id={`quantity-${index}`}
              name={`quantity-${index}`}
              value={detail[index].quantity}
              onChange={(e) =>
                handleQuantityChange(index, Number(e.target.value))
              }
              className="flex-2/12 self-end"
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
        className={`btn-blue md:!w-1/2 m-auto ${
          isLoading ? "pointer-events-none opacity-50" : ""
        }`}
        onClick={onEditOrder}
      >
        {isLoading ? <LoadingSpinner size={10} /> : "Editar"}
      </button>
    </CustomDialog>
  );
};
