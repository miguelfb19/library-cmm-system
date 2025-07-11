import { getSedesWithInventory } from "@/actions/inventory/get-sedes-with-inventory";
import { auth } from "@/auth.config";
import { SedeCard } from "@/components/inventory/SedeCard";
import { CreateSede } from "@/components/inventory/ui/CreateSede";
import { Title } from "@/components/ui/Title";
import { Fragment } from "react";

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
                  <Fragment key={sede.id}>
                    {sede.city.toLowerCase() === "bodega" ? null : (
                      <SedeCard sede={sede} />
                    )}
                  </Fragment>
                ))}
            </div>
          </>
        )}

        <h3 className="text-primary text-xl font-bold">Otras sedes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {sedes
            .filter((sede) => !sede.isPrincipal)
            .map((sede) => (
              <Fragment key={sede.id}>
                {sede.city.toLowerCase() === "bodega" ? null : (
                  <SedeCard sede={sede} />
                )}
              </Fragment>
            ))}
        </div>
      </div>
    </div>
  );
}
