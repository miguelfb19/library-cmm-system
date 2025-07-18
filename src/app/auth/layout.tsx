import { auth } from "@/auth.config";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await auth()

  if(session) redirect("/dashboard");
  return (
    <div className="flex min-h-screen flex-col gap-10 items-center justify-center bg-secondary px-5 text-primary">
      <div className="rounded bg-white flex flex-col p-5 md:p-10 shadow-lg">
        <Image
          src="/logo-azul.avif"
          alt="Logo"
          width={500}
          height={500}
          className="w-96 mb-10"
          priority
        />
        {children}
      </div>
    </div>
  );
}
