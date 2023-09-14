import { databases } from "@/appwrith"
import { Board, Column, TypeColum } from "@/tyoing"

export const getTodosGroupedbyColumn = async () => {
    
    const data = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
    )
    
    const todos = data.documents

    const columns = todos.reduce((acc: any, todo) => {
        
        if (!acc.get(todo.status)) {
        
            acc.set(todo.status, {
                id: todo.status,
                todos:[],
            })        
        }
        acc.get(todo.status)!.todos.push({
            $id: todo.$id,
            $createdAt: todo.$createdAt,
            title: todo.title,
            status: todo.status,
            ...(todo.image && {image: JSON.parse(todo.image)})
        })
    
        return  acc;
    }, new Map<TypeColum, Column>)
    
    const columnsTypes: TypeColum[] = ['todo', 'inprogress', 'done']
    for (const columnsType of columnsTypes) {
        if (!columns.get(columnsType)) {
            columns.set(columnsType, {
                id: columnsType,
                todos: [],
            })
        }
    }

    const sortedColumns: Map<TypeColum, Column> = new Map(
        Array.from(columns.entries()).sort((a: any, b: any) => columnsTypes.indexOf(a[0]) - columnsTypes.indexOf(b[0]))
    )

    const board: Board = {
        columns: sortedColumns
    }

    return board
}
