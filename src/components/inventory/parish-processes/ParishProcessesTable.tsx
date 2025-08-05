"use client";

import { ParishSale } from "@/interfaces/ParishSale";
import { Empty } from "../../ui/Empty";
import dayjs from "dayjs";
import { Book } from "@/interfaces/Book";
import { capitalizeWords } from "@/utils/capitalize";
import { CustomTooltip } from "../../ui/CustomTooltip";
import { Trash } from "lucide-react";
import { RefoundBooks } from "./RefoundBooks";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { submitAlert } from "@/utils/submitAlert";
import { deleteParishProcessSale } from "@/actions/sales/delete-parish-process-sale";
import { toast } from "sonner";
import Loading from "@/app/dashboard/loading";

interface Props {
  parishSales: ParishSale[];
  books: Book[];
  sedeLeader: string;
}

export const ParishProcessesTable = ({
  parishSales,
  books,
  sedeLeader,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingRows, setLoadingRows] = useState<Record<string, boolean>>({});
  const { data: session } = useSession();

  const filteredSales = parishSales.filter((sale) =>
    sale.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!parishSales || parishSales.length === 0) {
    return <Empty text="No hay procesos parroquiales registrados." />;
  }

  const getBookName = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    return book
      ? capitalizeWords(book.name.replaceAll("_", " "))
      : "Libro no encontrado";
  };

  const handleDeleteParishSale = async (saleId: string, sedeId: string) => {
    setLoadingRows(prev => ({ ...prev, [saleId]: true }));
    
    const result = await submitAlert({
      title: "Eliminar venta de proceso parroquial",
      html: "¿Desea eliminar este registro de venta parroquial? <br /> <b style='color: red;'>Esta acción es irreversible.</b>",
      icon: "info",
      showCancelButton: true,
    });

    if (result.isDenied || result.isDismissed) {
      setLoadingRows(prev => ({ ...prev, [saleId]: false }));
      return;
    }

    const { ok, message } = await deleteParishProcessSale(saleId, sedeId);
    if (!ok) {
      toast.error(message);
      setLoadingRows(prev => ({ ...prev, [saleId]: false }));
      return;
    }

    toast.success(message);
    setLoadingRows(prev => ({ ...prev, [saleId]: false }));
  };

  return (
    <div>
      <Input
        type="text"
        placeholder="Buscar por parroquia..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-1/2"
      />
      <div className="overflow-auto">
        <table className="min-w-[50rem] w-full text-sm text-center">
          <thead className="bg-secondary font-bold">
            <tr className="border-b h-10">
              <th>Parroquia</th>
              <th>Encargado</th>
              <th>Libro</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Fecha creación</th>
              <th>Última actualización</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale) => (
              <tr key={sale.id} className="border-b h-10 relative">
                <td>{sale.name}</td>
                <td>{sale.manager}</td>
                <td>{getBookName(sale.bookId)}</td>
                <td>{sale.quantity}</td>
                <td>
                  <ParishSaleStatus isActive={sale.isActive} />
                </td>
                <td>{dayjs(sale.createdAt).format("DD/MM/YYYY")}</td>
                <td>
                  {sale.refundedAt
                    ? dayjs(sale.refundedAt).format("DD/MM/YYYY")
                    : "N/A"}
                </td>
                <td className="flex justify-center items-center gap-2 h-12">
                  {(session?.user.name!.includes(sedeLeader) ||
                    session?.user.role === "admin") &&
                  sale.isActive ? (
                    <CustomTooltip text="Devoluciones" withSpan>
                      <RefoundBooks
                        sale={sale}
                        bookName={getBookName(sale.bookId)}
                      />
                    </CustomTooltip>
                  ) : null}
                  {loadingRows[sale.id] && <Loading size={10} />}
                  {(session?.user.name!.includes(sedeLeader) ||
                    session?.user.role === "admin") &&
                  !sale.isActive ? (
                    <CustomTooltip text="Eliminar registro">
                      <button
                        className="btn-red !w-auto"
                        onClick={() =>
                          handleDeleteParishSale(sale.id, sale.sedeId)
                        }
                        disabled={loadingRows[sale.id] || sale.isActive}
                      >
                        <Trash />
                      </button>
                    </CustomTooltip>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ParishSaleStatus = ({ isActive }: { isActive: boolean }) => {
  if (isActive) {
    return <span className="text-yellow-500">En venta</span>;
  } else {
    return <span className="text-purple-500">Terminado</span>;
  }
};
