/* src/components/NewTodoForm.tsx */
import React, { useState, FormEvent } from 'react';
import styles from './NewTodoForm.module.css'

interface NewTodoFormProps {
    onAddTodo: (content: string) => void;
}

const NewTodoForm: React.FC<NewTodoFormProps> = ({ onAddTodo }) => {
    const [content, setContent] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const MAX_LENGTH = 50;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (content.trim()) {
            onAddTodo(content);
            setContent('');
            setIsAdding(false);
        }
    };

    return (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
            {isAdding ? (
                <form onSubmit={handleSubmit} style={{ display: 'inline-block' }}>
                    <input
                        type="text"
                        placeholder="New todo..."
                        value={content}
                        maxLength={MAX_LENGTH}
                        onChange={(e) => setContent(e.target.value)}
                        autoFocus
                        className={styles.input}
                    />
                    <button
                        type="submit"
                        className={styles.button}
                    >
                        Add
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsAdding(false)}
                        className={styles.button}
                    >
                        Cancel
                    </button>
                </form>
            ) : (
                <button
                    onClick={() => setIsAdding(true)}
                    className={styles.plusButton}
                    aria-label="Add new todo"
                >
                    +
                </button>
            )}
        </div>
    );
};

export default NewTodoForm;
