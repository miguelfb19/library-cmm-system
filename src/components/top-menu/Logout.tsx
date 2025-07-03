"use client";

import { useSession } from "next-auth/react";
import { logout } from "@/actions/auth/logout";
import { Skeleton } from "../ui/skeleton";
import { LogOut } from "lucide-react";
import { useLogoutStore } from "@/store/logout-store";

export const Logout = () => {
  const { status } = useSession();
  const { closingSession, reset } = useLogoutStore();
  const logoutSession = async () => {
    closingSession();
    await logout();
    reset();
  };

  return (
    <div className="relative flex items-center">
      <div className="relative">
        {status === "loading" ? (
          <Skeleton className="w-full h-6" />
        ) : (
          <button
            className="flex gap-2 items-center cursor-pointer"
            onClick={logoutSession}
          >
            <LogOut size={10} className="text-red-500" />
            <span>Cerrar sesión</span>
          </button>
        )}
      </div>
    </div>
  );
};
