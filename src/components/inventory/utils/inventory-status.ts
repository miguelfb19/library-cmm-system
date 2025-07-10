import { InventoryStatus } from "@/interfaces/Inventory";

export const getStatusColor = (status: InventoryStatus): string => {
  switch (status) {
      case "red":
      return "text-red-600";
    case "yellow":
      return "text-yellow-600";
    default:
      return "text-green-600";
    }
};

export const getStatusMessage = (status: InventoryStatus, category: string): string => {
  switch (status) {
    case "red":
      return `${category} crítico`;
    case "yellow":
      return `${category} bajo`;
    default:
      return `${category} en orden`;
  }
};