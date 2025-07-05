import { auth } from "@/auth.config";
import { EditBasicInformationForm } from "@/components/account/EditBasicInformationForm";
import { EditPasswordForm } from "@/components/account/EditPasswordForm";
import { Title } from "@/components/ui/Title";
import { redirect } from "next/navigation";

export default async function MyAccountPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const user = {
    ...session.user,
    name: session.user.name ?? "",
    email: session.user.email ?? "",
    phone: session.user.phone ?? "",
  };
  return (
    <div className="h-full flex flex-col gap-10 justify-center">
      <Title title="Mi Cuenta" />
      <EditBasicInformationForm user={user} />
      <EditPasswordForm userId={user.id} />
    </div>
  );
}
