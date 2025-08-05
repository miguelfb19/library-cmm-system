export interface ParishSale {
  id: string;
  sedeId: string;
  bookId: string;
  name: string;
  manager: string;
  quantity: number;
  isActive: boolean;
  createdAt: Date;
  refundedAt: Date | null;
}
