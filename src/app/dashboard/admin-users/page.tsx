import { getUsers } from "@/actions/users/get-users";
import { Title } from "@/components/ui/Title";
import { columns } from "@/components/users/TableColumns";
import { UsersTable } from "@/components/users/UsersTable";

export default async function AdminUsersPage() {
  const {data, ok} = await getUsers();
  if (!ok || !data) {
    return <Title title="Error al obtener los usuarios" className="text-red-500"/>;
  }
  return (
    <div className="flex flex-col gap-5 p-5">
      <h2 className="font-bold">Usuarios registrados</h2>
      <UsersTable columns={columns} data={data} />
    </div>
  );
}
