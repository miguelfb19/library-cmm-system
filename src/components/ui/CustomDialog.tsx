"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  title: string;
  children: React.ReactNode;
  trigger: React.ReactNode;
  description?: string;
  footer?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: "default" | "lg" | "xl";
  maxHeight?: 100 | 90 | 80 | 70 | 60 | 50 | undefined;
}

export const CustomDialog = ({
  title,
  description,
  children,
  trigger,
  footer,
  size = "default",
  open = undefined,
  onOpenChange = undefined,
  maxHeight = undefined,
}: Props) => {
  const defineSize =
    size === "lg" ? "!max-w-2xl" : size === "xl" ? "!max-w-4xl" : "";
  const defineMaxHeight =
    maxHeight === 100
      ? "!max-h-[100dvh]"
      : maxHeight === 90
      ? "!max-h-[90dvh]"
      : maxHeight === 80
      ? "!max-h-[80dvh]"
      : maxHeight === 70
      ? "!max-h-[70dvh]"
      : maxHeight === 60
      ? "!max-h-[60dvh]"
      : maxHeight === 50
      ? "!max-h-[50dvh]"
      : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <span>{trigger}</span>
      </DialogTrigger>
      <DialogContent
        className={`${defineSize} ${defineMaxHeight} overflow-auto`}
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
