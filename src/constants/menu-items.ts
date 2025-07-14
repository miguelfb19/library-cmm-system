import { BookCopy, Boxes, House, LibraryBig, Users, Warehouse } from "lucide-react";


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
];

export const AdminMenuItems = [
  {
    name: "Usuarios",
    path: "/dashboard/admin/users",
    icon: Users,
  },
  {
    name: "Pedidos Producción",
    path: "/dashboard/admin/production-orders",
    icon: Boxes,
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
