import { Column, Sale, SaleCard } from "../interfaces/interfaces";
import { generateUniqueID } from "./helpers";

export function createSaleCard(columnId: number, saleCards: SaleCard[], setSaleCards: any, sale: Sale) {
  const newSaleCard: SaleCard = {
    id: generateUniqueID(saleCards, 100000, 999999),
    columnId,
    sale,
  };
  setSaleCards([...saleCards, newSaleCard]);
}

export function deleteSaleCard(id: number, saleCards: SaleCard[], setSaleCards: any) {
  const newSaleCardList = saleCards.filter((sale) => sale.id !== id);
  setSaleCards(newSaleCardList);
}

export function updateSaleCard(id: number, saleCards: SaleCard[], setSaleCards: any, saleToUpdate: Sale) {
  const newSaleCards = saleCards.map((saleCard) => {
    if (saleCard.id !== id) return saleCard;
    return { ...saleCard, sale: saleToUpdate };
  });
  setSaleCards(newSaleCards);
}

export function createNewColumn(columns: Column[], setColumns: any) {
  const id = generateUniqueID(columns, 100000, 999999);
  const newColumn: Column = {
    id: id,
    title: `Column ${columns.length + 1}`,
  };

  setColumns([...columns, newColumn]);
}

export function updateColumn(id: number, columns: Column[], setColumns: any, title: string) {
    const newColumns = columns.map(col => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newColumns);
}

export function deleteColumn(id: number, columns: Column[], setColumns: any, saleCards: SaleCard[], setSaleCards: any) {
  const filteredColumns = columns.filter((col) => col.id !== id);
  setColumns(filteredColumns);

  const newSaleCards = saleCards.filter((sale) => sale.columnId !== id);
  setSaleCards(newSaleCards);
}