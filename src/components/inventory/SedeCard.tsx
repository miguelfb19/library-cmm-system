import { SedeWithInventory } from "@/interfaces/Sede";
import { Title } from "../ui/Title";
import Link from "next/link";
import { Category } from "@/generated/prisma";
import { InventoryStatus, StatusItem } from "./StatusItem";

interface Props {
  sede: SedeWithInventory;
}

const getInventoryStatus = (
  inventory: SedeWithInventory["inventory"],
  category: Category,
  criticalLevel: number = 50,
  warningLevel: number = 150
): InventoryStatus => {
  const categoryItems = inventory.filter(
    (item) => item.book.category === category
  );

  if (categoryItems.some((item) => item.stock < criticalLevel)) return "red";
  if (categoryItems.some((item) => item.stock < warningLevel)) return "yellow";
  return "green";
};

export const SedeCard = ({ sede }: Props) => {
  const sanacionStatus = getInventoryStatus(
    sede.inventory,
    "seminario_sanacion"
  );
  const aramduraStatus = getInventoryStatus(
    sede.inventory,
    "seminario_armadura"
  );
  const ComoVivirStatus = getInventoryStatus(
    sede.inventory,
    "seminario_como_vivir"
  );
  // const CartillasStatus = getInventoryStatus(sede.inventory, "cartilla");

  return (
    <div
      className={`${
        sede.isPrincipal && "self-center"
      } rounded shadow-lg bg-secondary flex justify-center items-center flex-col hover:scale-[102%] transition-all duration-200 overflow-auto`}
    >
      <Link
        href={`/dashboard/leader/inventory/sede/${sede.id}`}
        key={sede.id}
        className="flex flex-col justify-center items-center p-5 gap-3 w-full"
      >
        <Title title={sede.city} />
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
