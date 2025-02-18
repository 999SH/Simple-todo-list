/* src/components/TodoItem.tsx */
import React from 'react';
import styles from './TodoItem.module.css';
import { Todo } from '../api/todos';

interface TodoItemProps {
    todo: Todo;
    onToggleComplete: (id: number, currentComplete: boolean) => void;
    onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete }) => {
    return (
        <div
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
