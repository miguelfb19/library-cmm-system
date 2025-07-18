"use client"; // Marca el componente como componente del cliente

// Importaciones necesarias para el componente
import { Category } from "@/generated/prisma";
import { Input } from "../ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { submitAlert } from "@/utils/submitAlert";
import { createNewProduct } from "@/actions/product/create-new-product";

/**
 * Componente que renderiza un formulario para crear nuevos productos
 * Maneja la creación de productos con nombre y categoría
 * Incluye validaciones y feedback visual
 */
export const NewProductoForm = () => {
  // Estado para manejar los datos del producto
  const [product, setProduct] = useState({
    name: "",
    category: "", // Categoría por defecto vacía
  });
  
  // Estado para manejar el estado de carga durante la creación
  const [Loading, setLoading] = useState(false);
  
  // Obtiene todas las categorías disponibles del enum Category
  const categories = Object.values(Category);

  /**
   * Maneja el envío del formulario
   * Incluye validaciones, confirmación y feedback
   * @param e - Evento del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de campos requeridos
    if (!product.name || !product.category) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);

    // Muestra alerta de confirmación antes de crear
    const result = await submitAlert({
      title: "Crear nuevo producto",
      icon: "question",
      text: "¿Estás seguro de que quieres crear este producto?",
      confirmButtonText: "Crear",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });

    // Si el usuario cancela la operación
    if (result.isDenied || result.isDismissed) {
      toast.error("Operación cancelada");
      setLoading(false);
      return;
    }

    // Intenta crear el nuevo producto
    const res = await createNewProduct(product);
    if (!res.ok) {
      toast.error(res.message);
      setLoading(false);
      return;
    }

    // Éxito: muestra mensaje y resetea el formulario
    toast.success(res.message);
    setProduct({ name: "", category: "" }); // Reset form
    setLoading(false);
  };

  // Renderizado del formulario
  return (
    <form
      className="flex flex-col gap-5 mt-10"
      onSubmit={handleSubmit}
    >
      {/* Grid container para los campos del formulario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Campo para el nombre del producto */}
        <div className="flex flex-col gap-2">
          <span>Nombre:</span>
          <Input
            placeholder="Nombre del producto"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
        </div>
        {/* Selector de categoría del producto */}
        <div className="flex flex-col gap-2">
          <span>Categoría:</span>
          <select
            className="custom-select"
            value={product.category}
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
          >
            {/* Opción por defecto deshabilitada */}
            <option value="" disabled>
              Selecciona una categoría
            </option>
            {/* Mapeo de categorías disponibles */}
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Botón de submit con estado de carga */}
      <button
        className={`btn-blue ${
          Loading ? "pointer-events-none opacity-50" : ""
        }`}
        type="submit"
      >
        {Loading ? <LoadingSpinner size={10} /> : "Crear libro"}
      </button>
    </form>
  );
};
