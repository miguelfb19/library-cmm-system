/*
  Warnings:

  - The values [user] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `categoryId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the `BookCategory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[city]` on the table `Sede` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[leader]` on the table `Sede` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderState" AS ENUM ('pending', 'completed', 'cancelled');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('leader', 'admin', 'productor');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'leader';
COMMIT;

-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_categoryId_fkey";

-- DropIndex
DROP INDEX "Sede_id_key";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "categoryId",
DROP COLUMN "stock",
ADD COLUMN     "category" "Category" NOT NULL;

-- AlterTable
ALTER TABLE "Sede" ADD COLUMN     "isPrincipal" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'leader';

-- DropTable
DROP TABLE "BookCategory";

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "sedeId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "criticalStock" INTEGER NOT NULL DEFAULT 0,
    "lowStock" INTEGER NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "originId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isProduction" BOOLEAN NOT NULL DEFAULT false,
    "state" "OrderState" NOT NULL DEFAULT 'pending',

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookOrder" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "BookOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_sedeId_bookId_key" ON "Inventory"("sedeId", "bookId");

-- CreateIndex
CREATE UNIQUE INDEX "Book_name_key" ON "Book"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Sede_city_key" ON "Sede"("city");

-- CreateIndex
CREATE UNIQUE INDEX "Sede_leader_key" ON "Sede"("leader");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_originId_fkey" FOREIGN KEY ("originId") REFERENCES "Sede"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookOrder" ADD CONSTRAINT "BookOrder_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookOrder" ADD CONSTRAINT "BookOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
