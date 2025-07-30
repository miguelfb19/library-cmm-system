import { Title } from "@/components/ui/Title";
import { SalesRegisterForm } from "@/components/sales/SalesRegisterForm";
import { getSedes } from "@/actions/inventory/get-sedes";
import { getAllBooks } from "@/actions/product/get-all-books";

export default async function SalesPage() {

    const [sedesRes, booksRes] = await Promise.all([
        getSedes(),
        getAllBooks(),
    ]);

    const sedes = sedesRes.sedes?.map((sede) => ({
    id: sede.id,
    city: sede.city,
  }));

  return (
    <div>
      <Title title="Registro de Ventas" className="mt-5"/>
      <SalesRegisterForm sedes={sedes || []} books={booksRes.books || []} />
    </div>
  );
}
