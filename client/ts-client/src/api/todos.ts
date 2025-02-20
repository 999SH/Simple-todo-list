// src/api/todos.ts
export interface Todo {
    id: number;
    content: string;
    complete: boolean;
    created_at: string;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

export async function fetchTodos(): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/todos`);
    if (!response.ok) {
        throw new Error(`Failed to fetch todos: ${response.statusText}`);
    }
    return response.json();
}

export async function addTodo(content: string): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
    });
    if (!response.ok) {
        throw new Error(`Failed to add todo: ${response.statusText}`);
    }
    return response.json();
}

export async function updateTodo(todo: Partial<Todo> & { id: number }): Promise<Todo> {
    const { id, ...updateData } = todo;

    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
    });
    if (!response.ok) {
        throw new Error(`Failed to update todo: ${response.statusText}`);
    }
    return response.json();
}

export async function deleteTodo(id: number): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Failed to delete todo: ${response.statusText}`);
    }
    return response.json();
}
