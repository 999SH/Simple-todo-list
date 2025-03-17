// src/components/TodoList.tsx
import React from 'react';
import {Todo} from '../api/todos';
import TodoItem from './TodoItem';
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {useDroppable} from "@dnd-kit/core";

interface TodoListProps {
    todos: Todo[],
    onToggleComplete: (id: number, currentComplete: boolean) => void,
    onDelete: (id: number) => void,
}

const TodoList: React.FC<TodoListProps> = ({
    todos,
    onToggleComplete,
    onDelete,
}) => {

    const { setNodeRef } = useDroppable({
        id: 'todo-list-droppable'
    })

    if (todos.length === 0) {
        return <p>No todos available.</p>;
    }

    const todoIds = todos.map(todo => todo.id.toString());

    return (
        <div ref={setNodeRef} >
            <SortableContext items={todoIds} strategy={verticalListSortingStrategy}>
                {todos.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            id={todo.id.toString()}
                            todo={todo}
                            onToggleComplete={onToggleComplete}
                            onDelete={onDelete}
                        />
                ))}
            </SortableContext>
        </div>
    );
};

export default TodoList;

