import { Column, Sale, SaleCard } from "../../interfaces/interfaces";
import PlusIcon from "../../icons/PlusIcon";
import { useMemo, useState } from "react";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import SaleCardComponent from "./SaleCardComponent";
import { moveDatabase } from "../../services/db-requests";

interface Props {
  columns: Array<Column>;
  saleCards: Array<SaleCard>;
  loadSale: (sale: Sale) => void;
  updateSaleCard: (id: number, saleToUpdate: Sale) => void;
  deleteSaleCard: (id: number) => void;
  createNewColumn : () => void;
  updateColumn: (id: number, title: string) => void;
  deleteColumn: (id: number) => void;
  setColumns: any;
  setSaleCards: any;
}

function KanbanBoard({ columns, saleCards, loadSale, updateSaleCard, deleteSaleCard, createNewColumn, updateColumn, deleteColumn, setColumns, setSaleCards }: Props ) {
    
  const [editMode, setEditMode] = useState(false);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeSale, setActiveSale] = useState<SaleCard | null>(null);


  const sensors = useSensors(useSensor(PointerSensor, {
      activationConstraint:{
        distance: 3,
      }
    }
  ))
  
  const columnsId = useMemo(() => columns.map((col) => col.id).filter(id => id !== undefined), [columns])


  function onDragStart(e: DragStartEvent) {
    if (e.active.data.current?.type === "Sale Card") {
      setActiveSale(e.active.data.current.saleCard); 
      return;
    } 
    if (e.active.data.current?.type === "Column") {
      setActiveColumn(e.active.data.current.column);
      return;
    }
  }
  

  function OnDragEnd(e: DragEndEvent) {
    console.log(`OnDragEnd called`);
    const { active, over } = e;
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    // Reset the active elements after dragging is complete
    setActiveColumn(null);
    setActiveSale(null);
  
    if (active.data.current?.type === "Column") {
      if (activeId === overId) return;
  
      // Move columns
      setColumns((columns: Column[]) => {
        const activeColumnIndex = columns.findIndex(col => col.id === activeId);
        const overColumnIndex = columns.findIndex(col => col.id === overId);
        moveDatabase('columnModel', columns[activeColumnIndex], columns[overColumnIndex])
        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });
      return;
    }
  
    if (active.data.current?.type === "Sale Card") {
      const activeSale = saleCards.find(sale => sale.id === activeId);
  
      if (activeSale && over.data.current?.type === "Column") {
        const newColumn = columns.find((col) => col.id === overId as number) || undefined;
        
        if (!newColumn) throw new Error("Column not found.")
     
          const updatedSaleCard = {
            ...activeSale,
            columnId: newColumn.id,
            sale: { ...activeSale.sale, dealStage: newColumn.title },
          };
  
          setSaleCards((saleCards: Array<SaleCard>) =>
            saleCards.map(saleCard =>
              saleCard.id === activeId ? updatedSaleCard : saleCard
            )
          );
      }
    }
  }
  

  function onDragOver(e: DragOverEvent) {
    console.log(`onDragOver called`);
    
    const { active, over } = e;

    if (!over ) return;

    const activeId = active.id;
    const overId = over.id;
    
    if(activeId === overId) return;

    const isActiveSale = active.data.current?.type === "Sale Card";
    const isOverSale = over.data.current?.type === "Sale Card";
    
    if (!isActiveSale) return;

    if (isActiveSale && isOverSale) {
      setSaleCards((saleCards: SaleCard[]) => {

        const activeSaleIndex = saleCards.findIndex(sale => sale.id === activeId);
  
        const overSaleIndex = saleCards.findIndex(sale => sale.id === overId);

        saleCards[activeSaleIndex].columnId = saleCards[overSaleIndex].columnId
        
        saleCards[activeSaleIndex].sale.dealStage = saleCards[overSaleIndex].sale.dealStage
  
        return arrayMove(saleCards, activeSaleIndex, overSaleIndex);
      });

      const isOverColumn = over.data.current?.type === "Column"

      if (isActiveSale && isOverColumn) {
        setSaleCards((saleCards: SaleCard[]) => {
          const activeSaleIndex = saleCards.findIndex(sale => sale.id === activeId);
    
          saleCards[activeSaleIndex].columnId = overId as number

          return arrayMove(saleCards, activeSaleIndex, activeSaleIndex);
        });
      }
    }
  };

  return (
    
    <div className="
      h-[100%]
      w-[100%]
    ">
      <div className="
      m-auto
      flex 
      items-center
      overflow-x-auto
      overflow-y-hidden
      px-[40px]
      ">
        <button onClick={() => {setEditMode(prev => !prev)}}>Edit Mode</button>
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={OnDragEnd} onDragOver={onDragOver}>
          <div className="m-auto flex gap-4">
            <div className="flex gap-4">
              <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer 
                column={col} 
                key={col.id} 
                deleteColumn={deleteColumn} 
                updateColumn={updateColumn} 
                deleteSaleCard={deleteSaleCard}
                updateSaleCard={updateSaleCard}
                saleCards={saleCards.filter((sale) => sale.columnId === col.id)}
                editMode={editMode}
                loadSale={loadSale}
                />
              ))}
              </SortableContext>
            </div>
          <button onClick={() => {createNewColumn()}}
          className="          
          h-[60px]
          w-[350px]
          min-w-[350px]
          cursor-pointer
          rounded-lg
          bg-mainBackgroundColors
          border-2
          border-columnBackgroundColor
          p-4
          ring-rose-500
          hover:ring-2
          flex
          gap-2
          "> 
          <PlusIcon/> Add Column</button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeSale && (
              <SaleCardComponent
                saleCard={activeSale}
                deleteSaleCard={deleteSaleCard}
                updateSaleCard={updateSaleCard}
                loadSale={loadSale}
              />
            )}
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                deleteSaleCard={deleteSaleCard}
                updateSaleCard={updateSaleCard}
                saleCards={saleCards.filter(
                  (sale) => sale.columnId === activeColumn.id
                )}
                editMode={editMode} 
                loadSale={loadSale}    
                />
            )}
          </DragOverlay>
          , 
        document.body
        )}
      </DndContext>
    </div>
  </div>
  )
}

export default KanbanBoard