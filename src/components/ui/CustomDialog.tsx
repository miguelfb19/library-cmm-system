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
  description?: string;
  children: React.ReactNode;
  trigger: React.ReactNode;
  footer?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: "default" | "lg" | "xl";
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
}: Props) => {
  const defineSize =
    size === "lg" ? "!max-w-2xl" : size === "xl" ? "!max-w-4xl" : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={defineSize} aria-describedby={undefined}>
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
