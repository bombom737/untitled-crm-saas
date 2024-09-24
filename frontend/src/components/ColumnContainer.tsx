import { useMemo, useState } from "react";
import { Column, Task } from "../interfaces/interfaces"
import TrashIcon from "../icons/TrashIcon"
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";

interface Props {
    column: Column;
    deleteColumn: (id: number) => void;
    updateColumn: (id: number, title: string) => void;
    createTask: (columnId: number) => void;
    tasks: Task[];
    deleteTask: (id: number) => void;
    updateTask: (id: number, content: string) => void;
}


function ColumnContainer(props: Props) {
  const { column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask } = props

  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map(task => task.id).filter(id => id !== undefined)
  }, [tasks])

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = 
  useSortable({
    id: column.id as number,
    data: {
      type: 'Column',
      column
    },
    disabled: editMode,
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
        w-[350px]
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
      w-[350px]
      h-[500px]
      max-h-[500px]
      rounded-md
      flex
      flex-col
    "
    >
      {/* {Column Title} */}
      <div 
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="
        bg-mainBackgroundColor
        text-md
        h-[60px]
        cursor-grab
        rounded-md
        rounded-b-none
        p-3
        font-bold
        border-4
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
          ">0</div>
          {!editMode ? column.title : 
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
              onBlur={() => setEditMode(false)} 
              onKeyDown={(e) => {
                if (e.key !== "Enter") return
                setEditMode(false)
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
      "><TrashIcon/></button>
      </div>

        
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask}/>
          ))}
        </SortableContext>
      </div>
      <button className="
        flex 
        gap-2 
        items-center 
        border-columnBackgroundColor 
        border-2 
        rounded-md 
        p-4 
        hover:bg-mainBackgroundColor 
        hover:text-rose-500
        active:bg-black
      "
      onClick={() => {
        createTask(column.id!)
      }}
      ><PlusIcon/>Add task</button> 
    </div>
  )
}

export default ColumnContainer