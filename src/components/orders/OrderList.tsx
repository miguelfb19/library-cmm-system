import { Order } from "@/interfaces/Order";
import { Empty } from "../ui/Empty";
import { capitalizeWords } from "@/utils/capitalize";
import { Status } from "../ui/Status";
import { CustomDialog } from "../ui/CustomDialog";
import { ListCollapse } from "lucide-react";
import { Book } from "@/interfaces/Book";
import { User } from "@/interfaces/User";
import dayjs from "dayjs";
import { DispatchOrder } from "./DispatchOrder";
import { getBookName } from "./utils";
import { CustomTooltip } from "../ui/CustomTooltip";
import { EditOrder } from "./EditOrder";

interface Props {
  orders: Order[];
  books: Book[];
  users: User[];
  userRole: "admin" | "leader" | "user";
  userId: string;
}

export const OrderList = ({
  orders,
  books,
  users,
  userRole,
  userId,
}: Props) => {
  if (orders.length === 0) {
    return <Empty text="No hay pedidos disponibles" />;
  }

  const getUserName = (id: string) => {
    const user = users.find((user) => user.id === id);
    return user ? user.name : "Desconocido";
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[50rem] md:min-w-full text-sm text-center">
        <thead className="bg-secondary font-bold">
          <tr className="border-b h-10">
            <td>ID</td>
            <td>Origen</td>
            <td>Usuario</td>
            <td>Estado</td>
            <td>Fecha Límite</td>
            <td>Acciones</td>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="text-center border-b hover:bg-secondary h-10"
            >
              <td className="truncate max-w-20">{order.id}</td>
              <td>{capitalizeWords(order.origin.city.replaceAll("-", " "))}</td>
              <td>{getUserName(order.userId)}</td>
              <td>{formatOrderState(order.state)}</td>
              <td
                className={
                  order.limitDate
                    ? new Date(order.limitDate).getTime() -
                        new Date().getTime() <
                      5 * 24 * 60 * 60 * 1000
                      ? "text-red-500 font-bold"
                      : ""
                    : ""
                }
              >
                {order.limitDate ? (
                  dayjs(order.limitDate).format("DD/MM/YYYY")
                ) : (
                  <div className="text-red-500 font-bold">N/A</div>
                )}
              </td>
              <td className="flex justify-center items-center gap-2 h-12">
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
                </CustomDialog>
                {(userRole === "leader" || userId === order.userId) && (
                  <CustomTooltip text="Editar Pedido" withSpan>
                    <EditOrder order={order} booksList={books} />
                  </CustomTooltip>
                )}
                {userRole === "admin" && (
                  <CustomTooltip text="Despachar Pedido" withSpan>
                    <DispatchOrder order={order} booksList={books} />
                  </CustomTooltip>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const formatOrderState = (state: string) => {
  switch (state) {
    case "pending":
      return (
        <div className="flex justify-center items-center gap-2 text-yellow-500">
          <Status color="yellow" />
          Pendiente
        </div>
      );
    case "in_progress":
      return (
        <div className="flex justify-center items-center gap-2 text-blue-500">
          <Status color="blue" />
          Recibida
        </div>
      );
    case "completed":
      return (
        <div className="flex justify-center items-center gap-2 text-green-500">
          <Status color="green" />
          Completado
        </div>
      );
    case "cancelled":
      return (
        <div className="flex justify-center items-center gap-2 text-red-500">
          <Status color="red" />
          Cancelado
        </div>
      );
    case "modified":
      return (
        <div className="flex justify-center items-center gap-2 text-orange-500">
          <Status color="orange" />
          Modificado
        </div>
      );
    default:
      return state;
  }
};
