import prisma from "../lib/prisma";
import { sedes, users } from "./seed-data";
import bcrypt from "bcryptjs";
import { books, seedInventory } from '../constants/initial-inventory';

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

  const existingSedes = await prisma.sede.findMany();
  const existingBooks = await prisma.book.findMany();
  seedInventory(existingSedes, existingBooks);

  console.log("Seed successful executed");
}

(() => {
  if (process.env.NODE_ENV === "production") return;

  main();
})();


