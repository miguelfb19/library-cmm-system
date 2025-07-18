"use client";

import { Send } from "lucide-react";
import { CustomDialog } from "../ui/CustomDialog";
import { Order } from "@/interfaces/Order";
import { capitalizeWords } from "@/utils/capitalize";
import { Input } from "../ui/input";
import { Book } from "@/interfaces/Book";
import { getBookCategory, getBookName } from "./utils";

interface Props {
  order: Order;
  booksList: Book[];
}

export const DispatchOrder = ({ order, booksList }: Props) => {
  const handleQuantityChange = (itemId: string, value: string) => {
    console.log(`Cantidad para el item ${itemId} cambiada a: ${value}`);
  };
  return (
    <CustomDialog
      trigger={
        <button className="btn-blue !w-auto self-center !min-h-auto">
          <Send size={17} />
        </button>
      }
      title="Detalles del Pedido"
      size="xl"
    >
      <ul className="space-y-5 max-h-[27rem] overflow-y-auto">
        {order.detail.map((item) => (
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
              defaultValue={item.quantity}
              onChange={(e) => handleQuantityChange(item.id, e.target.value)}
              className="w-24"
            />
          </li>
        ))}
      </ul>
      <button className="btn-blue md:!w-1/2 m-auto">Despachar</button>
    </CustomDialog>
  );
};
