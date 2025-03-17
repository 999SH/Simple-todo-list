import React from 'react';
import TodoList from './components/TodoList';
import NewTodoForm from './components/NewTodoForm';
import Background from './components/Background';
import styles from './App.module.css';
import useTodos from './hooks/useTodos';
import useDND from './hooks/useDND';
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers";

const App: React.FC = () => {
  const { todos, loading, error, addTodo, updateTodo, deleteTodo } = useTodos();
  const { sensor, handleDragStart, handleDragOver, handleDragEnd, handleDragCancel } = useDND();

  return (
      <Background>
        <div className={styles.container}>
          <h1 className={styles.title}>Todo List</h1>
          {error && <div className={styles.error}>Error: {error}</div>}
          {loading ? (
              <p className={styles.loading}>Loading todos...</p>
          ) : (
              <DndContext
                sensors={sensor}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
                modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
              >
                <TodoList
                    todos={todos}
                    onToggleComplete={updateTodo}
                    onDelete={deleteTodo}
                />
              </DndContext>
          )}
          <NewTodoForm onAddTodo={addTodo} />
        </div>
      </Background>
  );
};

export default App;
