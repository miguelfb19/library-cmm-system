import { Category } from "@/generated/prisma";

export interface Warehouse {
  id: string;
  city: string;
  leader: string;
  isPrincipal: boolean;
  inventory: InventoryItem[];
}

interface InventoryItem {
  id: string;
  sedeId: string;
  bookId: string;
  criticalStock: number;
  lowStock: number;
  stock: number;
  book: BookItem;
}

interface BookItem {
  id: string;
  name: string;
  category: Category;
}
