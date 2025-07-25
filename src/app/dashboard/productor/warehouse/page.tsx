import { getSedes } from "@/actions/inventory/get-sedes";
import { getAllBooks } from "@/actions/product/get-all-books";
import { getOrdersDetails } from "@/actions/warehouse/get-orders-details";
import { getWarehouse } from "@/actions/warehouse/get-warehouse";
import { auth } from "@/auth.config";
import { Title } from "@/components/ui/Title";
import { WarehouseActions } from "@/components/warehouse/WarehouseActions";
import { WarehouseTable } from "@/components/warehouse/WarehouseTable";
import { redirect } from "next/navigation";

export default async function WarehousePage() {
  const [inventory, ordersDetails, sedesRes, booksRes] = await Promise.all([
    getWarehouse(),
    getOrdersDetails(),
    getSedes(),
    getAllBooks(),
  ]);

  const session = await auth();

  if (!session?.user) redirect("/auth/login");

  if (!inventory.ok || !inventory.warehouse) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
        <Title title="Error al cargar la bodega" className="text-red-500" />
        <p className="text-center">{inventory.message}</p>
      </div>
    );
  }

  const sedes = sedesRes.sedes?.map((sede) => ({
    id: sede.id,
    city: sede.city,
  }));

  const { warehouse: warehouseData } = inventory;

  return (
    <div className="flex flex-col gap-5 overflow-hidden">
      <Title title="Inventario de Bodega" />
      {session.user.role === "admin" && (
        <WarehouseActions
          warehouse={warehouseData}
          books={booksRes.books || []}
          sedes={sedes || []}
          sessionUserId={session.user.id}
        />
      )}
      <WarehouseTable
        warehouse={warehouseData}
        ordersDetails={ordersDetails.data}
      />
    </div>
  );
}
