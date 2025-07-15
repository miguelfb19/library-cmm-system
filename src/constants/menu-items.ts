import { BookCopy, House, LibraryBig, Package, Users, Warehouse } from "lucide-react";


export const menuItems = [
  {
    name: "Inicio",
    path: "/dashboard",
    icon: House,
  },
];

export const LeaderMenuItems = [
  {
    name: "Inventario",
    path: "/dashboard/leader/inventory",
    icon: BookCopy,
  },
  {
    name: "Pedidos",
    path: "/dashboard/leader/orders",
    icon: Package,
  },
];

export const AdminMenuItems = [
  {
    name: "Usuarios",
    path: "/dashboard/admin/users",
    icon: Users,
  },
  {
    name: "Libros",
    path: "/dashboard/admin/books",
    icon: LibraryBig,
  },
];

export const ProductorMenuItems = [
  {
    name: "Bodega",
    path: "/dashboard/productor/warehouse",
    icon: Warehouse,
  },
];
