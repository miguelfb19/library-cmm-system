"use client";

import { Pencil, Send } from "lucide-react";
import { CustomDialog } from "../ui/CustomDialog";
import { Order } from "@/interfaces/Order";
import { capitalizeWords } from "@/utils/capitalize";
import { Input } from "../ui/input";
import { Book } from "@/interfaces/Book";
import { useState } from "react";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { toast } from "sonner";
import { editOrder } from "@/actions/orders/edit-order";

interface Props {
  order: Order;
  booksList: Book[];
}

export const EditOrder = ({ order, booksList }: Props) => {
  const [detail, setDetail] = useState<{ bookId: string; quantity: number }[]>(
    order.detail
  );
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBookChange = (index: number, bookId: string) => {
    const newDetail = [...detail];
    newDetail[index].bookId = bookId;
    setDetail(newDetail);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const newDetail = [...detail];
    newDetail[index].quantity = quantity;
    setDetail(newDetail);
  };

  const onEditOrder = async () => {
    if(detail.some(item => item.bookId === "" || item.quantity <= 0)) {
      return toast.error("Por favor, complete todos los campos correctamente.");
    }

    setIsLoading(true);
    const res = await editOrder(order);

    if(res.ok) {
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
      <ul className="space-y-5 max-h-[27rem] overflow-y-auto">
        {order.detail.map((item, index) => (
          <li key={item.id} className="flex items-center gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor={`book-${index}`} className="font-bold">
                Seleccione el libro:
              </label>
              <select
                name={`book-${index}`}
                id={`book-${index}`}
                className="custom-select w-full"
                defaultValue={item.bookId}
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
              value={item.quantity}
              onChange={(e) =>
                handleQuantityChange(index, Number(e.target.value))
              }
              className="w-24 self-end"
            />
          </li>
        ))}
      </ul>
      <button className={`btn-blue md:!w-1/2 m-auto ${isLoading ? "pointer-events-none opacity-50" : ""}`} onClick={onEditOrder}>
        {isLoading ? <LoadingSpinner size={10} /> : "Editar"}
      </button>
    </CustomDialog>
  );
};
