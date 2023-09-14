'use client'
import React, { useEffect } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

import { Column as Columna } from '../tyoing'
import { useBoardStore } from '@/store/BordStore'

import Column from './Column'

function Bord() {
  const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore((state) => [
    state.board,
    state.getBoard,
    state.setBoardState,
    state.updateTodoInDB,
  ])

  useEffect(() => {
    getBoard()
  }, [getBoard])

  const handleOnDragEnd = (result: any) => {
    const { destination, source, type } = result;
    if(!destination) return
    
    if (type === 'column') {
      const entries = Array.from(board.columns.entries())
      const [removed] = entries.splice(source.index, 1)
      entries.splice(destination.index, 0, removed)
      const rearrangedColumns = new Map(entries)
      setBoardState({
        ...board,
        columns: rearrangedColumns
      })
    }
    const columns = Array.from(board.columns)
    const startColIndex = columns[Number(source.droppableId)]
    const finishColIndex = columns[Number(destination.droppableId)]
    
    const startCol: Columna = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    }
    const finishCol: Columna = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    }

    if(!finishCol || !startCol) return

    if (source.index === destination.index && startCol === finishCol) return
    
    const newTodos = startCol.todos
    const [todoMoved] = newTodos.splice(source.index, 1)

    if (startCol.id === finishCol.id) {
      newTodos.splice(destination.index, 0, todoMoved)
      const newCol: Columna = {
        id: startCol.id,
        todos: newTodos,
      }
      const newColums = new Map(board.columns)
      newColums.set(startCol.id, newCol)

      setBoardState({
        ...board, columns: newColums
      })
    } else {
      const finishTodos = Array.from(finishCol.todos)
      finishTodos.splice(destination.index, 0, todoMoved)
       
      const newColums = new Map(board.columns)
      const newCol: Columna = {
        id: startCol.id,
        todos: newTodos,
      }

      newColums.set(startCol.id, newCol)
      newColums.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      })
      
      updateTodoInDB(todoMoved, finishCol.id)

      setBoardState({
        ...board, columns: newColums
      })
    }
  }
  
  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId='board' direction="horizontal" type="column">
          {(provided) =>
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >{
              Array.from(board.columns.entries()).map(([id, column], index) => (
                <Column
                  key={id}
                  id = {id}
                  todos = { column.todos }
                  index = {index}
                />
              ))
            }</div>
          }
        </Droppable>
      </DragDropContext>
    </>
  )
}
export default Bord
