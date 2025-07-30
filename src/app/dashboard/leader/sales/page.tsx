import { Title } from "@/components/ui/Title";
import { SalesRegisterForm } from "@/components/sales/SalesRegisterForm";
import { getSedes } from "@/actions/inventory/get-sedes";
import { getAllBooks } from "@/actions/product/get-all-books";

/**
 * Página de registro de ventas para líderes
 * 
 * @description Esta página permite a los líderes registrar ventas de libros
 * en diferentes sedes. Se obtienen los datos necesarios del servidor antes
 * del renderizado y se pasan al componente de formulario.
 * 
 * @features
 * - Carga de sedes disponibles
 * - Carga de catálogo completo de libros
 * - Interfaz para registro de ventas
 * - Solo accesible para roles de liderazgo
 */
export default async function SalesPage() {
  // Cargar datos en paralelo para optimizar el rendimiento
  const [sedesRes, booksRes] = await Promise.all([
    getSedes(),
    getAllBooks(),
  ]);

  // Transformar datos de sedes para el componente
  const sedes = sedesRes.sedes?.map((sede) => ({
    id: sede.id,
    city: sede.city,
  }));

  return (
    <div>
      {/* Título de la página */}
      <Title title="Registro de Ventas" className="mt-5"/>
      
      {/* Formulario de registro con datos cargados */}
      <SalesRegisterForm sedes={sedes || []} books={booksRes.books || []} />
    </div>
  );
}
