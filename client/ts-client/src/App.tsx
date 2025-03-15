import React, {useState} from 'react';
import TodoList from './components/TodoList';
import NewTodoForm from './components/NewTodoForm';
import Background from './components/Background';
import styles from './App.module.css';
import useTodos from './hooks/useTodos'

import {
    DndContext,
    DragEndEvent, DragOverEvent,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

import {restrictToVerticalAxis, restrictToWindowEdges} from "@dnd-kit/modifiers";
import {arrayMove} from "@dnd-kit/sortable";

const App: React.FC = () => {
  const { todos, setTodos, loading, error, addTodo, updateTodo, deleteTodo, reorderTodos } = useTodos();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensor = useSensors(
      useSensor(PointerSensor, {
          activationConstraint: { distance: 3 },
      })
  );

  const handleDragStart = (event: DragStartEvent) => {
      setActiveId(event.active.id.toString());
      document.body.classList.add('dragging');
  };

  const handleDragOver = async (event: DragOverEvent) => {
      const { active, over } = event;

      if (!over) return;

      if (activeId !== over.id) {
          const oldIndex = todos.findIndex(t => t.id.toString() === active.id.toString());
          const newIndex = todos.findIndex(t => t.id.toString() === over.id.toString());

          if (oldIndex !== -1 && newIndex !== -1) {
              const updatedTodos = arrayMove(todos, oldIndex, newIndex).map(
                  (todo, index) => ({...todo, position: index})
              );
              setTodos(updatedTodos)
          }

      }
  }

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
