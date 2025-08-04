"use client";

import Image from "next/image";
import Link from "next/link";
import { createElement, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useMenuStore } from "@/store/menu-store";
import { CircleX } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import {
  AdminMenuItems,
  LeaderMenuItems,
  menuItems,
  ProductorMenuItems,
} from "@/constants/menu-items";
import { SidebarItem } from "./SidebarItem";

export const Sidebar = () => {
  const { data: session, status, update } = useSession();
  const { isOpen, closeMenu } = useMenuStore();

  useEffect(() => {
    // Force update session when status changes
    if (status === "unauthenticated" || status === "authenticated") update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <aside
      className={`fixed md:relative z-10 h-[100dvh] w-full md:w-[20%] md:min-w-[20%] flex flex-col p-5  bg-secondary text-primary overflow-y-auto overflow-x-hidden shadow-lg ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-all duration-300 md:translate-x-0`}
    >
      <div className="overflow-y-auto overflow-x-hidden scrollbar-custom">
        <button
          className="absolute top-5 right-5 md:hidden"
          onClick={closeMenu}
        >
          <CircleX />
        </button>
        <div className="-mx-6 px-6 py-4">
          <Link href="/dashboard" title="home">
            <Image
              width={500}
              height={500}
              src="/logo-azul.avif"
              className="m-auto w-64 md:w-full"
              alt="logo de cafe jardin de paraíso"
              priority
            />
          </Link>
        </div>
        <div className="my-2">
          <span>Hola,</span>
          <br />
          <div className="flex flex-col">
            {status === "loading" ? (
              <>
                <Skeleton className="w-full h-7" />
              </>
            ) : (
              <>
                <span className="font-semibold">{session?.user.name}</span>
              </>
            )}
          </div>
        </div>

        {/* LISTA DE MENU */}

        <div id="menu-list" className="text-[0.9rem]">
          {status === "loading" ? (
            <div className="flex flex-col gap-3 mb-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton className="w-full h-12" key={index}/>
              ))}
            </div>
          ) : (
            <>
              <ul className="space-y-2 pb-1">
                {menuItems.map(({ name, path, icon }) => (
                  <SidebarItem
                    key={name}
                    title={name}
                    path={path}
                    icon={createElement(icon)}
                  />
                ))}
              </ul>
              {session?.user.role === "admin" ||
              session?.user.role === "leader" ? (
                <ul className="space-y-2">
                  {LeaderMenuItems.map(({ name, path, icon }) => (
                    <SidebarItem
                      key={name}
                      title={name}
                      path={path}
                      icon={createElement(icon)}
                    />
                  ))}
                </ul>
              ) : null}
              {session?.user.role === "admin" ||
              session?.user.role === "productor" ? (
                <>
                  <div>
                    <hr className="mt-2" />
                    <div className="font-bold py-2 text-base">Producción</div>
                  </div>
                  <ul className="space-y-2">
                    {ProductorMenuItems.map(({ name, path, icon }) => (
                      <SidebarItem
                        key={name}
                        title={name}
                        path={path}
                        icon={createElement(icon)}
                      />
                    ))}
                  </ul>
                </>
              ) : null}

              {session?.user.role === "admin" ? (
                <>
                  <div>
                    <hr className="mt-2" />
                    <div className="font-bold py-2 text-base">
                      Administrador
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {AdminMenuItems.map(({ name, path, icon }) => (
                      <SidebarItem
                        key={name}
                        title={name}
                        path={path}
                        icon={createElement(icon)}
                      />
                    ))}
                  </ul>
                </>
              ) : null}
            </>
          )}
        </div>
      </div>
    </aside>
  );
};
