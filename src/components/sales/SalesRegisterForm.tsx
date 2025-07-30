"use client";

import { Book } from "@/interfaces/Book";
import { Input } from "../ui/input";
import { capitalizeWords } from "@/utils/capitalize";
import { Category } from "@/generated/prisma";
import { useForm } from "react-hook-form";
import { submitAlert } from "@/utils/submitAlert";
import { toast } from "sonner";
import { useState } from "react";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { registerSaleBySede } from "@/actions/sales/register-sale-by-sede";

/**
 * Props para el componente SalesRegisterForm
 */
interface Props {
  /** Lista de sedes disponibles para registrar la venta */
  sedes: { id: string; city: string }[];
  /** Lista de libros disponibles en el inventario */
  books: Book[];
}

/**
 * Estructura de datos del formulario de registro de ventas
 */
interface FormData {
  /** ID de la sede donde se registra la venta en formato "id/nombre" */
  origin: string;
  /** Categoría del libro a vender */
  category: Category;
  /** ID del libro a vender en formato "id/nombre" */
  book: string;
  /** Cantidad de libros a vender */
  quantity: number;
}

/**
 * Componente de formulario para registrar ventas de libros por sede
 * 
 * @description Este componente permite a los usuarios registrar ventas de libros
 * específicos en diferentes sedes. Incluye validaciones, confirmación del usuario
 * y actualización automática del inventario tras la venta.
 * 
 * @features
 * - Selección de sede (excluye bodega)
 * - Filtrado de libros por categoría
 * - Validación de formulario con react-hook-form
 * - Confirmación de venta con SweetAlert2
 * - Estados de carga durante el proceso
 * - Notificaciones de éxito/error
 * - Descuento automático del inventario
 */
export const SalesRegisterForm = ({ sedes, books }: Props) => {
  // Estado para manejar el loading durante la operación
  const [isLoading, setIsLoading] = useState(false);
  
  // Configuración del formulario con react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  // Variables reactivas para filtrado dinámico
  const selectedCategory = watch("category");
  const categories = Object.values(Category);

  /**
   * Maneja el envío del formulario de registro de ventas
   * 
   * @description Proceso completo de registro:
   * 1. Muestra confirmación al usuario con los datos de la venta
   * 2. Valida que exista stock suficiente
   * 3. Descuenta del inventario de la sede
   * 4. Muestra notificación de éxito o error
   * 5. Resetea el formulario si es exitoso
   * 
   * @param data - Datos del formulario validados
   */
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    // Mostrar confirmación al usuario con resumen de la venta
    const result = await submitAlert({
      title: "Registro de Venta",
      html: `<b style="color: #0050b3;">¿Desea registrar esta venta?</b> <br><br> <b>Sede:</b> ${capitalizeWords(
        data.origin.split("/")[1].replaceAll("_", " ")
      )}<br> <b>Categoría:</b> ${capitalizeWords(
        data.category.replaceAll("_", " ")
      )}<br> <b>Libro:</b> ${capitalizeWords(
        data.book.split("/")[1].replaceAll("_", " ")
      )}<br> <b>Cantidad:</b> ${
        data.quantity
      } <br><br> <i style="color: red; font-weight: bold;">Estos datos serán descontados en el inventario.</i>`,
      icon: "info",
      confirmButtonText: "Registrar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });

    // Si el usuario cancela la operación
    if (result.isDenied || result.isDismissed) {
      setIsLoading(false);
      return toast.error("Registro de venta cancelado");
    }

    // Procesar el registro de la venta
    const res = await registerSaleBySede({
      origin: data.origin.split("/")[0], // Extraer solo el ID de la sede
      book: data.book.split("/")[0],     // Extraer solo el ID del libro
      quantity: data.quantity,
    });

    // Manejar respuesta del servidor
    if (!res.ok) {
      setIsLoading(false);
      return toast.error(res.message);
    }

    // Operación exitosa: resetear formulario y notificar
    setIsLoading(false);
    reset();
    toast.success("Venta registrada exitosamente");
  };

  return (
    // Formulario principal con diseño responsivo
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Campo de selección de sede */}
      <div className="flex flex-col gap-2">
        <label htmlFor="origin" className="font-semibold">
          Sede
        </label>
        <select
          id="origin"
          className="custom-select"
          {...register("origin", { required: true })}
        >
          <option value="">Seleccione una sede</option>
          {sedes.map((sede) =>
            // Excluir la bodega de las opciones disponibles
            sede.city === "bodega" ? null : (
              <option key={sede.id} value={sede.id + "/" + sede.city}>
                {capitalizeWords(sede.city.replaceAll("_", " "))}
              </option>
            )
          )}
        </select>
        {errors.origin && (
          <span className="text-red-500 text-xs">Este campo es requerido</span>
        )}
      </div>
      
      {/* Campo de selección de categoría */}
      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="font-semibold">
          Categoría
        </label>
        <select
          id="category"
          className="custom-select"
          {...register("category", { required: true })}
        >
          <option value="">Seleccione un seminario o categoría</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {capitalizeWords(category.replaceAll("_", " "))}
            </option>
          ))}
        </select>
        {errors.category && (
          <span className="text-red-500 text-xs">Este campo es requerido</span>
        )}
      </div>
      
      {/* Campo de selección de libro (filtrado por categoría) */}
      <div className="flex flex-col gap-2">
        <label htmlFor="book" className="font-semibold">
          Libro
        </label>
        <select
          id="book"
          className="custom-select"
          {...register("book", { required: true })}
        >
          <option value="">Seleccione un libro</option>
          {books
            // Filtrar libros por la categoría seleccionada
            .filter((book) => book.category === selectedCategory)
            .map((book) => (
              <option key={book.id} value={book.id + "/" + book.name}>
                {capitalizeWords(book.name.replaceAll("_", " "))}
              </option>
            ))}
        </select>
        {errors.book && (
          <span className="text-red-500 text-xs">Este campo es requerido</span>
        )}
      </div>
      
      {/* Campo de cantidad */}
      <div className="flex flex-col gap-2">
        <label htmlFor="quantity" className="font-semibold">
          Cantidad
        </label>
        <Input
          type="number"
          id="quantity"
          {...register("quantity", { required: true })}
          placeholder="Cantidad"
        />
        {errors.quantity && (
          <span className="text-red-500 text-xs">Este campo es requerido</span>
        )}
      </div>
      
      {/* Botón de envío con estado de carga */}
      <button
        type="submit"
        className={`btn-blue md:col-span-2 ${
          isLoading ? "pointer-events-none opacity-50" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? <LoadingSpinner size={10} /> : "Registrar"}
      </button>
    </form>
  );
};
