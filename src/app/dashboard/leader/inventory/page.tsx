import { getSedesWithInventory } from "@/actions/inventory/get-sedes-with-inventory";
import { auth } from "@/auth.config";
import { SedeCard } from "@/components/inventory/SedeCard";
import { Title } from "@/components/ui/Title";
import { CreateSede } from "@/components/inventory/CreateSede";

export default async function InventoryPage() {
  const { sedes, ok } = await getSedesWithInventory();
  const session = await auth();

  if (!ok || !sedes) return null;
  return (
    <div>
      <Title title="Sedes CMM" />
      <div className="flex flex-col gap-5">
        {session?.user?.role === "admin" && (
          <>
            {/* CREAR SEDE */}
            <CreateSede />
            <h3 className="text-primary text-xl font-bold">Sede principal</h3>
            <div className="flex gap-5 w-full">
              {sedes
                .filter((sede) => sede.isPrincipal)
                .map((sede) => (
                  <SedeCard sede={sede} key={sede.id} />
                ))}
            </div>
          </>
        )}

        <h3 className="text-primary text-xl font-bold">Otras sedes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {sedes
            .filter((sede) => !sede.isPrincipal)
            .map((sede) => (
              <SedeCard sede={sede} key={sede.id} />
            ))}
        </div>
      </div>
    </div>
  );
}
