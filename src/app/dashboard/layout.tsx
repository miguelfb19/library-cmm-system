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
      <div className="flex flex-col flex-1 h-dvh">
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
