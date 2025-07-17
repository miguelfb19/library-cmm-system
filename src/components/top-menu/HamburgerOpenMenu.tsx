"use client";

import { useMenuStore } from "@/store/menu-store";
import { Menu } from "lucide-react";

export const HamburgerOpenMenu = () => {
  const { openMenu } = useMenuStore();

  return <Menu className="block md:hidden" onClick={() => openMenu()} />;
};
