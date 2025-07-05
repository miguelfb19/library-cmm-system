-- CreateEnum
CREATE TYPE "Category" AS ENUM ('seminario_sanacion', 'seminario_armadura', 'seminario_como_vivir', 'cartilla', 'libro');

-- CreateTable
CREATE TABLE "Sede" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "leader" TEXT NOT NULL,

    CONSTRAINT "Sede_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookCategory" (
    "id" TEXT NOT NULL,
    "name" "Category" NOT NULL,

    CONSTRAINT "BookCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sede_id_key" ON "Sede"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BookCategory_id_key" ON "BookCategory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Book_id_key" ON "Book"("id");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BookCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
