import {databases} from "@/appwrite"

export const getTodosGroupedByColumn = async() => {
    const data = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
    )
    const todos = data.documents

    // Create a new Mapping system to return by columns (todo, inprogress, done)
    // Example
    // todo then (values to map through)
    // inprogess then (values to map through)
    // done then (values to map through)
        
    const columns = todos.reduce((acc, todo, obj) => {
        if(!acc.get(todo.status)) {
            acc.set(todo.status, {
                id: todo.status,
                todos: []
            })
        }

        acc.get(todo.status)!.todos.push({
            $id: todo.$id,
            $createdAt: todo.$createdAt,
            title: todo.title,
            status: todo.status,
            ...(todo.image && {image: JSON.parse(todo.image)})
        })

        return acc
    }, new Map<TypedColumn, Column>)

    const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"]

    // if columns dooes not have "todo", "inprogress", "done", add them with empty todos to populate a column
    for (const columnType of columnTypes) {
        if(!columns.get(columnType)) {
            columns.set(columnType, {
                id: columnType,
                todos: []
            })
        }
    }

    // sort columns by columnType to render in the following order todo, inprogress, done
    const sortedColumns = new Map(
        Array.from(columns.entries()).sort(
            (a,b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
        )
    )
                
    // set the interface Board with sortedColumns
    const board: Board = {
        columns: sortedColumns
    }
    return board
}