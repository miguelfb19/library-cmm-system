import Link from "next/link";
import Image from "next/image";

export default function NotFoundPage() {
  return (
    <div className="h-[calc(100dvh-4rem)] flex flex-col justify-center items-center max-w-screen max-md:px-5">
      <Image
        src="/not-found.avif"
        alt="imagen que representa pagina no encontrada"
        width={1024}
        height={1024}
        className="w-1/2 max-md:w-full"
      />

      <Link className="btn-blue mt-5 text-center md:!w-1/4" href="/dashboard">
        Volver
      </Link>
    </div>
  );
}
