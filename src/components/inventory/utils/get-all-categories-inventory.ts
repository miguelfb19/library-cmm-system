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
  const paquetesInventory = sede.inventory.filter(
    (item) => item.book.category === "paquetes"
  );
  const folletoSerieInventory = sede.inventory.filter(
    (item) => item.book.category === "folleto_serie"
  );

  return [
    sanacionInventory,
    aramduraInventory,
    comoVivirInventory,
    cartillasInventory,
    librosInventory,
    paquetesInventory,
    folletoSerieInventory,
  ];
};