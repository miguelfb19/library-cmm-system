"use server";

import { Order } from "@/interfaces/Order";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { calculatePendingItems } from "./helpers";

export const dispatchOrder = async (dispatchedOrder: Order) => {
  try {
    const prismaTransaction = await prisma.$transaction(async (tx) => {

      if(!dispatchedOrder.isProduction) {
        // Verificar si hay existencias suficientes en bodega para despachar la orden
        await reviewWarehouseStock(dispatchedOrder);
      }

      // Actualizar el estado de la orden a "despachada"
      const order = await tx.order.update({
        where: { id: dispatchedOrder.id },
        data: {
          state: "dispatched",
          limitDate: null,
          updatedAt: new Date(),
          note: dispatchedOrder.note,
        },
        include: {
          detail: true,
          origin: true,
          dispatchData: true,
        },
      });

      //   Crear la notificacion de actualizacion de la orden
      await tx.notification.create({
        data: {
          userId: order.userId,
          message: order.isProduction
            ? `Tu pedido ${order.id} de producción ha sido despachado`
            : `Tu pedido ${
                order.id
              } ha sido despachado hacía la ciudad de ${order.origin.city.toUpperCase()}`,
          to: dispatchedOrder.isProduction ? "productor" : "admin",
        },
      });

      // Obtener la diferencia entre las cantidades despachadas y las originales
      const pendingItems = calculatePendingItems(
        order.detail,
        dispatchedOrder.detail
      );

      // Crear nueva orden si hay items pendientes
      let newOrder = null;
      if (pendingItems.some((item) => item.quantity > 0)) {
        newOrder = await tx.order.create({
          data: {
            userId: order.userId,
            originId: order.origin.id,
            detail: {
              create: pendingItems
                .filter((item) => item.quantity > 0)
                .map((item) => ({
                  bookId: item.bookId,
                  quantity: item.quantity,
                })),
            },

            limitDate: order.limitDate,
            isProduction: order.isProduction,
            dispatchData: {
              create: {
                name: dispatchedOrder.dispatchData!.name,
                phone: dispatchedOrder.dispatchData!.phone,
                address: dispatchedOrder.dispatchData!.address,
                city: dispatchedOrder.dispatchData!.city,
                document: dispatchedOrder.dispatchData!.document,
              },
            },
          },
        });
        if (!newOrder) {
          throw new Error("Error al crear la nueva orden");
        }
      }

      // Actualizar los detalles de la orden despachada
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          detail: {
            update: order.detail.map((originalItem) => {
              const dispatchedItem = dispatchedOrder.detail.find(
                (item) => item.bookId === originalItem.bookId
              );
              return {
                where: { id: originalItem.id },
                data: {
                  quantity: dispatchedItem?.quantity || originalItem.quantity,
                },
              };
            }),
          },
        },
      });
      if (!updatedOrder) {
        throw new Error("Error al actualizar la orden despachada");
      }

      return { order, newOrder };
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/leader/orders");
    revalidatePath("/dashboard/admin/orders");

    return {
      ok: true,
      message: prismaTransaction?.newOrder
        ? "Se despachó la orden y se creó una nueva con los items restantes de la orden original"
        : "Orden despachada",
      newOrder: prismaTransaction?.newOrder,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Error al despachar la orden",
      status: 500,
    };
  }
};


const reviewWarehouseStock = async (order: Order) => {
  // Buscar la sede principal (bodega)
  const warehouse = await prisma.sede.findFirst({
    where: {
      city: "bodega",
    },
    include: {
      inventory: {
        include: {
          book: true,
        },
      },
    },
  });

  if (!warehouse) {
    throw new Error("No se encontró la sede principal (bodega)");
  }

  // Verificar stock para cada item de la orden
  const insufficientStockBooks: string[] = [];

  for (const orderItem of order.detail) {
    const inventoryItem = warehouse.inventory.find(
      (inv) => inv.bookId === orderItem.bookId
    );

    if (!inventoryItem || inventoryItem.stock < orderItem.quantity) {
      const book = inventoryItem?.book || await prisma.book.findUnique({
        where: { id: orderItem.bookId },
      });
      
      if (book) {
        insufficientStockBooks.push(book.name);
      }
    }
  }

  if (insufficientStockBooks.length > 0) {
    throw new Error(
      `No hay suficientes existencias en bodega para los siguientes libros: ${insufficientStockBooks.join(", ")}`
    );
  }
}