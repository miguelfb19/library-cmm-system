import { Title } from "@/components/ui/Title";
import { OrderList } from "@/components/orders/OrderList";
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import { getOrders } from "@/actions/orders/get-orders";
import { getAllBooks } from "@/actions/product/get-all-books";
import { getUsers } from "@/actions/users/get-users";

export default async function ProductionOrdersPage() {
  const session = await auth();

  if (!session || !session.user) redirect("/auth/login");

  const [ordersRes, booksRes, usersRes] = await Promise.all([
    getOrders({ isProduction: true }),
    getAllBooks(),
    getUsers(),
  ]);

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
      <Title title="Pedidos en Producción" />
      <hr className="my-5"/>
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
