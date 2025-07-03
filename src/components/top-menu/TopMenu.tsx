"use client";

import { useMenuStore } from "@/store/menu-store";
import { Bell, Menu as MenuIcon, User } from "lucide-react";
import { Logout } from "./Logout";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "../ui/menubar";
import Link from "next/link";

export const TopMenu = () => {
  const { openMenu } = useMenuStore();
  return (
    <nav className="w-full bg-primary/90 shadow-lg h-16 text-white flex items-center px-5">
      <MenuIcon className="block md:hidden" onClick={() => openMenu()} />
      <div className="flex flex-1 items-center justify-end gap-5">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>
              <User />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Link href="/dashboard/my-account" className="flex items-center gap-2">
                  <User className="text-primary" />
                  Mi Cuenta
                </Link>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem variant="destructive">
                <Logout />
              </MenubarItem>
            </MenubarContent>
            <MenubarMenu>
              <MenubarTrigger>
                <Bell />
              </MenubarTrigger>
              <MenubarContent>
                <div id="title" className="flex items-center gap-2 text-primary text-sm">
                  <Bell />
                  Mis Notificaciones
                </div>
                {/* <MenubarItem></MenubarItem> */}
                {/* <MenubarSeparator /> */}
              </MenubarContent>
            </MenubarMenu>
          </MenubarMenu>
        </Menubar>
      </div>
    </nav>
  );
};
