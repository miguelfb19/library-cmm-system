import { getUsers } from "@/actions/users/get-users";
import { Dialog } from "@/components/ui/dialog";
import { Title } from "@/components/ui/Title";
import { columns } from "@/components/users/TableColumns";
import { UsersTable } from "@/components/users/UsersTable";
import { CreateUserDialog } from "../../../components/users/CreateUserDialog";
import { auth } from "@/auth.config";

export default async function AdminUsersPage() {
  const { data, ok } = await getUsers();
  const session = await auth()

  if(session?.user.role !== "admin") {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <Title title="No tienes permiso para acceder a esta página" className="text-red-500" />
      </div>
    );
  }

  if (!ok || !data) {
    return (
      <Title title="Error al obtener los usuarios" className="text-red-500" />
    );
  }


  return (
    <div className="flex flex-col gap-5 p-5">
      <h2 className="font-bold">Usuarios registrados</h2>
      <Dialog>
        <UsersTable columns={columns} data={data} />
        <CreateUserDialog />
      </Dialog>
    </div>
  );
}
