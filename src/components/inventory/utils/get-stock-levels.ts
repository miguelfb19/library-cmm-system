import { Category } from "@/generated/prisma";
import { SedeWithInventory } from "@/interfaces/Sede";

export const getStockLevels = (
  inventory: SedeWithInventory["inventory"],
  category: Category
) => {
  // Selecciono categoria
  const items = inventory.filter((item) => item.book.category === category);

  // Escojo los niveles de criticalStock y lowStock mas bajos por categoria, buscando en cada libro
  const criticalLevel =
    items.sort((a, b) => a.criticalStock - b.criticalStock)[0].criticalStock ||
    0;
  const warningLevel =
    items.sort((a, b) => a.lowStock - b.lowStock)[0].lowStock || 0;

  return { criticalLevel, warningLevel };
};