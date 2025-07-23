/**
 * Calcula los items pendientes después de una recepción parcial
 * @param originalItems - Los items de la orden original
 * @param receivedItems - Los items que fueron recibidos
 * @returns Array de items con las cantidades pendientes
 */
export const calculatePendingItems = (originalItems: any[], receivedItems: any[]) => {
  return originalItems.map((item) => {
    const dispatchedItem = receivedItems.find(
      (detail) => detail.id === item.id
    );
    return {
      ...item,
      quantity: item.quantity - (dispatchedItem?.quantity || 0),
    };
  });
};