"use client";

import { useState } from "react";
import { Minus, PackagePlus, Plus } from "lucide-react";
import { CustomDialog } from "../ui/CustomDialog";
import { Input } from "../ui/input";
import { capitalizeWords } from "@/utils/capitalize";
import { DatePicker } from "../ui/DatePicker";
import { Book } from "@/interfaces/Book";
import { CustomTooltip } from "../ui/CustomTooltip";
import { toast } from "sonner";
import { submitAlert } from "@/utils/submitAlert";
import { createNewOrder } from "@/actions/orders/create-new-order";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import Loading from "@/app/dashboard/loading";
import { DispatchData } from "@/interfaces/DispatchData";

/**
 * Interface que define las propiedades necesarias para el componente
 * @property isProduction - Indica si el pedido es de producción
 * @property sedes - Lista de sedes disponibles
 * @property books - Catálogo de libros disponibles
 * @property userId - ID del usuario que realiza el pedido
 */
interface Props {
  isProduction?: boolean;
  sedes: { id: string; city: string }[];
  books: Book[];
  userId: string;
}

/**
 * Componente para crear nuevos pedidos de libros
 * Permite seleccionar sede, fecha límite y detalles de libros
 */
export const NewOrder = ({
  isProduction = false,
  sedes,
  books,
  userId,
}: Props) => {
  // Estados para manejar el formulario
  const [open, setOpen] = useState(false); // Control del modal
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [limitDate, setLimitDate] = useState<Date | undefined>(undefined); // Fecha límite
  const [origin, setOrigin] = useState<string>(""); // Sede de origen
  const [detail, setDetail] = useState<{ bookId: string; quantity: number }[]>([
    { bookId: "", quantity: 0 },
  ]);
  const [dispatchData, setDispatchData] = useState<DispatchData>({
    name: "",
    phone: "",
    address: "",
    city: "",
    document: "",
  }); // Datos de envío, si aplica
  const [note, setNote] = useState<string | null>(null); // Notas del pedido

  /**
   * Maneja el cambio de libro seleccionado
   * @param index - Índice del detalle a modificar
   * @param bookId - ID del libro seleccionado
   */
  const handleBookChange = (index: number, bookId: string) => {
    const newDetail = [...detail];
    newDetail[index].bookId = bookId;
    setDetail(newDetail);
  };

  /**
   * Maneja el cambio en la cantidad de libros
   * @param index - Índice del detalle a modificar
   * @param quantity - Nueva cantidad
   */
  const handleQuantityChange = (index: number, quantity: number) => {
    const newDetail = [...detail];
    newDetail[index].quantity = quantity;
    setDetail(newDetail);
  };

  /**
   * Agrega una nueva línea de detalle al pedido
   */
  const addNewBook = () => {
    setDetail([...detail, { bookId: "", quantity: 0 }]);
  };

  /**
   * Elimina una línea de detalle del pedido
   * @param bookId - ID del libro a eliminar
   */
  const removeBook = (bookId: string) => {
    setDetail(detail.filter((item) => item.bookId !== bookId));
  };

  /**
   * MANEJO DE ENVÍO DEL FORMULARIO
   * Incluye validaciones y confirmación antes de crear el pedido
   */
  const onSubmit = async () => {
    // Validate the order details
    if (
      detail.length === 0 ||
      detail.some((item) => item.bookId === "" || item.quantity <= 0)
    ) {
      toast.error(
        "No puedes hacer un pedido sin libros o con cantidades inválidas. Revisa tu pedido"
      );
      return;
    }

    // Validate dispatch data 
    if (
      !dispatchData.name ||
      !dispatchData.phone ||
      !dispatchData.address ||
      !dispatchData.city ||
      !dispatchData.document
    ) {
      toast.error("Debes completar todos los datos de envío");
      return;
    }

    // If not production and no origin selected, show error
    if (!isProduction && origin === "") {
      toast.error("Debes seleccionar una sede de origen para el pedido");
      return;
    }

    setIsLoading(true);
    setOpen(false);
    const result = await submitAlert({
      title: "¿Estás seguro de hacer el pedido?",
      text: "Revisa que los datos sean correctos antes de confirmar",
      confirmButtonText: "Hacer pedido",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      icon: "question",
    });

    if (result.isDenied || result.isDismissed) {
      toast.error("Pedido cancelado");
      setIsLoading(false);
      setOpen(true);
      return;
    }

    // Validación del origin
    const selectedOrigin = isProduction
      ? sedes.find((sede) => sede.city === "bodega")
      : sedes.find((sede) => sede.id === origin);

    if (!selectedOrigin?.id) {
      toast.error("Sede de origen inválida");
      setIsLoading(false);
      setOpen(true);
      return;
    }

    // CREATE ORDER DATA
    const data = {
      origin: selectedOrigin,
      limitDate: limitDate || null,
      detail,
      isProduction,
      userId,
      note,
      dispatchData
    };

    const { ok, message } = await createNewOrder(data);

    if (!ok) {
      toast.error(message || "Error al crear el pedido");
      setIsLoading(false);
      setOpen(true);
      return;
    }

    // reset all fields
    toast.success("Pedido creado exitosamente");
    setIsLoading(false);
    setOpen(false);
    setLimitDate(undefined);
    setOrigin("");
    setDetail([{ bookId: "", quantity: 0 }]);
  };

  return (
    <>
      <CustomDialog
        title="Crear nuevo pedido"
        description="Los campos marcados con * son obligatorios"
        trigger={
          <CustomTooltip text="Hacer un nuevo pedido">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="btn-blue !w-auto"
            >
              <PackagePlus />
            </button>
          </CustomTooltip>
        }
        open={open}
        onOpenChange={setOpen}
        size="lg"
        maxHeight={90}
      >
        {/* Formulario principal */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Selector de sede (solo para pedidos no productivos) */}
          {!isProduction && (
            <div className="flex flex-col gap-2">
              <label htmlFor="origin" className="font-bold">
                ¿Para cual sede es el pedido? <b className="text-red-500">*</b>
              </label>
              <select
                id="origin"
                className="custom-select"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              >
                <option value="">Seleccione una sede</option>
                {sedes.map((sede) =>
                  sede.city === "bodega" ? null : (
                    <option key={sede.id} value={sede.id}>
                      {capitalizeWords(sede.city)}
                    </option>
                  )
                )}
              </select>
            </div>
          )}
          {/* Selector de fecha límite */}
          <div className="flex flex-col gap-2">
            <label className="font-bold">
              ¿Cual es la fecha límite de recepción?
            </label>
            <DatePicker
              date={limitDate}
              setDate={setLimitDate}
              triggerText="Fecha límite"
              futureDatesOnly
            />
          </div>

          {/* LISTADO DE LIBROS A PEDIR */}
          <div className="h-32 max-h-32 overflow-y-auto md:col-span-2">
            {detail.map((item, index) => (
              <div className="flex gap-2" key={index}>
                <div className="flex flex-col gap-2">
                  <label htmlFor={`book-${index}`} className="font-bold">
                    Seleccione el libro:
                  </label>
                  <select
                    name={`book-${index}`}
                    id={`book-${index}`}
                    className="custom-select w-full"
                    value={item.bookId}
                    onChange={(e) => handleBookChange(index, e.target.value)}
                  >
                    <option value="">Seleccione un libro</option>
                    {books.map((book) => (
                      <option key={book.id} value={book.id}>
                        {capitalizeWords(book.name.replaceAll("_", " "))} -{" "}
                        {capitalizeWords(book.category.replaceAll("_", " "))}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor={`quantity-${index}`} className="font-bold">
                    Cantidad:
                  </label>
                  <Input
                    type="number"
                    id={`quantity-${index}`}
                    placeholder="Cantidad"
                    value={item.quantity || ""}
                    onChange={(e) =>
                      handleQuantityChange(index, Number(e.target.value))
                    }
                  />
                </div>
                {index !== 0 && (
                  <CustomTooltip text="Quitar libro">
                    <button
                      type="button"
                      className="btn-red-outline !w-auto self-end"
                      onClick={() => removeBook(item.bookId)}
                    >
                      <Minus />
                    </button>
                  </CustomTooltip>
                )}
              </div>
            ))}
          </div>
          <CustomTooltip text="Agregar otro libro">
            <button
              type="button"
              className="btn-blue !w-14"
              onClick={addNewBook}
            >
              <Plus />
            </button>
          </CustomTooltip>

          {/* Datos de envío */}
          <div className="flex flex-col gap-2 col-span-2">
            <label className="font-bold">
              Datos de envío <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="Nombre del destinatario"
                value={dispatchData?.name || ""}
                onChange={(e) =>
                  setDispatchData({
                    ...dispatchData,
                    name: e.target.value,
                  })
                }
              />
              <Input
                type="text"
                placeholder="Teléfono del destinatario"
                value={dispatchData?.phone || ""}
                onChange={(e) =>
                  setDispatchData({
                    ...dispatchData,
                    phone: e.target.value,
                  })
                }
              />
                <Input
                  type="text"
                  placeholder="Documento del destinatario"
                  value={dispatchData?.document || ""}
                  onChange={(e) =>
                    setDispatchData({
                      ...dispatchData,
                      document: e.target.value,
                    })
                  }
                />
              <Input
                type="text"
                placeholder="Ciudad de envío"
                value={dispatchData?.city || ""}
                onChange={(e) =>
                  setDispatchData({
                    ...dispatchData,
                    city: e.target.value,
                  })
                }
              />
                <Input
                  type="text"
                  placeholder="Dirección de envío"
                  value={dispatchData?.address || ""}
                  onChange={(e) =>
                    setDispatchData({
                      ...dispatchData,
                      address: e.target.value,
                    })
                  }
                  className="col-span-2"
                />
            </div>
          </div>
          <textarea
            name="note"
            id="note"
            placeholder="Notas sobre el pedido"
            maxLength={500}
            className="w-full min-h-10 max-h-24 h-24 p-2 border border-gray-300 rounded col-span-2"
            value={note || undefined}
            onChange={(e) => setNote(e.target.value)}
          />
          <button
            type="button"
            onClick={onSubmit}
            className="btn-blue md:col-span-2"
          >
            {isLoading ? <LoadingSpinner size={10} /> : "Hacer pedido"}
          </button>
        </form>
      </CustomDialog>
      {isLoading && <Loading />}
    </>
  );
};
