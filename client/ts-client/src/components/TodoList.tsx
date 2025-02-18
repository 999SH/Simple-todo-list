// src/components/TodoList.tsx
import React from 'react';
import { Todo } from '../api/todos';
import TodoItem from './TodoItem';

interface TodoListProps {
    todos: Todo[];
    onToggleComplete: (id: number, currentComplete: boolean) => void;
    onDelete: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggleComplete, onDelete }) => {
    if (todos.length === 0) {
        return <p>No todos available.</p>;
    }

    return (
        <div>
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggleComplete={onToggleComplete}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default TodoList;

