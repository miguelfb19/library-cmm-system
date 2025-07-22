import React from 'react'

import { Status } from "../ui/Status";

interface Props {
  state: string;
}

export const OrderStatus = ({ state }: Props) => {
  switch (state) {
    case "pending":
      return (
        <div className="flex justify-center items-center gap-2 text-yellow-500">
          <Status color="yellow" />
          Pendiente
        </div>
      );
    case "dispatched":
      return (
        <div className="flex justify-center items-center gap-2 text-purple-700">
          <Status color="purple" />
          Despachado
        </div>
      );
    case "completed":
      return (
        <div className="flex justify-center items-center gap-2 text-blue-500">
          <Status color="blue" />
          Entregado
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
        <div className="flex justify-center items-center gap-2 text-gray-500">
          <Status color="gray" />
          Modificado
        </div>
      );
    default:
      return state;
  }
};
