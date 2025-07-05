import { BookCopy, House, Users, Warehouse } from "lucide-react";


export const menuItems = [
  {
    name: "Inicio",
    path: "/dashboard",
    icon: House,
  },
  {
    name: "Solicitar Material",
    path: "/dashboard/request-material",
    icon: BookCopy,
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

export const AdminMenuItems = [
  {
    name: "Usuarios",
    path: "/dashboard/admin/users",
    icon: Users,
  },
  {
    name: "Inventario",
    path: "/dashboard/admin/inventory",
    icon: Warehouse,
  },
  // {
  //   name: "Mensaje a clientes",
  //   path: "/dashboard/customers-message",
  //   icon: FaWhatsapp,
  // },
];
