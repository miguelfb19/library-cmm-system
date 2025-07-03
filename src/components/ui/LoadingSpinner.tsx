import { LoaderCircle } from "lucide-react"

interface Props {
    className?: string;
    size?: number;
}

export const LoadingSpinner = ({ className, size = 30 }: Props) => {
  return (
    <div className={`relative w-full ${className}`}>
        <LoaderCircle size={size} className="absolute inset-0 m-auto animate-spin rotate-90" />
        <LoaderCircle size={size + 12} className="absolute inset-0 m-auto spin-reverse rotate-180" />
        <LoaderCircle size={size + 25} className="absolute inset-0 m-auto animate-spin" />
    </div>
  )
}
