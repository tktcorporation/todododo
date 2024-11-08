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
  colors: { primary: string; text: string; background: string };
};

export default function TodoList({ todos, language, colors }: TodoListProps) {
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
    return null;
  }

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <ContextMenu key={todo.id}>
          <ContextMenuTrigger>
            <li 
              className={`group flex items-center justify-between rounded-md p-2 transition-colors hover:bg-black/5 ${
                todo.completed ? 'opacity-50' : ''
              }`}
              style={{ color: colors.text }}
            >
              <div className="flex flex-1 items-center gap-3">
                <div className="touch-manipulation">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodoMutation.mutate(todo.id)}
                    className="h-5 w-5 rounded border-gray-300 text-[var(--checkbox-color)] focus:ring-[var(--checkbox-color)]"
                    style={{ '--checkbox-color': colors.primary } as React.CSSProperties}
                  />
                </div>
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
                    className="flex-1 rounded border-[var(--input-border)] bg-white/90 px-3 py-2 text-base focus:border-[var(--input-focus)] focus:ring-[var(--input-focus)]"
                    style={{ 
                      '--input-border': colors.text + '30',
                      '--input-focus': colors.primary,
                    } as React.CSSProperties}
                  />
                ) : (
                  <span
                    onDoubleClick={() => handleDoubleClick(todo)}
                    className={`flex-1 cursor-text select-none text-base ${
                      todo.completed ? "line-through" : ""
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
              className="text-base text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
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