import { Order } from "@/interfaces/Order";
import { Empty } from "../ui/Empty";

interface Props {
  orders: Order[];
}

export const OrderList = ({ orders }: Props) => {
  if (orders.length === 0) {
    return <Empty text="No hay pedidos disponibles" />;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>Origen</td>
            <td>Usuario</td>
            <td>Estado</td>
            <td>Fecha Límite</td>
            <td>Detalles</td>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.origin.leader}</td>
              <td>{order.userId}</td>
              <td>{order.state}</td>
              <td>{order.limitDate?.toDateString() || "N/A"}</td>
              <td>
                <ul>
                  {order.detail.map((item) => (
                    <li key={item.id}>
                      {item.quantity} x {item.bookId}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
