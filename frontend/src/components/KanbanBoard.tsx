import { Column, Task } from "../interfaces/interfaces";
import PlusIcon from "../icons/PlusIcon";
import { useMemo, useState } from "react";
import { generateUniqueID } from "../services/helpers";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";


function KanbanBoard() {

  const [columns, setColumns] = useState<Column[]>([]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [activeTask, setActiveTask] = useState<Task | null>(null);


  const sensors = useSensors(useSensor(PointerSensor, {
      activationConstraint:{
        distance: 3,
      }
    }
  ))
  
  const columnsId = useMemo(() => columns.map((col) => col.id).filter(id => id !== undefined), [columns])


  function createTask(columnId: number) {
    const newTask: Task = {
      id: generateUniqueID(tasks, 100000, 999999),
      columnId,
      content: `Task ${tasks.length + 1}`
    }
    setTasks([...tasks, newTask])
  }
  
  function deleteTask(id: number) {
    const newTasks = tasks.filter((task) => task.id !== id)
    setTasks(newTasks)
  }
  
  function updateTask(id: number, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task
      return { ...task, content}
    })
    setTasks(newTasks)
  }
  
  function createNewColumn() {
    const id = generateUniqueID(columns, 100000, 999999)
    const columnToAdd: Column = {
      id: id,
      title: `Column ${columns.length + 1}`
    }

    setColumns([...columns, columnToAdd])
  }

  function deleteColumn(id: number) {
    const filteredColumn = columns.filter((col) => col.id !== id)
    setColumns(filteredColumn)

    const newTasks = tasks.filter(task => task.columnId !== id)

    setTasks(newTasks)
  }
  
  function updateColumn(id: number, title: string) {
    const newColumns = columns.map(col => {
      if (col.id  !== id) return col
      return {...col, title}
    })
    setColumns(newColumns)
  }

  function onDragStart(e: DragStartEvent) {
    if(e.active.data.current?.type === "Column") {
      setActiveColumn(e.active.data.current.column)
      return;
    }
    if(e.active.data.current?.type === "Task") {
      setActiveTask(e.active.data.current.task)
      return;
    }
  }

  function OnDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over) return;
  
    const activeId = active.id;
    const overId = over.id;
  
    setActiveColumn(null);
    setActiveTask(null);
  
    if (active.data.current?.type === "Column") {
      if (activeId === overId) return;
  
      setColumns(columns => {
        const activeColumnIndex = columns.findIndex(col => col.id === activeId);
        const overColumnIndex = columns.findIndex(col => col.id === overId);
        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });
      return;
    }
  
    if (active.data.current?.type === "Task") {
      const activeTask = tasks.find(task => task.id === activeId);
  
      if (activeTask && over.data.current?.type === "Column") {
        const newColumnId = overId as number;
  
        setTasks(tasks => {
          const updatedTasks = tasks.map(task =>
            task.id === activeId ? { ...task, columnId: newColumnId } : task
          );
          
          return updatedTasks;
        });
      }
    }
  }
  
  

  function onDragOver(e: DragOverEvent) {
        const { active, over } = e;

    if (!over ) return;

    const activeId = active.id;
    const overId = over.id;
    
    if(activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks(tasks => {
        const activeTaskIndex = tasks.findIndex(task => task.id === activeId);
  
        const overTaskIndex = tasks.findIndex(task => task.id === overId);

        tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId
  
        return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      });

      const isOverColumn = over.data.current?.type === "Column"

      if (isActiveTask && isOverColumn) {
        setTasks(tasks => {
          const activeTaskIndex = tasks.findIndex(task => task.id === activeId);
    
          tasks[activeTaskIndex].columnId = overId as number
    
          return arrayMove(tasks, activeTaskIndex, activeTaskIndex);
        });
      }
    }
  };

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
              createTask={createTask} 
              deleteTask={deleteTask}
              updateTask={updateTask}
              tasks={tasks.filter((task) => task.columnId === col.id)}/>
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
          {activeColumn && (
            <ColumnContainer
            column={activeColumn}
            deleteColumn={deleteColumn}
            updateColumn={updateColumn}
            createTask={createTask}
            deleteTask={deleteTask}
            updateTask={updateTask}
            tasks={tasks.filter(
              (task) => task.columnId === activeColumn.id
            )}
            />
          )}
          {activeTask && 
          <TaskCard 
            task={activeTask} 
            deleteTask={deleteTask} 
            updateTask={updateTask}
            />}
      </DragOverlay>, 
      document.body
      )}
    </DndContext>
  </div>
  )
}

export default KanbanBoard