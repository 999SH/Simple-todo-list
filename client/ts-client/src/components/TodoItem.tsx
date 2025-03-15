/* src/components/TodoItem.tsx */
import React from 'react';
import styles from './TodoItem.module.css';
import { Todo } from '../api/todos';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"


export interface TodoItemProps {
    id: string;
    todo: Todo;
    onToggleComplete: (id: number, currentComplete: boolean) => void;
    onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
    id,
    todo,
    onToggleComplete,
    onDelete,
}) => {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 1,
        transformOrigin: "50% 50%",
        willChange: "transform",
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={styles.container}
            {...attributes}
            {...listeners}
             onClick={() => onToggleComplete(todo.id, todo.complete)}
        >
            <label className={styles.leftArea}>
                <input
                    type="checkbox"
                    checked={todo.complete}
                    readOnly
                    className={styles.checkbox}
                />
            </label>
            <span
                className={styles.content}
                style={{ textDecoration: todo.complete ? 'line-through' : 'none' }}
            >
            {todo.content}
            </span>
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Prevent toggling when clicking the delete button
                    onDelete(todo.id);
                }}
                className={styles.deleteButton}
                aria-label="Delete Todo"
            >
                X
            </button>
        </div>
    );
};

export default TodoItem;
