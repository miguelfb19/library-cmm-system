import { BookCopy, House, Users, Warehouse } from "lucide-react";


export const menuItems = [
  {
    name: "Inicio",
    path: "/dashboard",
    icon: House,
  },
  // {
    //   name: "Invitar referido",
  //   path: "/dashboard",
  //   icon: FaUserEdit,
  // },
  // {
    //   name: "Mi cuenta",
  //   path: "/dashboard",
  //   icon: RiAccountPinCircleFill,
  // },
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
  // {
  //   name: "Mensaje a clientes",
  //   path: "/dashboard/customers-message",
  //   icon: FaWhatsapp,
  // },
];

export const ProductorMenuItems = [
  {
    name: "Bodega",
    path: "/dashboard/productor/warehouse",
    icon: Warehouse,
  },
];
