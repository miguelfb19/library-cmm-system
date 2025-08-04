import { getUsers } from "@/actions/users/get-users";
import { Dialog } from "@/components/ui/dialog";
import { Title } from "@/components/ui/Title";
import { CreateUserDialog } from "@/components/users/CreateUserDialog";
import { UserTable } from '@/components/users/UserTable';
import { getSedes } from "@/actions/inventory/get-sedes";

export default async function AdminUsersPage() {
  const [users, sedes] = await Promise.all([getUsers(), getSedes()]);

  if (!users.ok || !users.data) {
    return (
      <Title title="Error al obtener los usuarios" className="!text-red-500" />
    );
  }


  return (
    <div className="flex flex-col gap-5 p-5">
      <h2 className="font-bold">Usuarios registrados</h2>
      <Dialog>
        <UserTable users={users.data} sedes={sedes.sedes || []} />
        <CreateUserDialog />
      </Dialog>
    </div>
  );
}
