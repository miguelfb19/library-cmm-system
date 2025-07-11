import { Category } from "@/generated/prisma";

export interface Book {
  id: string;
  name: string;
  category: Category;
}
