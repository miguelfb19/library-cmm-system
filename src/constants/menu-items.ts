import { BookCopy, Boxes, FilePlus, House, Users, Warehouse } from "lucide-react";


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
    name: "Crear producto",
    path: "/dashboard/admin/add-product",
    icon: FilePlus,
  },
];

export const ProductorMenuItems = [
  {
    name: "Bodega",
    path: "/dashboard/productor/warehouse",
    icon: Warehouse,
  },
];
