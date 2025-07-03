"use client";

import { useMenuStore } from "@/store/menu-store";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  title: string;
  icon: React.ReactNode;
  path: string;
}

export const SidebarItem = ({ title, icon, path }: Props) => {
  const currentPath = usePathname();
  const { closeMenu } = useMenuStore();
  return (
    <li>
      <Link
        href={path}
        className={`relative px-4 py-3 flex items-center space-x-4 rounded-full transition-all duration-300
          hover:text-white hover:bg-gradient-to-br from-primary/50 to-secondary 
           ${currentPath == path && "text-white bg-primary/90"}`}
        onClick={() => closeMenu()}
        target={path.startsWith("http") ? "_blank" : undefined}
      >
        {icon}
        <span className="-mr-1 font-medium">{title}</span>
      </Link>
    </li>
  );
};
