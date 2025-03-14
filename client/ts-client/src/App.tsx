import React, {useState, useEffect, useRef} from 'react';
import TodoList from './components/TodoList';
import NewTodoForm from './components/NewTodoForm';
import Background from './components/Background';
import styles from './App.module.css';
import useTodos, { Todo } from './hooks/useTodos'

import {
    closestCenter,
    DndContext, DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors,
} from "@dnd-kit/core";

import {restrictToVerticalAxis, restrictToWindowEdges} from "@dnd-kit/modifiers";

const App: React.FC = () => {
  const { todos, loading, error, addTodo, updateTodo, deleteTodo, reorderTodos } = useTodos();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensor = useSensors(
      useSensor(PointerSensor, {
          activationConstraint: { distance: 10 },
      })
  );

  const handleDragStart = (event: DragStartEvent) => {
      setActiveId(event.active.id.toString());
      document.body.classList.add('dragging');
  };

  const handleDragEnd = async (event: DragEndEvent) => {
      document.body.classList.remove('dragging');

      const { active, over } = event;

      setActiveId(null);

      if (!over) return;

      if (activeId !== over.id) {
          const oldIndex = todos.findIndex(t => t.id.toString() === active.id.toString());
          const newIndex = todos.findIndex(t => t.id.toString() === over.id.toString());

          if (oldIndex !== -1 && newIndex !== -1) {
              await reorderTodos(oldIndex, newIndex);
          }
      }
  }

  const handleDragCancel = () => {
      setActiveId(null);
      document.body.classList.remove('dragging');
  }

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
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
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
