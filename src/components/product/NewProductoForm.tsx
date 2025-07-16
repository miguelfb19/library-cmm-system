"use client";

import { Category } from "@/generated/prisma";
import { Input } from "../ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { submitAlert } from "@/utils/submitAlert";
import { createNewProduct } from "@/actions/product/create-new-product";

export const NewProductoForm = () => {
  const [product, setProduct] = useState({
    name: "",
    category: "", // Default category
  });
  const [Loading, setLoading] = useState(false);
  const categories = Object.values(Category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product.name || !product.category) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);

    const result = await submitAlert({
      title: "Crear nuevo producto",
      icon: "question",
      text: "¿Estás seguro de que quieres crear este producto?",
      confirmButtonText: "Crear",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });

    if (result.isDenied || result.isDismissed) {
      toast.error("Operación cancelada");
      setLoading(false);
      return;
    }

    const res = await createNewProduct(product);
    if (!res.ok) {
      toast.error(res.message);
      setLoading(false);
      return;
    }
    toast.success(res.message);
    setProduct({ name: "", category: "" }); // Reset form
    setLoading(false);
  };

  return (
    <form
      className="flex flex-col gap-5 mt-10"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <span>Nombre:</span>
          <Input
            placeholder="Nombre del producto"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span>Categoría:</span>
          <select
            className="custom-select"
            value={product.category}
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
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
