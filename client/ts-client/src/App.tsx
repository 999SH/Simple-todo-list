import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import NewTodoForm from './components/NewTodoForm';
import Background from './components/Background';
import { Todo, fetchTodos, addTodo, updateTodo, deleteTodo } from './api/todos';
import styles from './App.module.css';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await fetchTodos();
      // Sort todos by created_at in ascending order (older first)
      data.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      setTodos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAddTodo = async (content: string) => {
    try {
      const newTodo = await addTodo(content);
      setTodos((prev) => [...prev, newTodo]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleComplete = async (id: number, currentComplete: boolean) => {
    try {
      const updatedTodo = await updateTodo({ id, complete: !currentComplete });
      setTodos((prev) => prev.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
      <Background>
        <div className={styles.container}>
          <h1 className={styles.title}>Todo List</h1>
          {error && <div className={styles.error}>Error: {error}</div>}
          {loading ? (
              <p className={styles.loading}>Loading todos...</p>
          ) : (
              <TodoList
                  todos={todos}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDelete}
              />
          )}
          <NewTodoForm onAddTodo={handleAddTodo} />
        </div>
      </Background>
  );
};

export default App;
