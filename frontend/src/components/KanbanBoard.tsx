import { Column } from "../interfaces/interfaces";
import PlusIcon from "../icons/PlusIcon";
import { useMemo, useState } from "react";
import { generateUniqueID } from "../services/helpers";
import ColumnContainer from "./ColumnContainer";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";


function KanbanBoard() {

  const [columns, setColumns] = useState<Column[]>([])
  const columnsId = useMemo(() => columns.map((col) => col.id).filter(id => id !== undefined), [columns])
  
  function createNewColumn(){
    const id = generateUniqueID(columns, 100000, 999999)
    const columnToAdd: Column = {
      id: id,
      title: `Column ${columns.length + 1}`
    }

    setColumns([...columns, columnToAdd])
  }

  function deleteColumn(id: number){
    const filteredColumn = columns.filter((col) => col.id !== id)
    setColumns(filteredColumn)
  }

  return (
    <div className="
    m-auto
    flex 
    min-h-screen
    w-full
    items-center
    overflow-x-auto
    overflow-y-hidden
    px-[40px]
    ">
      <DndContext>
        <div className="m-auto flex gap-4">
          <div className="flex gap-2">
            <SortableContext items={columnsId}>
            {columns.map((col, idx) => (
              <ColumnContainer column={col} key={idx} deleteColumn={deleteColumn}/>
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
    </DndContext>
  </div>
  )
}

export default KanbanBoard