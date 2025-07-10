import { getSede } from "@/actions/inventory/get-sede";
import { SedeInventoryDetails } from "@/components/inventory/SedeInventoryDetails";
import { Title } from "@/components/ui/Title";
import { Category } from "@/generated/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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
      <Link
        href="/dashboard/leader/inventory"
        className="flex items-center gap-2 text-primary bg-primary/10 rounded !self-start p-2 hover:bg-primary/20 transition-colors"
      >
        <ArrowLeft />
      </Link>
      <div className="bg-gradient-to-br from-slate-300 via-white via-70% to-slate-300 rounded p-5 flex max-md:flex-col md:items-end gap-2 px-5 shadow-lg overflow-auto">
        <h2 className="text-3xl font-bold">Responsable: </h2>
        <h3 className="font-bold text-2xl text-primary">{sede.leader}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {getAllCategoriesInventory(sede).map((inventory, index) => (
          <SedeInventoryDetails inventory={inventory} sede={sede} key={index} />
        ))}
      </div>
    </div>
  );
}

interface Sede {
  id: string;
  city: string;
  leader: string;
  isPrincipal: boolean;
  inventory: {
    id: string;
    stock: number;
    criticalStock: number;
    lowStock: number;
    book: {
      id: string;
      name: string;
      category: Category;
    };
  }[];
}

const getAllCategoriesInventory = (sede: Sede) => {
  const sanacionInventory = sede.inventory.filter(
    (item) => item.book.category === "seminario_sanacion"
  );
  const aramduraInventory = sede.inventory.filter(
    (item) => item.book.category === "seminario_armadura"
  );
  const comoVivirInventory = sede.inventory.filter(
    (item) => item.book.category === "seminario_como_vivir"
  );
  const cartillasInventory = sede.inventory.filter(
    (item) => item.book.category === "cartilla"
  );
  const librosInventory = sede.inventory.filter(
    (item) => item.book.category === "libro"
  );

  return [
    sanacionInventory,
    aramduraInventory,
    comoVivirInventory,
    cartillasInventory,
    librosInventory,
  ];
};
