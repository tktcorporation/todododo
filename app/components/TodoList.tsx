import { useState, useRef, useEffect } from "react";
import type { Todo } from "~/types";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { useToggleTodo, useDeleteTodo, useEditTodo } from "~/lib/queries";
import { useTranslation } from "~/lib/i18n";
import type { Language } from "~/lib/i18n";

type TodoListProps = {
  todos: Todo[];
  language: Language;
};

export default function TodoList({ todos, language }: TodoListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation(language);

  const toggleTodoMutation = useToggleTodo();
  const deleteTodoMutation = useDeleteTodo();
  const editTodoMutation = useEditTodo();

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const handleDoubleClick = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleEditSubmit = (id: string) => {
    if (editText.trim()) {
      editTodoMutation.mutate({ id, text: editText.trim() });
    }
    setEditingId(null);
  };

  if (todos.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">
        {t("noTasks")}
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <ContextMenu key={todo.id}>
          <ContextMenuTrigger>
            <li 
              className={`group flex items-center justify-between rounded-md border border-gray-200 p-3 dark:border-gray-700 transition-all duration-1000 ${
                todo.completed ? 'bg-gray-50 dark:bg-gray-800/50' : ''
              }`}
            >
              <div className="flex flex-1 items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodoMutation.mutate(todo.id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                {editingId === todo.id ? (
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => handleEditSubmit(todo.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleEditSubmit(todo.id);
                      } else if (e.key === "Escape") {
                        setEditingId(null);
                      }
                    }}
                    className="flex-1 rounded border-gray-300 px-2 py-1 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <span
                    onDoubleClick={() => handleDoubleClick(todo)}
                    className={`flex-1 cursor-text select-none text-gray-900 dark:text-gray-100 ${
                      todo.completed ? "line-through opacity-50" : ""
                    }`}
                  >
                    {todo.text}
                  </span>
                )}
              </div>
            </li>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
              onSelect={() => deleteTodoMutation.mutate(todo.id)}
            >
              {t("delete")}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </ul>
  );
}