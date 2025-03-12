import React, {useState, useEffect, useRef} from 'react';
import TodoList from './components/TodoList';
import NewTodoForm from './components/NewTodoForm';
import Background from './components/Background';
import {Todo, fetchTodos, addTodo, updateTodo, deleteTodo, updateAllTodos} from './api/todos';
import styles from './App.module.css';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [updated, setUpdated] = useState<boolean>(true);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await fetchTodos();
      // Sort todos by created_at in ascending order (older first)
      data.sort((a, b) => a.position - b.position);
      setTodos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sortTodos = () => {
    let todoArray = [...todos];

    console.log("Sortinggggg")

    todoArray.sort((a,b) => a.position - b.position);
    setTodos(todoArray)
    setUpdated(true);
  }

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    sortTodos()
  }, [!updated]);

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
      setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo));
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

  const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 10,
        },
      })
  );

  const lastHoverIndex = useRef<Number | null>(null);

  const handleDragOver = async (event: DragOverEvent) => {

    const { active, over } = event;

    console.log("Handling drag over");

    if (over && active.id !== over.id) {
      const startingIndex = todos.findIndex(todo => todo.id.toString() === active.id);
      let currentIndex = todos.findIndex(todo => todo.id.toString() === over.id);

      if (lastHoverIndex.current === currentIndex) {
        return;
      }

      lastHoverIndex.current = currentIndex;

      let updatedTodos = [...todos];
      let currentItem = updatedTodos[currentIndex];

      if (currentIndex > startingIndex) {
          currentItem.position--;
      } else if (currentIndex < startingIndex) {
          currentItem.position++;
      }

      setTodos(updatedTodos)

      console.log(todos)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {

    console.log("Handling drag end");

    setUpdated(false);

    const { active, over } = event;

    if (over && active.id !== over.id) {
      try {
        await updateAllTodos(todos);
      } catch (err: any) {
        setError(err.message);
      }
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
              <DndContext sensors={sensors} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                <TodoList
                    todos={todos}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDelete}
                />
              </DndContext>
          )}
          <NewTodoForm onAddTodo={handleAddTodo} />
        </div>
      </Background>
  );
};

export default App;
