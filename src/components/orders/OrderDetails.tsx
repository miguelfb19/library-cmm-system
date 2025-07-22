import { ListCollapse } from "lucide-react";
import { CustomDialog } from "../ui/CustomDialog";
import { CustomTooltip } from "../ui/CustomTooltip";
import { capitalizeWords } from "@/utils/capitalize";
import { getBookName } from "./utils";
import { Book } from "@/interfaces/Book";
import { Order } from "@/interfaces/Order";
import { OrderStatus } from './OrderStatus';

interface Props {
  order: Order;
  books: Book[];
}

export const OrderDetails = ({ order, books }: Props) => {

  const {name, phone, address, city, document} = order.dispatchData || {};

  return (
    <CustomDialog
      trigger={
        <CustomTooltip text="Detalles del Pedido" withSpan>
          <button className="btn-blue !w-auto self-center !min-h-auto">
            <ListCollapse size={17} />
          </button>
        </CustomTooltip>
      }
      title="Detalles del Pedido"
    >
      <div className="justify-self-start flex items-center gap-2">
        <span className="font-bold">Estado: </span>
        <OrderStatus state={order.state} />
      </div>
      <ul>
        {order.detail.map((item) => (
          <li key={item.id}>
            {capitalizeWords(
              getBookName(item.bookId, books).replaceAll("_", " ")
            )}{" "}
            x <span className="font-bold">{item.quantity}</span>
          </li>
        ))}
      </ul>
      {order.dispatchData && (
        <div className="mt-4">
          <span className="font-bold text-primary">Datos de envío: </span>
          <div>{name}</div>
          <div>{phone}</div>
          <div>{address}</div>
          <div>{city}</div>
          <div>{document}</div>
        </div>
      )}
      {order.note && (
        <div className="mt-4">
          <span className="font-bold text-primary">Notas: </span>
          {order.note}
        </div>
      )}
    </CustomDialog>
  );
};
