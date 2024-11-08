import { useState, useRef } from "react";
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
      <div className="relative overflow-hidden rounded-lg bg-white/90 shadow-lg backdrop-blur-sm transition-all dark:bg-gray-800/90">
        <button
          onTouchStart={handleMouseDown}
          onMouseDown={handleMouseDown}
          className="touch-manipulation mt-1.5 flex h-3 w-full cursor-grab items-center justify-center transition-colors active:cursor-grabbing"
          title={t("dragToMove")}
        >
          <div className="h-1 w-36 rounded-full bg-gray-500/50 dark:bg-gray-400/50 active:bg-gray-300/50 dark:bg-gray-700/50 dark:active:bg-gray-500/50"/>
        </button>

        <div className="flex items-center justify-end p-2">
          {children}
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="p-3">
            <TodoForm
              value={newTodo}
              onChange={setNewTodo}
              onSubmit={handleAddTodo}
              language={language}
            />
          </div>
          <div className="p-3">
            <TodoList
              todos={visibleTodos}
              language={language}
            />
          </div>
        </div>
      </div>
    </div>
  );
}