import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { TopMenu } from "../../components/top-menu/TopMenu";
import { LoadingOnCloseSession } from "../../components/ui/LoadingOnCloseSession";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  return (
    <div className="flex min-h-dvh relative">
      <Sidebar />
      {/* el width de 50% (w-1/2) en el siguiente div hace que funcione bien el layout, no me pregunten como XD */}
      {/* !IMPORTANTE: No lo quiten porque se rompe jeje */}
      <div className="flex flex-col flex-1 h-dvh w-1/2">
        <TopMenu />
        <div className="flex-1 p-5 bg-secondary overflow-hidden">
          <div className="rounded bg-white shadow-lg min-h-full max-h-full p-3 overflow-auto">
            {children}
          </div>
        </div>
      </div>
      <LoadingOnCloseSession />
    </div>
  );
}
