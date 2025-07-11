import { getSede } from "@/actions/inventory/get-sede";
import { SedeInventoryDetails } from "@/components/inventory/SedeInventoryDetails";
import { UpdateStockLevelsBySede } from "@/components/inventory/UpdateStockLevelsBySede";
import { getAllCategoriesInventory } from "@/components/inventory/utils/get-all-categories-inventory";
import { Title } from "@/components/ui/Title";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EditSedeLeader } from "@/components/inventory/ui/EditSedeLeader";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SedeDetailsPage({ params }: Props) {
  const { id } = await params;

  const { sede, ok, message } = await getSede(id);

  if (!ok || !sede) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh - 4rem)]">
        <Title title="Error" />
        <p className="text-center">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/leader/inventory"
          className="flex items-center gap-2 text-primary bg-primary/10 rounded !self-start p-2 hover:bg-primary/20 transition-colors"
        >
          <ArrowLeft />
        </Link>
        <UpdateStockLevelsBySede sede={sede} />
      </div>
      <div className="flex items-center justify-between bg-gradient-to-br from-slate-300 via-white via-70% to-slate-300 rounded p-5 shadow-lg overflow-auto">
        <div className="flex max-md:flex-col md:items-end gap-2">
          <h2 className="text-3xl font-bold">Responsable: </h2>
          <h3 className="font-bold text-2xl text-primary">{sede.leader}</h3>
        </div>
        <EditSedeLeader sedeId={sede.id}/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {getAllCategoriesInventory(sede).map((inventory, index) => (
          <SedeInventoryDetails inventory={inventory} sede={sede} key={index} />
        ))}
      </div>
    </div>
  );
}
