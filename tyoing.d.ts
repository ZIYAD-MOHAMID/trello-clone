import Module from "module";

interface Board {
    columns: Map<TypeColum, Column>;
}
type TypeColum = 'todo' | "inprogress" | 'done';
interface Column {
    id: TypeColum;
    todos: Todo[];
}
interface Todo extends Module.Document {
    $id: string;
    $createdAt: string;
    title: string;
    status: TypeColum;
    image?: Image;
}
interface Image {
    bucketId: string;
    fileId: string;
}