import { SedeWithInventory } from "@/interfaces/Sede";
import { Title } from "../ui/Title";
import Link from "next/link";
import { StatusItem } from "./ui/StatusItem";
import { DeleteSedeButton } from "./ui/DeleteSedeButton";
import { auth } from "@/auth.config";
import { getStockLevels } from "./utils/get-stock-levels";
import { getInventoryStatus } from "./utils/get-inventory-status";
import { capitalizeWords } from "@/utils/capitalize";

interface Props {
  sede: SedeWithInventory;
  className?: string;
}

export const SedeCard = async ({ sede, className }: Props) => {
  const session = await auth();

  if (!session || !session.user) {
    return null; // or handle unauthenticated state
  }

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
    <div
      className={`${
        sede.isPrincipal ? "self-center" : ""
      } ${className} w-full rounded shadow-lg bg-secondary flex justify-center items-center flex-col hover:scale-[102%] transition-all duration-200 overflow-auto relative`}
    >
      <DeleteSedeButton
        userRole={session.user.role as "admin" | "productor" | "leader"}
        sedeId={sede.id}
      />
      <Link
        href={`/dashboard/leader/inventory/sede/${sede.id}`}
        key={sede.id}
        className="flex flex-col justify-center items-center p-5 gap-3 w-full"
      >
        <Title title={capitalizeWords(sede.city)} />
        <div className="text-xs grid grid-cols-2 gap-2">
          {/* STATUS POR SEMINARIOS */}
          <StatusItem status={sanacionStatus} category="Sanacion" />
          <StatusItem status={aramduraStatus} category="Armadura" />
          <StatusItem status={ComoVivirStatus} category="Como Vivir" />
          {/* <StatusItem status={CartillasStatus} category="Cartillas" /> */}
        </div>
      </Link>
    </div>
  );
};
