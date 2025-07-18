import { SedeWithInventory } from "@/interfaces/Sede";
import { Title } from "../ui/Title";
import Link from "next/link";
import { StatusItem } from "./ui/StatusItem";
import { DeleteSedeButton } from "./ui/DeleteSedeButton";
import { auth } from "@/auth.config";
import { getStockLevels } from "./utils/get-stock-levels";
import { getInventoryStatus } from "./utils/get-inventory-status";
import { capitalizeWords } from "@/utils/capitalize";

/**
 * Interface para las propiedades del componente SedeCard
 * @property sede - Sede con su información de inventario
 * @property className - Clases CSS adicionales (opcional)
 */
interface Props {
  sede: SedeWithInventory;
  className?: string;
}

/**
 * Componente que muestra una tarjeta con información de una sede y su inventario
 * Incluye:
 * - Estado de inventario por tipo de seminario
 * - Link a detalles de la sede
 * - Botón de eliminación (solo para roles autorizados)
 */
export const SedeCard = async ({ sede, className }: Props) => {
  // Obtiene la sesión del usuario actual
  const session = await auth();

  // Validación de autenticación
  if (!session || !session.user) {
    return null;
  }

  // Obtiene niveles y estado del inventario para cada tipo de seminario
  const sanacionLevels = getStockLevels(sede.inventory, "seminario_sanacion");
  const sanacionStatus = getInventoryStatus(
    sede.inventory,
    "seminario_sanacion",
    sanacionLevels.criticalLevel,
    sanacionLevels.warningLevel
  );

  const aramduraLevels = getStockLevels(sede.inventory, "seminario_armadura");
  const aramduraStatus = getInventoryStatus(
    sede.inventory,
    "seminario_armadura",
    aramduraLevels.criticalLevel,
    aramduraLevels.warningLevel
  );

  const comoVivirLevels = getStockLevels(
    sede.inventory,
    "seminario_como_vivir"
  );
  const ComoVivirStatus = getInventoryStatus(
    sede.inventory,
    "seminario_como_vivir",
    comoVivirLevels.criticalLevel,
    comoVivirLevels.warningLevel
  );
  // const CartillasStatus = getInventoryStatus(sede.inventory, "cartilla");

  return (
    // Contenedor principal con estilo condicional para sede principal
    <div
      className={`${
        sede.isPrincipal ? "self-center" : ""
      } ${className} w-full rounded shadow-lg bg-secondary flex justify-center items-center flex-col hover:scale-[102%] transition-all duration-200 overflow-auto relative`}
    >
      {/* Botón de eliminación de sede */}
      <DeleteSedeButton
        userRole={session.user.role as "admin" | "productor" | "leader"}
        sedeId={sede.id}
      />

      {/* Link a detalles de la sede */}
      <Link
        href={`/dashboard/leader/inventory/sede/${sede.id}`}
        key={sede.id}
        className="flex flex-col justify-center items-center p-5 gap-3 w-full"
      >
        {/* Título con nombre de la ciudad */}
        <Title title={capitalizeWords(sede.city)} />

        {/* Grid de indicadores de estado por seminario */}
        <div className="text-xs grid grid-cols-2 gap-2">
          <StatusItem status={sanacionStatus} category="Sanacion" />
          <StatusItem status={aramduraStatus} category="Armadura" />
          <StatusItem status={ComoVivirStatus} category="Como Vivir" />
          {/* Estado de cartillas deshabilitado temporalmente */}
          {/* <StatusItem status={CartillasStatus} category="Cartillas" /> */}
        </div>
      </Link>
    </div>
  );
};
