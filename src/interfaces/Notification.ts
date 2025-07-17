import { Role } from "@/generated/prisma";

export interface Notification {
  id: string;
  userId: string;
  message: string;
  createdAt: Date;
  read: boolean;
  to: Role | null;
}
