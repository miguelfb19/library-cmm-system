import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col gap-10 items-center justify-center bg-secondary px-5 text-primary">
      <div className="rounded bg-white flex flex-col p-5 md:p-10 shadow-lg">
        <Image
          src="/logo-azul.avif"
          alt="Logo"
          width={500}
          height={500}
          className="w-96 mb-10"
        />
        {children}
      </div>
    </div>
  );
}
