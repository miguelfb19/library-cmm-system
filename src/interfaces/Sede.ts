type Category =
  | "seminario_sanacion"
  | "seminario_armadura"
  | "seminario_como_vivir"
  | "cartilla"
  | "libro";

export interface SedeWithInventory {
  id: string;
  city: string;
  isPrincipal: boolean;
  inventory: ({
    book: {
      name: string;
      category: Category;
    };
  } & {
    id: string;
    sedeId: string;
    bookId: string;
    stock: number;
  })[];
}

export interface Sede {
  id: string;
  city: string;
  leader: string;
  isPrincipal: boolean;
}
