"use client";

import { Order } from "@/interfaces/Order";
import { Empty } from "../ui/Empty";
import { capitalizeWords } from "@/utils/capitalize";
import { Book } from "@/interfaces/Book";
import { User } from "@/interfaces/User";
import dayjs from "dayjs";
import { DispatchOrder } from "./DispatchOrder";
import { CustomTooltip } from "../ui/CustomTooltip";
import { EditOrder } from "./EditOrder";
import { getLimitDateState } from "@/utils/get-limitdate-state";
import { ShowOrdersAlert } from "./ShowOrdersAlert";
import { OrderDetails } from "./OrderDetails";
import { OrderStatus } from "./OrderStatus";
import { Input } from "../ui/input";
import { useState } from "react";
import { ReceiveOrder } from "./ReceiveOrder";
import { History, ClipboardList } from "lucide-react";

interface Props {
  orders: Order[];
  books: Book[];
  users: User[];
  userRole: "admin" | "leader" | "productor";
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
  // Estado para el término de búsqueda
  const [idSearch, setIdSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  // Estado para mostrar el historial de pedidos
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  /**
   * Obtiene el nombre del usuario basado en su ID
   * @param id - ID del usuario a buscar
   * @returns Nombre del usuario o "Desconocido" si no se encuentra
   */
  const getUserName = (id: string) => {
    const user = users.find((user) => user.id === id);
    return user ? user.name : "Desconocido";
  };

  // Filtra los pedidos por ID y usuario según los términos de búsqueda
  const filteredOrdersById = orders.filter((order) =>
    order.id.toLowerCase().includes(idSearch.toLowerCase())
  );
  const filteredOrdersByUser = filteredOrdersById.filter((order) =>
    getUserName(order.userId).toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredOrdersByHistory = filteredOrdersByUser.filter((order) => (
    showOrderHistory ? order.state === "approved" : order.state !== "approved"
  ));


  return (
    <div className="flex flex-col h-[calc(100vh-16rem)]">
      <ShowOrdersAlert
        orders={orders.map((order) => ({
          ...order,
          note: order.note === undefined ? null : order.note,
        }))}
      />
      <div className="mb-5 grid grid-cols-1 md:grid-cols-[1fr_9fr_9fr] gap-4">
        <CustomTooltip text={` ${showOrderHistory ? "Pedidos activos" : "Historial de pedidos"}`}>
          <button
            className="p-2 w-10 cursor-pointer text-primary"
            onClick={() => setShowOrderHistory(!showOrderHistory)}
          >
            {showOrderHistory ? <ClipboardList /> : <History />}
          </button>
        </CustomTooltip>
        <Input
          id="search-order-id"
          name="searchOrderId"
          placeholder="Buscar por id..."
          type="text"
          value={idSearch}
          onChange={(e) => setIdSearch(e.target.value)}
        />
        <Input
          id="search-user"
          name="searchUser"
          placeholder="Buscar por usuario..."
          type="text"
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
        />
      </div>
      {filteredOrdersByHistory.length === 0 ? (
        <Empty text="No hay pedidos para mostrar" />
      ) : 
      
      <div className="overflow-auto flex-1">
        <table className="min-w-[50rem] md:min-w-full text-sm text-center">
          {/* Encabezados de la tabla con campos principales */}
          <thead className="bg-secondary font-bold">
            <tr className="border-b h-10">
              <td></td>
              <td>ID</td>
              <td>Origen</td>
              <td>Usuario</td>
              <td>Estado</td>
              <td>Fecha del pedido</td>
              <td>Fecha Límite</td>
              <td>Acciones</td>
            </tr>
          </thead>
          <tbody>
            {filteredOrdersByHistory.map((order) => (
              <tr
                key={order.id}
                className="text-center border-b hover:bg-secondary h-10 relative"
              >
                <td>
                  <div className="absolute">
                    {dayjs().diff(dayjs(order.createdAt), "day") <= 1 &&
                    order.state === "pending" ? (
                      <div className="absolute -top-7 left-1 rounded-full bg-green-500 text-white text-xs px-1 -rotate-10">
                        Nuevo
                      </div>
                    ) : null}
                  </div>
                </td>
                {/* Columna de ID con truncamiento para IDs largos */}
                <td className="truncate max-w-20">{order.id}</td>

                {/* Columna de ciudad de origen con formato capitalizado */}
                <td>
                  {capitalizeWords(order.origin.city.replaceAll("-", " "))}
                </td>

                {/* Nombre del usuario que realizó el pedido */}
                <td>{getUserName(order.userId)}</td>

                {/* Estado actual del pedido con indicador visual */}
                <td>
                  <OrderStatus state={order.state} />
                </td>

                <td>{dayjs(order.createdAt).format("DD/MM/YYYY")}</td>

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
                  <OrderDetails order={order} books={books} />

                  {/* Botón de edición solo visible para líderes o propietarios del pedido */}
                  {(userRole === "leader" || sessionUserId === order.userId) &&
                  order.state === "pending" ? (
                    <CustomTooltip text="Editar Pedido" withSpan>
                      <EditOrder order={order} booksList={books} />
                    </CustomTooltip>
                  ) : null}

                  {/* Botón de despacho solo visible para administradores si isProduction es false y si no solo para Productores */}
                  {order.isProduction ? (
                    userRole === "productor" && order.state === "pending" ? (
                      <CustomTooltip text="Despachar Pedido" withSpan>
                        <DispatchOrder order={order} booksList={books} />
                      </CustomTooltip>
                    ) : null
                  ) : userRole === "admin" && order.state === "pending" ? (
                    <CustomTooltip text="Despachar Pedido" withSpan>
                      <DispatchOrder order={order} booksList={books} />
                    </CustomTooltip>
                  ) : null}

                  {/* Botón de recibir orden solo visible para administradores si isProduction es true y si no solo para lideres */}

                  {order.isProduction ? (
                    (userRole === "admin" || sessionUserId === order.userId) &&
                    order.state === "dispatched" ? (
                      <CustomTooltip text="Recibir Pedido" withSpan>
                        <ReceiveOrder order={order} bookList={books} />
                      </CustomTooltip>
                    ) : null
                  ) : (userRole === "admin" ||
                      sessionUserId === order.userId) &&
                    order.state === "dispatched" ? (
                    <CustomTooltip text="Recibir Pedido" withSpan>
                      <ReceiveOrder order={order} bookList={books} />
                    </CustomTooltip>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      }
    </div>
  );
};
