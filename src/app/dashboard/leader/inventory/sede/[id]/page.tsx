import { getSedeById } from "@/actions/inventory/get-sede-by-id";
import { SedeInventoryDetails } from "@/components/inventory/SedeInventoryDetails";
import { UpdateStockLevelsBySede } from "@/components/inventory/UpdateStockLevelsBySede";
import { getAllCategoriesInventory } from "@/components/inventory/utils/get-all-categories-inventory";
import { Title } from "@/components/ui/Title";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EditSedeLeader } from "@/components/inventory/ui/EditSedeLeader";
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SedeDetailsPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  if (!session || !session.user) redirect("/auth/login");

  const { sede, ok, message } = await getSedeById(id);

  // Restringir acceso a la sede "Bodega" solo para administradores
  if (
    sede?.city.toLocaleLowerCase() === "bodega" &&
    session.user.role !== "admin"
  ) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)] items-center justify-center">
        <Title title="Acceso Denegado" className="text-red-500" />
        <p className="text-center">
          No tienes permiso para acceder a esta página.
        </p>
      </div>
    );
  }

  // Si no se encuentra la sede o hay un error, mostrar mensaje de error
  if (!ok || !sede) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)] items-center justify-center">
        <Title title="Error" className="text-red-500" />
        <p className="text-center">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Link
          href={
            sede.city.toLowerCase() === "bodega"
              ? "/dashboard/productor/warehouse"
              : "/dashboard/leader/inventory"
          }
          className="flex items-center gap-2 text-primary bg-primary/10 rounded !self-start p-2 hover:bg-primary/20 transition-colors"
        >
          <ArrowLeft />
        </Link>
        {(session.user.role === "admin" ||
          session.user.name!.includes(sede.leader)) && (
          <UpdateStockLevelsBySede sede={sede} />
        )}
      </div>
      <div className="flex items-center justify-between bg-gradient-to-br from-slate-300 via-white via-70% to-slate-300 rounded p-5 shadow-lg overflow-auto">
        <div className="flex max-md:flex-col md:items-end gap-2">
          <h2 className="text-3xl font-bold">Responsable: </h2>
          <h3 className="font-bold text-2xl text-primary">{sede.leader}</h3>
        </div>
        <EditSedeLeader sedeId={sede.id} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {getAllCategoriesInventory(sede).map((inventory, index) => (
          <SedeInventoryDetails inventory={inventory} sede={sede} key={index} />
        ))}
      </div>
    </div>
  );
}
