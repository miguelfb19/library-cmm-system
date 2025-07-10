import { Category } from "@/generated/prisma";
import { InventoryStatus } from "@/interfaces/Inventory";
import { SedeWithInventory } from "@/interfaces/Sede";

export const getInventoryStatus = (
  inventory: SedeWithInventory["inventory"],
  category: Category,
  criticalLevel: number,
  warningLevel: number
): InventoryStatus => {
  const categoryItems = inventory.filter(
    (item) => item.book.category === category
  );

  // Muestro el status de cierto color si existe al menos un libro de la categoria con stock menor a los niveles criticos o de advertencia
  if (categoryItems.some((item) => item.stock < criticalLevel)) return "red";
  if (categoryItems.some((item) => item.stock < warningLevel)) return "yellow";
  return "green";
};