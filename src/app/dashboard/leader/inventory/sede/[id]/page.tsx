import { getSedeById } from "@/actions/inventory/get-sede-by-id";
import { UpdateStockLevelsBySede } from "@/components/inventory/UpdateStockLevelsBySede";
import { Title } from "@/components/ui/Title";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EditSedeLeader } from "@/components/inventory/ui/EditSedeLeader";
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import { HandlerParishProcessButton } from "@/components/inventory/parish-processes/HandlerParishProcessButton";
import { getParishProcessSales } from "@/actions/sales/get-parish-process-sales";
import { SedeInventoryHandler } from "@/components/inventory/SedeInventoryHandler";
import { getAllBooks } from "@/actions/product/get-all-books";

/**
 * Interface para las props de la página
 * @property params - Objeto con el ID de la sede como parámetro dinámico
 */
interface Props {
  params: Promise<{ id: string }>;
}

/**
 * Página que muestra los detalles de una sede específica
 * Incluye:
 * - Validación de autenticación
 * - Restricción de acceso por roles
 * - Detalles del inventario
 * - Edición de niveles de stock
 */
export default async function SedeDetailsPage({ params }: Props) {
  // Extrae el ID de los parámetros y obtiene la sesión actual
  const { id } = await params;
  const session = await auth();

  // Redirecciona a login si no hay sesión activa
  if (!session || !session.user) redirect("/auth/login");

  // Obtiene los datos de la sede
  const [{ sede, ok, message }, parishSales, { books }] = await Promise.all([
    getSedeById(id),
    getParishProcessSales(id),
    getAllBooks(),
  ]);

  /**
   * Validación de acceso a la sede "Bodega"
   * Solo los administradores pueden acceder a esta sede especial
   */
  if (
    sede?.city.toLocaleLowerCase() === "bodega" &&
    session.user.role !== "admin"
  ) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)] items-center justify-center">
        <Title title="Acceso Denegado" className="text-red-500" />
        <p className="text-center">
          No tienes permiso para acceder a esta página.
        </p>
      </div>
    );
  }

  /**
   * Validación de existencia de la sede
   * Muestra un mensaje de error si la sede no existe o hay un problema
   */
  if (!ok || !sede) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)] items-center justify-center">
        <Title title="Error" className="text-red-500" />
        <p className="text-center">{message}</p>
      </div>
    );
  }

  // Habilita el botón de ver procesos parroquiales solo para administradores, encargado de sede o usuarios asociado a la sede
  const enableViewParishProcesses =
    session.user.role === "admin" ||
    session.user.name!.includes(sede.leader) ||
    session.user.Sede?.id === sede.id;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Link
          href={
            sede.city.toLowerCase() === "bodega"
              ? "/dashboard/productor/warehouse"
              : "/dashboard/leader/inventory"
          }
          className="flex items-center gap-2 text-primary bg-primary/10 rounded !self-start p-2 hover:bg-primary/20 transition-colors"
        >
          <ArrowLeft />
        </Link>

        <div className="flex gap-2 items-center">
          {/* VER VENTAS EN PROCESOS PARROQUIALES */}
          {enableViewParishProcesses && <HandlerParishProcessButton />}
          {/* EDITAR NIVELES DE STOCK */}
          {(session.user.role === "admin" ||
            session.user.name!.includes(sede.leader)) && (
            <UpdateStockLevelsBySede sede={sede} />
          )}
        </div>
      </div>
      <div className="flex items-center justify-between bg-gradient-to-br from-slate-300 via-white via-70% to-slate-300 rounded p-5 shadow-lg overflow-auto">
        <div className="flex max-md:flex-col md:items-end gap-2">
          <h2 className="text-3xl font-bold">Responsable: </h2>
          <h3 className="font-bold text-2xl text-primary">{sede.leader}</h3>
        </div>
        <EditSedeLeader sedeId={sede.id} />
      </div>

      <SedeInventoryHandler
        sede={sede}
        parishSales={parishSales.data ?? []}
        books={books}
      />
    </div>
  );
}
