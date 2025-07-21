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
import { getLimitDateState } from "@/utils/get-limitdate-state";
import { ShowOrdersAlert } from "./ShowOrdersAlert";

interface Props {
  orders: Order[];
  books: Book[];
  users: User[];
  userRole: "admin" | "leader" | "user";
  sessionUserId: string;
}

/**
 * Componente que renderiza una tabla con la lista de pedidos del sistema
 * Incluye funcionalidades como:
 * - Visualización de detalles del pedido
 * - Edición de pedidos (solo para líderes o propietarios)
 * - Despacho de pedidos (solo para administradores)
 * - Indicadores visuales del estado del pedido
 * - Alertas visuales para fechas límite próximas
 */
export const OrderList = ({
  orders,
  books,
  users,
  userRole,
  sessionUserId,
}: Props) => {
  // Muestra un componente Empty si no hay pedidos disponibles
  if (orders.length === 0) {
    return <Empty text="No hay pedidos disponibles" />;
  }

  /**
   * Obtiene el nombre del usuario basado en su ID
   * @param id - ID del usuario a buscar
   * @returns Nombre del usuario o "Desconocido" si no se encuentra
   */
  const getUserName = (id: string) => {
    const user = users.find((user) => user.id === id);
    return user ? user.name : "Desconocido";
  };

  return (
    <div className="overflow-x-auto">
      <ShowOrdersAlert orders={orders} />
      <table className="min-w-[50rem] md:min-w-full text-sm text-center">
        {/* Encabezados de la tabla con campos principales */}
        <thead className="bg-secondary font-bold">
          <tr className="border-b h-10">
            <td></td>
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
              className="text-center border-b hover:bg-secondary h-10 relative"
            >
              <td>
                <div className="absolute">
                  {dayjs().diff(dayjs(order.createdAt), 'day') <= 1 && (
                    <div className="absolute -top-7 left-1 rounded-full bg-green-500 text-white text-xs px-1 -rotate-10">
                      Nuevo
                    </div>
                  )}
                </div>
              </td>
              {/* Columna de ID con truncamiento para IDs largos */}
              <td className="truncate max-w-20">{order.id}</td>

              {/* Columna de ciudad de origen con formato capitalizado */}
              <td>{capitalizeWords(order.origin.city.replaceAll("-", " "))}</td>

              {/* Nombre del usuario que realizó el pedido */}
              <td>{getUserName(order.userId)}</td>

              {/* Estado actual del pedido con indicador visual */}
              <td>{formatOrderState(order.state)}</td>

              {/* Fecha límite con alerta visual si está próxima (5 días o menos) */}
              <td
                className={
                  getLimitDateState(order.limitDate) <= 0
                    ? "text-red-500 font-bold"
                    : getLimitDateState(order.limitDate) <= 5
                    ? "text-yellow-500 font-bold"
                    : ""
                }
              >
                {order.limitDate ? (
                  <div className="font-bold">
                    {dayjs(order.limitDate).format("DD/MM/YYYY")}
                  </div>
                ) : (
                  <div>N/A</div>
                )}
              </td>

              {/* Acciones disponibles según el rol del usuario */}
              <td className="flex justify-center items-center gap-2 h-12">
                {/* Modal de detalles del pedido accesible para todos */}
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

                {/* Botón de edición solo visible para líderes o propietarios del pedido */}
                {(userRole === "leader" || sessionUserId === order.userId) &&
                order.state === "pending" ? (
                  <CustomTooltip text="Editar Pedido" withSpan>
                    <EditOrder order={order} booksList={books} />
                  </CustomTooltip>
                ) : null}

                {/* Botón de despacho solo visible para administradores */}
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
