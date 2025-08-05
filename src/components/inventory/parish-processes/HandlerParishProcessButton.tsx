"use client";

import { BookCopy, Church } from "lucide-react";
import { CustomTooltip } from "../../ui/CustomTooltip";
import { useParishProcessStore } from "@/store/parish-process-store";
import { useEffect } from "react";

export const HandlerParishProcessButton = () => {
  const { isViewProcesses, openProcesses, closeProcesses } =
    useParishProcessStore();

  useEffect(() => {
    return () => {
      // Cleanup function to reset the state when the component unmounts
      closeProcesses();
    };
  }, []);

  return (
    <CustomTooltip
      text={isViewProcesses ? `Ver inventario` : `Ver procesos parroquiales`}
    >
      <button
        className="btn-blue"
        onClick={isViewProcesses ? closeProcesses : openProcesses}
      >
        {isViewProcesses ? <BookCopy /> : <Church />}
      </button>
    </CustomTooltip>
  );
};
