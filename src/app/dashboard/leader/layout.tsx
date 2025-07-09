import { auth } from "@/auth.config";
import { Title } from "@/components/ui/Title";


export default async function LeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user.role !== "admin" && session?.user.role !== "leader") {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <Title
          title="No tienes permiso para acceder a esta página"
          className="!text-red-500"
        />
      </div>
    );
  }

  return <>{children}</>;
}
