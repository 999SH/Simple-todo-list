import {useState} from "react";
import {arrayMove} from "@dnd-kit/sortable";
import {DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import useTodos from "./useTodos";

const useDND = () => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const { todos, setTodos, reorderTodos } = useTodos();

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

    return {
        sensor,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleDragCancel,
    }
}

export default useDND;
