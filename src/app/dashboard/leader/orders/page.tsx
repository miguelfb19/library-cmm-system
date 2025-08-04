import { getOrders } from "@/actions/orders/get-orders";
import { Title } from "@/components/ui/Title";
import { OrderList } from "@/components/orders/OrderList";
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import { getOrdersByUser } from "@/actions/orders/get-orders-by-user";
import { NewOrder } from "@/components/orders/NewOrder";
import { getSedes } from "@/actions/inventory/get-sedes";
import { getAllBooks } from "@/actions/product/get-all-books";
import { getUsers } from "@/actions/users/get-users";

export default async function OrdersPage() {
  const session = await auth();

  if (!session || !session.user) redirect("/auth/login");

  const [ordersRes, sedesRes, booksRes, usersRes] = await Promise.all([
    session.user.role === "admin"
      ? await getOrders({ isProduction: false })
      : await getOrdersByUser(session.user.id),
    getSedes(),
    getAllBooks(),
    getUsers(),
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
    <div className="h-full">
      <Title title="Pedidos" />
      <NewOrder
        sedes={sedes || []}
        books={booksRes.books || []}
        userId={session.user.id}
        userSede={session.user.Sede} // Sede del usuario, si aplica
      />
      <hr className="my-4" />
      <OrderList
        orders={ordersRes.orders}
        books={booksRes.books || []}
        users={usersRes.data || []}
        userRole={session.user.role as "admin" | "leader" | "productor"}
        sessionUserId={session.user.id}
      />
    </div>
  );
}
