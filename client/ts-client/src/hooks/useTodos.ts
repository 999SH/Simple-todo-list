import { useState, useEffect } from 'react';
import {
    fetchTodos,
    addTodo as addTodoAPI,
    updateTodo as updateTodoAPI,
    deleteTodo as deleteTodoAPI,
    updateAllTodos
} from "../api/todos";

export interface Todo {
    id: number;
    content: string;
    complete: boolean;
    created_at: string;
    position: number;
}

const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState<Boolean>(false);
    const [error, setError] = useState<String>('');

    const loadTodos = async () => {

        setLoading(true);

        const data = await fetchTodos();

        data.sort((a: Todo, b: Todo) => a.position - b.position);

        try {
            setTodos(data)
        } catch(error: any) {
            setError(error)
        } finally {
            setLoading(false);
        }

    }

    const addTodo = async (content: string) => {

        try {
            const newTodo = await addTodoAPI(content);
            setTodos(prev => [...prev, newTodo]);
        } catch (error: any) {
            setError(error)
        }
    }

    const updateTodo = async (id: number, currentComplete: boolean) => {

        try {
            const updatedTodo = await updateTodoAPI({id, complete: !currentComplete})
            setTodos(prev => prev.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo))
        } catch (error: any) {
            setError(error)
        }
    }

    const deleteTodo = async (id: number) => {

        try {
            await deleteTodoAPI(id);
            setTodos(prev => prev.filter(todo => todo.id !== id))
        } catch (error: any) {
            setError(error)
        }
    }

    const arrayMove = (arr: Todo[], from: number, to: number): Todo[] => {
        const newArray = [...arr];
        const [movedItem] = newArray.splice(from, 1);
        newArray.splice(to, 0, movedItem);

        return newArray;
    }

    const reorderTodos = async (fromIndex: number, toIndex: number) => {
        const updatedTodos = arrayMove(todos, fromIndex, toIndex).map(
            (todo, index) => ({...todo, position: index})
        );

        setTodos(updatedTodos);

        try {
            await updateAllTodos(updatedTodos);
        } catch (error: any) {
            setError(error)
        }
    };

    useEffect(() => {
        loadTodos();
    }, []);

    return {
        todos,
        setTodos,
        loading,
        error,
        loadTodos,
        addTodo,
        updateTodo,
        deleteTodo,
        reorderTodos,
    }
}

export default useTodos;