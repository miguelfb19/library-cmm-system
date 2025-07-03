
import prisma from "../lib/prisma";
import { users } from "./seed-data";

async function main() {
  //   Borrar registros previos
  await prisma.user.deleteMany();
  
  

  await prisma.user.createMany({
    data: users,
  });

  console.log("Seed successful executed");
}

(() => {
  if (process.env.NODE_ENV === "production") return;

  main();
})();
