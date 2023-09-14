import { create } from 'zustand'

import { ID, databases, storage } from '@/appwrith';

import { Column, TypeColum, Board, Todo, Image } from "@/tyoing"

import { getTodosGroupedbyColumn } from '@/lib/getTOdosGroupedByColumn';
import uploadImge from '@/lib/uploadImge';

interface BoardState {
    board: Board;
    getBoard: () => void
    
    setBoardState: (board: Board) => void
    updateTodoInDB: (todo: Todo, columnId: TypeColum) => void
    deleteTask: (taskIndex: number, todo: Todo, id: TypeColum) => Promise<void>
    
    serchString: string
    setSerchString: (serchString: string) => void
    
    newTaskInput: string
    setNewTaskInput: (input: string) => void
    
    newTaskType: TypeColum
    setNewTaskType: (columnId: TypeColum)=> void

    image: File | null
    setImage: (image: File | null) => void

    addTask: (todo:string, columnId: TypeColum, Image?:File|null) => void
}

export const useBoardStore = create<BoardState>((set, get) => ({
    board: {
        columns: new Map<TypeColum, Column>(),
    },
    getBoard: async () => {
        const board = await getTodosGroupedbyColumn();
        set({ board })
    },
    setBoardState: (board => set({ board })),
    updateTodoInDB: async (todo, columnId) => {
        await databases.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id,
            {
                title: todo.title,
                status: columnId,
            }
        )
    },
    serchString: '',
    setSerchString: (serchString) => set({ serchString }),
    
    deleteTask: async (taskIndex: number, todo: Todo, id: TypeColum) => {

        const newColumns = new Map(get().board.columns);
        
        newColumns.get(id)?.todos.splice(taskIndex, 1);
        
        set({ board: { columns: newColumns } });
        
        if (todo.image) {
            await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
        }

        await databases.deleteDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id
        );
    },
    
    newTaskInput: "",
    setNewTaskInput: (input: string) => set({ newTaskInput: input }),
    
    newTaskType: "todo",
    setNewTaskType: (columnId: TypeColum) => set({ newTaskType: columnId }),
    
    image: null,
    setImage: (image: File | null) => set({ image }),
    
    addTask: async (todo: string, columnId: TypeColum, image?: File | null) => {
        let file: Image | undefined 
        if (image) {
            const fileUploaded = await uploadImge(image)
            if (fileUploaded) {
                file = {
                    bucketId: fileUploaded.bucketId,
                    fileId: fileUploaded.$id,
                }
            }
        }
        const { $id } = await databases.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            ID.unique(),
            {
                title: todo,
                status: columnId,
                ...(file && { image: JSON.stringify(file)})
            }
        )
        set({ newTaskInput: "" })
        set((state) => {
            const newColumns = new Map(state.board.columns)
            const newTodo: Todo = {
                $id,
                $createdAt: new Date().toISOString(),
                title: todo,
                status: columnId,
                ...(file && {image: file})
            }
            const column = newColumns.get(columnId)

            if (!column) {
                newColumns.set(columnId, {
                    id: columnId,
                    todos: [newTodo],
                })
            } else {
                newColumns.get(columnId)?.todos.push(newTodo)
            }
            return {
                board: {
                    columns: newColumns,
                }
            }
        })
    }
}))