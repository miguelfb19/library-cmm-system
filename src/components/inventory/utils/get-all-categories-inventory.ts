import { ShortSede } from "@/interfaces/Sede";

export const getAllCategoriesInventory = (sede: ShortSede) => {
  const sanacionInventory = sede.inventory.filter(
    (item) => item.book.category === "seminario_sanacion"
  );
  const aramduraInventory = sede.inventory.filter(
    (item) => item.book.category === "seminario_armadura"
  );
  const comoVivirInventory = sede.inventory.filter(
    (item) => item.book.category === "seminario_como_vivir"
  );
  const cartillasInventory = sede.inventory.filter(
    (item) => item.book.category === "cartilla"
  );
  const librosInventory = sede.inventory.filter(
    (item) => item.book.category === "libro"
  );

  return [
    sanacionInventory,
    aramduraInventory,
    comoVivirInventory,
    cartillasInventory,
    librosInventory,
  ];
};