import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import type { Todo } from "~/types";
import { createTodo } from "~/lib/storage";
import type { Language } from "~/lib/i18n";
import { useTranslation } from "~/lib/i18n";

type TodoPreview = {
  tempId: string;
  text: string;
  selected: boolean;
};

type MultilineTodoDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (todos: Todo[]) => void;
  initialText: string;
  language: Language;
  colors: { primary: string; text: string; background: string };
};

export default function MultilineTodoDialog({
  isOpen,
  onClose,
  onConfirm,
  initialText,
  language,
  colors,
}: MultilineTodoDialogProps) {
  const [todos, setTodos] = useState<TodoPreview[]>([]);
  const { t } = useTranslation(language);
  const isDark = colors.text === 'rgb(255, 255, 255)';

  // Update todos when initialText changes or dialog opens
  useEffect(() => {
    if (isOpen && initialText) {
      const newTodos = initialText
        .split(/\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map((text, index) => ({
          tempId: `temp-${index}`,
          text,
          selected: true, // Default to selected
        }));
      setTodos(newTodos);
    } else {
      setTodos([]);
    }
  }, [isOpen, initialText]);

  const handleConfirm = () => {
    const newTodos = todos
      .filter(todo => todo.selected && todo.text.trim())
      .map(todo => createTodo(todo.text));
    onConfirm(newTodos);
    onClose();
  };

  const handleTextChange = (tempId: string, newText: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.tempId === tempId ? { ...todo, text: newText } : todo
      )
    );
  };

  const handleToggleSelected = (tempId: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.tempId === tempId ? { ...todo, selected: !todo.selected } : todo
      )
    );
  };

  const toggleAll = () => {
    const allSelected = todos.every(todo => todo.selected);
    setTodos(prev =>
      prev.map(todo => ({ ...todo, selected: !allSelected }))
    );
  };

  const selectedCount = todos.filter(todo => todo.selected).length;
  const allSelected = todos.length > 0 && selectedCount === todos.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{t("confirmTodos")}</DialogTitle>
        </DialogHeader>
        
        {todos.length > 0 && (
          <div className="flex items-center gap-2 px-2">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="h-5 w-5 rounded border-gray-300 text-[var(--checkbox-color)] focus:ring-[var(--checkbox-color)]"
              style={{ '--checkbox-color': colors.primary } as React.CSSProperties}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedCount} / {todos.length}
            </span>
          </div>
        )}

        <div className="my-4 space-y-2">
          {todos.map(todo => (
            <div
              key={todo.tempId}
              className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <input
                type="checkbox"
                checked={todo.selected}
                onChange={() => handleToggleSelected(todo.tempId)}
                className="h-5 w-5 rounded border-gray-300 text-[var(--checkbox-color)] focus:ring-[var(--checkbox-color)]"
                style={{ '--checkbox-color': colors.primary } as React.CSSProperties}
              />
              <input
                type="text"
                value={todo.text}
                onChange={(e) => handleTextChange(todo.tempId, e.target.value)}
                style={{
                  '--input-bg-color': isDark ? 'rgba(0, 0, 0, 0.3)' : 'white',
                  '--input-hover-bg-color': isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgb(243, 244, 246)',
                  '--input-focus-bg-color': isDark ? 'rgba(0, 0, 0, 0.5)' : 'white',
                  '--input-text-color': colors.text,
                  '--input-border-color': isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  '--input-focus-border-color': isDark ? 'rgba(255, 255, 255, 0.2)' : colors.primary,
                } as React.CSSProperties}
                className={`flex-1 rounded-md border px-3 py-2 text-base transition-all duration-200
                  bg-[var(--input-bg-color)]
                  border-[var(--input-border-color)]
                  text-[var(--input-text-color)]
                  hover:bg-[var(--input-hover-bg-color)]
                  focus:bg-[var(--input-focus-bg-color)]
                  focus:border-[var(--input-focus-border-color)]
                  focus:outline-none
                  focus:ring-1
                  focus:ring-[var(--input-focus-border-color)]`}
              />
            </div>
          ))}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <button
            onClick={onClose}
            className={`rounded-md px-4 py-2 transition-colors ${
              isDark
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedCount === 0}
            className={`rounded-md px-4 py-2 text-white transition-colors ${
              isDark
                ? "bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50"
                : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50"
            }`}
          >
            {t("addTodos")} ({selectedCount})
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}