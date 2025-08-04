-- CreateTable
CREATE TABLE "ParishSale" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "manager" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "refundedAt" TIMESTAMP(3),
    "sedeId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,

    CONSTRAINT "ParishSale_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ParishSale" ADD CONSTRAINT "ParishSale_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParishSale" ADD CONSTRAINT "ParishSale_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
