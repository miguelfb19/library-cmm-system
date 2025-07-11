import { getWarehouse } from "@/actions/store/get-warehouse";
import { auth } from "@/auth.config";
import { Title } from "@/components/ui/Title";
import { WarehouseTable } from "@/components/warehouse/WarehouseTable";
import { redirect } from "next/navigation";

export default async function WarehousePage() {
  const res = await getWarehouse();
  const session = await auth();

  if (!session?.user) redirect("/auth/login");

  if (!res.ok || !res.warehouse) {
    return (
      <div>
        <Title title="Error al cargar la bodega" />
        <p>{res.message}</p>
      </div>
    );
  }

  const { warehouse: warehouseData } = res;

  return (
    <div className="flex flex-col gap-5 overflow-hidden">
      <Title title="Inventario de Bodega" />
      <WarehouseTable warehouse={warehouseData} userRole={session.user.role} />
    </div>
  );
}
