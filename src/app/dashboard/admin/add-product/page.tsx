import { NewProductoForm } from "@/components/product/NewProductoForm";
import { Title } from "@/components/ui/Title";
import { AllBooks } from "@/components/product/AllBooks";
import { getAllBooks } from "@/actions/product/get-all-books";

export default async function AddProductPage() {
  const { books } = await getAllBooks();

  return (
    <div>
      <Title title="Crear Producto" />
      <p className="text-gray-500 text-center">
        Se creará un nuevo producto en el inventario y se agregará a bodega y
        todas las sedes
      </p>
      <NewProductoForm />
      <hr className="my-10"/>
      <AllBooks books={books} />
    </div>
  );
}
