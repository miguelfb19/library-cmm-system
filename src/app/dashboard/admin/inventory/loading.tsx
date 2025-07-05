import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function Loading() {
  return (
    <div className="absolute inset-0 m-auto flex items-center justify-center h-full w-full bg-secondary/50 z-20">
      <LoadingSpinner className="text-primary"/>
    </div>
  );
};

