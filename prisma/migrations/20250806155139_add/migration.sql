/*
  Warnings:

  - Added the required column `quantity` to the `ParishSale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Category" ADD VALUE 'paquetes';
ALTER TYPE "Category" ADD VALUE 'folleto_serie';

-- AlterTable
ALTER TABLE "ParishSale" ADD COLUMN     "quantity" INTEGER NOT NULL;
