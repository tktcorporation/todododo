import type { FormEvent, MouseEvent } from "react";
import type { Language } from "~/lib/i18n";
import { useTranslation } from "~/lib/i18n";
import { useState } from "react";

type TodoFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  language: Language;
};

export default function TodoForm({ value, onChange, onSubmit, language }: TodoFormProps) {
  const { t } = useTranslation(language);
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseDown = (e: MouseEvent<HTMLFormElement>) => {
    e.stopPropagation();
  };

  return (
    <form 
      onSubmit={onSubmit} 
      className="flex items-center gap-2 transition-all" 
      onMouseDown={handleMouseDown}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={t("addTodoPlaceholder")}
        className={`flex-1 rounded-md px-3 py-2 text-base transition-all duration-200 ${
          isFocused
            ? "border border-blue-500 bg-white text-gray-900 placeholder-gray-400 ring-1 ring-blue-500 dark:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            : "border border-transparent bg-transparent text-gray-500 placeholder-gray-400/50 hover:bg-gray-50/50 dark:text-gray-400 dark:placeholder-gray-600 dark:hover:bg-gray-800/30"
        }`}
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className={`touch-manipulation rounded-md px-4 py-2 text-base font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
          isFocused
            ? "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-800 dark:hover:bg-blue-800"
            : "bg-gray-100/50 text-gray-400 hover:bg-gray-100 dark:bg-gray-800/50 dark:text-gray-500 dark:hover:bg-gray-800"
        } ${isFocused || value ? "opacity-100" : "opacity-0"}`}
      >
        {t("addTodo")}
      </button>
    </form>
  );
}