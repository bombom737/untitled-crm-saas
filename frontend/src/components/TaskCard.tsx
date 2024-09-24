import { useState, useRef } from "react";
import TrashIcon from "../icons/TrashIcon";
import { Task } from "../interfaces/interfaces"
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
    task: Task;
    deleteTask: (id: number) => void;
    updateTask: (id: number, content: string) => void;
}
function TaskCard({ task, deleteTask, updateTask }: Props) {

  const [isMouseOver, setIsMouseOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = 
  useSortable({
    id: task.id as number,
    data: {
      type: 'Task',
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null); 
  const toggleEditMode = () => {
    setEditMode((prev) => !prev)
    setIsMouseOver(false)
  }

  if (isDragging) {
    return (
      <div
      ref={setNodeRef}
      style={style}
      className="
          bg-mainBackgroundColor
          p-2.5
          h-[100px]
          min-h-[100px]
          items-center
          flex
          text-left
          rounded-xl
          border-2
          border-rose-500
          cursor-grab
          relative
          task
          opacity-30
      " 
      />
    )
  }

  if(editMode) {
    return (
      <div 
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="
          bg-mainBackgroundColor
          p-2.5
          h-[100px]
          min-h-[100px]
          items-center
          flex
          text-left
          rounded-xl
          hover:ring-2
          hover:ring-inset
          hover:ring-rose-500
          cursor-grab
          relative
          task
      ">
        <textarea 
          ref={textAreaRef}
          defaultValue={task.content}
          autoFocus
          placeholder="Enter task content"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey && editMode){
              toggleEditMode()
              updateTask(task.id!, textAreaRef.current?.value!)
            }
          }}
          className="
            h-[90%]
            w-full
            resize-none
            border-none
            rounded
            bg-transparent
            text-white
            focus:outline-none
          ">

        </textarea>
      </div>
    )
  }

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
      className="
        bg-mainBackgroundColor
        p-2.5
        h-[100px]
        min-h-[100px]
        items-center
        flex
        text-left
        rounded-xl
        hover:ring-2
        hover:ring-inset
        hover:ring-rose-500
        cursor-grab
        relative
    "><p className="
      my-auto
      h-[90%]
      w-full
      overflow-x-hidden
      overflow-y-auto
      whitespace-pre-wrap
    ">{task.content}</p>
      {isMouseOver && <button 
        onClick={() => deleteTask(task.id!)}
        className="
        stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100
      "><TrashIcon/></button>}
    </div>
  )
}

export default TaskCard