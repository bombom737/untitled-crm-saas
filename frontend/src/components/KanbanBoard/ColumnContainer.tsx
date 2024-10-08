import { useMemo, useState } from "react";
import { Column, Sale, SaleCard } from "C:/Users/tooto/Desktop/SVCollege/Homework/week-22/frontend/src/interfaces/interfaces"
import TrashIcon from "C:/Users/tooto/Desktop/SVCollege/Homework/week-22/frontend/src/icons/TrashIcon.tsx"
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SaleCardComponent from "./SaleCardComponent";

interface Props {
    column: Column;
    deleteColumn: (id: number) => void;
    updateColumn: (id: number, title: string) => void;
    saleCards: SaleCard[];
    deleteSaleCard: (id: number) => void;
    updateSaleCard: (id: number, content: Sale) => void;
    editMode: boolean;
    loadSaleToEdit: (sale: Sale) => void;
}


function ColumnContainer(props: Props) {
  const { column, deleteColumn, updateColumn, saleCards, deleteSaleCard, updateSaleCard, editMode, loadSaleToEdit} = props

  const [editTitle, setEditTitle] = useState(false);

  const saleCardsIds = useMemo(() => {
    return saleCards.map(sale => sale.id).filter(id => id !== undefined)
  }, [saleCards])

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = 
  useSortable({
    id: column.id as number,
    data: {
      type: 'Column',
      column
    },
    disabled: editTitle || !editMode,
  });
  
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };


    if(isDragging){
      return(
        <div
        ref={setNodeRef}
        style={style}
        className="
        bg-columnBackgroundColor
        w-[300px]
        h-[500px]
        opacity-60
        border-2
        border-rose-500
        max-h-[500px]
        rounded-md
        flex
        flex-col
      "
      >
      </div>
      )
    }

    return (
    <div 
      ref={setNodeRef}
      style={style}
      className="
      bg-columnBackgroundColor
      w-[300px]
      h-[500px]
      max-h-[500px]
      rounded-md
      flex
      flex-col
      text-white
    "
    >
      {/* {Column Title} */}
      <div 
        {...attributes}
        {...listeners}
        onClick={() => editMode ? setEditTitle(true) : null}
        className="
        bg-mainBackgroundColor
        text-md
        h-[60px]
        rounded
        rounded-b-none
        p-3
        font-bold
        flex
        items-center
        justify-between
      "
      >
        <div className="flex gap-2">
          <div className="
            flex
            justify-center
            items-center
            bg-mainBackgroundColor
            px-2
            py-1
            text-sm
            rounded-full
          ">{saleCards.length}</div>
          {!editTitle ? column.title : 
          <input 
              className="
                bg-black
                focus:border-rose-500
                border
                rounded
                outline-none
                px-2
              "
              defaultValue={column.title}
              onChange={(e) => {updateColumn(column.id!, e.target.value)}}
              autoFocus 
              onBlur={() => setEditTitle(false)} 
              onKeyDown={(e) => {
                if (e.key !== "Enter") return
                setEditTitle(false)
              }}
              placeholder="Edit Title"/>}
        </div>
        <button
      onClick={() => {
        deleteColumn(column.id!) 
      }}
      className="
        stroke-gray-500
        hover:stroke-white
        hover:bg-columnBackgroundColor
        rounded
        px1
        py-2
      ">{editMode && <TrashIcon/>}</button>
      </div>

        
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={saleCardsIds}>
          {saleCards.map(saleCard => (
            <SaleCardComponent 
              key={saleCard.id} 
              saleCard={saleCard} 
              deleteSaleCard={deleteSaleCard} 
              updateSaleCard={updateSaleCard}
              loadSaleToEdit={loadSaleToEdit}
              />
          ))}
        </SortableContext>
      </div>
      
      <div className="
        bg-black
        flex 
        gap-2 
        items-center 
        border-columnBackgroundColor 
        border-2 
        rounded-md 
        p-4 
        "> Total: {0}
        
      </div>
    </div>
  )
}

export default ColumnContainer