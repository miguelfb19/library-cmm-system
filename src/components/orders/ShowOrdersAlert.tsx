"use client";

import { Order } from "@/generated/prisma/wasm";
import { getLimitDateState } from "@/utils/get-limitdate-state";
import { submitAlert } from "@/utils/submitAlert";

interface Props {
  orders: Order[];
}

export const ShowOrdersAlert = ({ orders }: Props) => {
  const showLimitDateAlert = () => {
    const someOrderIsLimitUnderFive = orders.some((order) => {
      const limitDateState = getLimitDateState(order.limitDate);
      return limitDateState <= 5; // Si hay al menos un pedido con fecha límite próxima
    });
    const someOrderIsOverLimit = orders.some((order) => {
      const limitDateState = getLimitDateState(order.limitDate);
      return limitDateState <= 0; // Si hay al menos un pedido con fecha límite pasada
    });
    if (someOrderIsOverLimit) {
      return submitAlert({
        title: "Alerta de Pedidos",
        text: "Hay pedidos con fecha límite pasada. Por favor, revisa los pedidos.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
    if (someOrderIsLimitUnderFive) {
      return submitAlert({
        title: "Alerta de Pedidos",
        text: "Hay pedidos con fecha límite próxima (5 días o menos). Por favor, revisa los pedidos.",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
    }
  };
  // Muestra alerta de pedidos con fecha límite próxima al cargar el componente
  showLimitDateAlert();
  return null;
};
