import { useState, useRef } from "react";
import { GripVertical } from "lucide-react";
import type { Todo } from "~/types";
import TodoList from "./TodoList";
import TodoForm from "./TodoForm";
import { useDrag } from "~/hooks/useDrag";
import { createTodo } from "~/lib/storage";
import { useTranslation } from "~/lib/i18n";
import type { Language } from "~/lib/i18n";
import { useTodos, useAddTodo } from "~/lib/queries";

type TodoContainerProps = {
  className?: string;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  showCompleted: boolean;
  language: Language;
  children?: React.ReactNode;
};

export default function TodoContainer({ 
  className = "", 
  position,
  onPositionChange,
  showCompleted,
  language,
  children 
}: TodoContainerProps) {
  const [newTodo, setNewTodo] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(language);
  const { data: todos = [] } = useTodos();
  const addTodoMutation = useAddTodo();

  const { handleMouseDown } = useDrag({
    onDrag: onPositionChange,
    initialPosition: position,
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = newTodo.trim();
    if (!trimmedText) return;
    
    const newTodoItem = createTodo(trimmedText);
    addTodoMutation.mutate(newTodoItem);
    setNewTodo("");
  };

  const visibleTodos = todos.filter(todo => !todo.completed || showCompleted);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      className={`w-full max-w-md px-4 ${className}`}
    >
      <div className="relative rounded-lg bg-white/90 p-4 shadow-lg backdrop-blur-sm dark:bg-gray-800/90">
        <div className="absolute -top-2 left-0 right-0 flex items-center justify-center">
          <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white/90 p-0.5 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/90">
            <div
              onMouseDown={handleMouseDown}
              className="cursor-grab rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              title={t("dragToMove")}
            >
              <GripVertical className="h-3 w-3 text-gray-400" />
            </div>
            {children}
          </div>
        </div>

        <div className="mt-4">
          <TodoForm
            value={newTodo}
            onChange={setNewTodo}
            onSubmit={handleAddTodo}
            language={language}
          />

          <TodoList
            todos={visibleTodos}
            language={language}
          />
        </div>
      </div>
    </div>
  );
}