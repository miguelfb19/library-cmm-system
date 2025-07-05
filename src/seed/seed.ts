import prisma from "../lib/prisma";
import { books, sedes, users } from "./seed-data";
import bcrypt from 'bcryptjs';

async function main() {
  //   Borrar registros previos
  await prisma.user.deleteMany();
  await prisma.sede.deleteMany();
  await prisma.book.deleteMany();

  await prisma.sede.createMany({
    data: sedes,
  });

  await prisma.book.createMany({
    data: books,
  });
  await prisma.user.createMany({
    data: users.map((user) => ({
      ...user,
      password: bcrypt.hashSync(user.password), // Asegúrate de que las contraseñas estén encriptadas si es necesario
    })),
  });

  // ? Iniciar los inventarios en 0
  
  seedInventory()

  console.log("Seed successful executed");
}

(() => {
  if (process.env.NODE_ENV === "production") return;

  main();
})();

const seedInventory = async () => {
  const sedes = await prisma.sede.findMany();
  const books = await prisma.book.findMany();

  const inventoryData = [];

  for (const sede of sedes) {
    for (const book of books) {

      inventoryData.push({
        sedeId: sede.id,
        bookId: book.id,
        stock: 0,
      });
    }
  }

  // Inserta todos los registros de inventario
  await prisma.inventory.createMany({
    data: inventoryData,    
  });

  console.log("Inventario creado con éxito en todas las sedes.");
};