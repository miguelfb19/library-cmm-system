import { getSedesWithInventory } from "@/actions/inventory/get-sedes-with-inventory";
import { SedeCard } from "@/components/inventory/SedeCard";
import { Title } from "@/components/ui/Title";
import Link from "next/link";

export default async function InventoryPage() {
  const { sedes, ok } = await getSedesWithInventory();

  if (!ok || !sedes) return null;
  return (
    <div>
      <Title title="Sedes CMM" />
      <div className="flex flex-col gap-5">
        <h3 className="text-primary text-xl font-bold">Sede principal</h3>
        {sedes
          .filter((sede) => sede.isPrincipal)
          .map((sede) => (
            <Link
              href={`/dashboard/admin/inventory/sede/${sede.id}`}
              key={sede.id}
            >
              <SedeCard sede={sede} key={sede.id} />
            </Link>
          ))}
        <h3 className="text-primary text-xl font-bold">Otras sedes</h3>
        {sedes
          .filter((sede) => !sede.isPrincipal)
          .map((sede) => (
            <Link
              href={`/dashboard/admin/inventory/sede/${sede.id}`}
              key={sede.id}
            >
              <SedeCard sede={sede} key={sede.id} />
            </Link>
          ))}
      </div>
    </div>
  );
}
