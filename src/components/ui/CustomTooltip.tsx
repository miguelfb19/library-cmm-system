"use client";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface Props {
  children: React.ReactNode;
  text: string;
  withSpan: boolean;
}

export const CustomTooltip = ({ children, text, withSpan }: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {withSpan ? (
          <span className="cursor-pointer">{children}</span>
        ) : (
          children
        )}
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  );
};
