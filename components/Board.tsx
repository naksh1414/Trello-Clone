"use client"
import {useEffect} from "react"
import {DragDropContext, Droppable, DropResult} from "react-beautiful-dnd"
import {useBoardStore} from "@/store/BoardStore"
import Column from "./Column"

function Board() {

    const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore((state) => [
            state.board,
            state.getBoard,
            state.setBoardState,
            state.updateTodoInDB
        ])
    
    useEffect(() => {
                getBoard()        
    }, [getBoard])

    const handleOnDragEnd = (result: DropResult ) => {
        const {destination, source, type} = result

        // Check if user drags a card outside the board
        if(!destination) return

        // Handle column drag
        if(type === "column") {
            const entries = Array.from(board.columns.entries())
            const [removed] = entries.splice(source.index, 1)
            entries.splice(destination.index, 0, removed)
            const rearrangedColumns = new Map(entries)
            setBoardState({
                ...board, 
                columns: rearrangedColumns
            })
        }

        // Required Step: indexes are stored as numbers, 0,1,2,etc. instead of ID's in DND library
        const columns = Array.from(board.columns)
        const startColIndex = columns[Number(source.droppableId)]
        const finishColIndex = columns[Number(destination.droppableId)]
        const startCol: Column = {
            id: startColIndex[0],
            todos: startColIndex[1].todos
        }

        const finishCol: Column = {
            id: finishColIndex[0],
            todos: finishColIndex[1].todos
        }

        // If a drag happens, but no change is made then do nothing
        if(!startCol || !finishCol) return

        // Pulling an array of todos
        const newTodos = startCol.todos;
        // Grabbing the selected to do to be dragged
        const [movedTodo] = newTodos.splice(source.index, 1)

        if(startCol.id === finishCol.id) {
            // Same column task drag.
            // (Getting the set location, making no deletions, Popping in the moved todo to the new location in the array)
            newTodos.splice(destination.index, 0, movedTodo)

            // Updating the New Todo Organized Array
            const newCol = {
                id: startCol.id,
                todos: newTodos,
            }
            const newCols = new Map(board.columns)
            newCols.set(startCol.id, newCol)
            setBoardState({...board, columns: newCols})

        } else {

            const finishTodos = Array.from(finishCol.todos)
            finishTodos.splice(1, 0, movedTodo)
            

            const newColumns = new Map(board.columns);
            const newCol = {
                id: startCol.id,
                todos: newTodos
            }

            // Save updated changes to the dragged-from column
            newColumns.set(startCol.id, newCol)
            // Save updated changed to the dragged-into column
            newColumns.set(finishCol.id, {
                id: finishCol.id,
                todos: finishTodos
            })

            updateTodoInDB(movedTodo, finishCol.id)
            setBoardState({...board, columns: newColumns})
        }
    }
    return(
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable 
                droppableId="board"
                direction="horizontal"
                type="column"
            >
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
                    >
                        
                            {/* Creating an array of [todo, inprogress, done, and mapping through this] */}
                            {Array.from(board.columns.entries()).map(([id, column], index) => (
                                <Column
                                    key={id}
                                    id={id}
                                    todos={column.todos}
                                    index={index}                                    
                                />
                            ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}

export default Board