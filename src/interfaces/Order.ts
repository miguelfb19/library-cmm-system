import { OrderState } from "@/generated/prisma";
import { DispatchData } from "./DispatchData";

export interface Order {
  id: string;
  origin: OrderOrigin;
  limitDate: Date | null;
  originId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
  isProduction: boolean;
  state: OrderState;
  detail: OrderDetails[];
  note: string | null;
  dispatchData?: DispatchData;
}

interface OrderDetails {
  id: string;
  quantity: number;
  bookId: string;
  orderId: string;
}

interface OrderOrigin {
  id: string;
  leader: string;
  city: string;
}
