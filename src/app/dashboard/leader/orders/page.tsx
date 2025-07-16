import { getOrders } from "@/actions/orders/get-orders";
import { Title } from "@/components/ui/Title";
import { OrderList } from "@/components/orders/OrderList";
import { Order } from "@/interfaces/Order";
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import { getOrdersByUser } from "@/actions/orders/get-orders-by-user";
import { NewOrder } from "@/components/orders/NewOrder";
import { getSedes } from "@/actions/inventory/get-sedes";
import { getAllBooks } from "@/actions/product/get-all-books";

export default async function ProductionOrdersPage() {
  const session = await auth();

  if (!session || !session.user) redirect("/auth/login");

  const [ordersRes, sedesRes, booksRes] = await Promise.all([
    session.user.role === "admin"
      ? await getOrders()
      : await getOrdersByUser(session.user.id),
    getSedes(),
    getAllBooks()
  ]);
  const sedes = sedesRes.sedes?.map((sede) => ({
    id: sede.id,
    city: sede.city,
  }));

  if (!ordersRes.ok || !ordersRes.orders) {
    return (
      <div>
        <Title title="Pedidos" />
        <p className="text-center text-red-500">{ordersRes.message}</p>
      </div>
    );
  }

  return (
    <div>
      <Title title="Pedidos" />
      <NewOrder sedes={sedes || []} books={booksRes.books || []} />
      <OrderList orders={ordersRes.orders} />
    </div>
  );
}
