"use client";

import { useEffect } from "react";
import { useLogoutStore } from "@/store/logout-store";
import { LoadingSpinner } from "./LoadingSpinner";

export const LoadingOnCloseSession = () => {
  const { isCloseSession, reset } = useLogoutStore();

  useEffect(() => {
    // Resetear el estado cuando el componente se desmonta
    return () => {
      reset();
    };
  }, [reset]);

  if (!isCloseSession) {
    return null;
  }

  return (
    <div className="h-full w-full absolute bg-secondary/20 z-20 flex items-center justify-center">
      <LoadingSpinner className="absolute inset-0 m-auto text-primary" />
    </div>
  );
};
