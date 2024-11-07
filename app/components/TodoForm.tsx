import type { FormEvent, MouseEvent } from "react";
import type { Language } from "~/lib/i18n";
import { useTranslation } from "~/lib/i18n";

type TodoFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  language: Language;
};

export default function TodoForm({ value, onChange, onSubmit, language }: TodoFormProps) {
  const { t } = useTranslation(language);

  const handleMouseDown = (e: MouseEvent<HTMLFormElement>) => {
    e.stopPropagation();
  };

  return (
    <form onSubmit={onSubmit} className="mb-4 flex gap-2" onMouseDown={handleMouseDown}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("addTodoPlaceholder")}
        className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t("addTodo")}
      </button>
    </form>
  );
}