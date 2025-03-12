/* src/components/TodoItem.tsx */
import React from 'react';
import styles from './TodoItem.module.css';
import { Todo } from '../api/todos';
import {useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export interface TodoItemProps {
    todo: Todo;
    onToggleComplete: (id: number, currentComplete: boolean) => void;
    onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete }) => {

    const {
        attributes,
        listeners,
        setNodeRef: setDraggableNodeRef,
        transform,
    } = useDraggable({ id: todo.id.toString() });

    const { setNodeRef: setDroppableNodeRef } = useDroppable({ id: todo.id.toString() });

    const setNodeRef = (node: HTMLElement | null) => {
        setDraggableNodeRef(node);
        setDroppableNodeRef(node);
    }

    const style = {
        transform: transform ? CSS.Translate.toString(transform) : undefined,
        transition: 'transform 100ms ease',
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={styles.container}
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
