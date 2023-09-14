'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from 'react-beautiful-dnd';
import { XCircleIcon } from '@heroicons/react/24/solid';

import { Todo, TypeColum } from '@/tyoing';
import getUrl from '@/lib/getUrl';
import { useBoardStore } from '@/store/BordStore';

type Props = {
    todo: Todo;
    index: number;
    id: TypeColum
    innerRef: (element: HTMLElement | null) => void;
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
    draggableProps: DraggableProvidedDraggableProps;
}

function TodoCard({
    todo,
    index,
    id,
    innerRef,
    dragHandleProps,
    draggableProps,
}: Props) {
    const deleteTask = useBoardStore((state) => state.deleteTask)
    const [ImageUrl, setImageUrl] = useState<string | null>(null)

    useEffect(() => {
        if (todo.image) {
            const fetchImage = async () => {
                const url = await getUrl(todo.image!)
                if (url) {
                    setImageUrl(url.toString())
                }
            }
            fetchImage()
        }
    }, [todo])
    

  return (
    <div
        {...draggableProps}
        {...dragHandleProps}
        ref={innerRef}
        className='bg-white rounded-md space-y-2 drop-shadow-md'
    >
        <div className="flex justify-between items-center p-5">
            <p className='flex justify-between items-center'>{todo.title}</p>
            <button className='text-red-500 hover:text-red-600' onClick={() => deleteTask(index, todo, id)}>
                <XCircleIcon className="ml-5 h-8 w-8 "/>
            </button>
        </div>

        {ImageUrl && (
            <div className="relative h-full w-full rounded-b-md">
                <Image
                    src={ImageUrl}
                    alt="task image"
                    width={400}
                    height={200}
                    className=" w-full object-contain rounded-b-md"
                />
            </div>             
        )}
    </div>
  )
}

export default TodoCard
