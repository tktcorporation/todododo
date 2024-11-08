import type { FormEvent, MouseEvent } from "react";
import type { Language } from "~/lib/i18n";
import { useTranslation } from "~/lib/i18n";
import { useState } from "react";

type TodoFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  language: Language;
  colors: { primary: string; text: string; background: string };
};

export default function TodoForm({ value, onChange, onSubmit, language, colors }: TodoFormProps) {
  const { t } = useTranslation(language);
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseDown = (e: MouseEvent<HTMLFormElement>) => {
    e.stopPropagation();
  };

  const isDark = colors.text === 'rgb(255, 255, 255)';

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
        style={{
          '--input-focus-color': colors.primary,
          '--input-text-color': colors.text,
          '--input-bg-color': isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          '--input-hover-bg-color': isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
          '--input-focus-bg-color': isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.9)',
          '--input-placeholder-color': isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
        } as React.CSSProperties}
        className={`flex-1 rounded-md px-3 py-2 text-base transition-all duration-200 ${
          isFocused
            ? "border border-[var(--input-focus-color)] bg-[var(--input-focus-bg-color)] text-[var(--input-text-color)] placeholder-[var(--input-placeholder-color)] ring-1 ring-[var(--input-focus-color)]"
            : "border border-transparent bg-[var(--input-bg-color)] text-[var(--input-text-color)] placeholder-[var(--input-placeholder-color)] hover:bg-[var(--input-hover-bg-color)]"
        }`}
      />
      <button
        type="submit"
        disabled={!value.trim()}
        style={{
          '--button-bg': isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          '--button-hover-bg': isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
          '--button-focus-bg': colors.primary,
          '--button-text': colors.text,
        } as React.CSSProperties}
        className={`touch-manipulation rounded-md px-4 py-2 text-base font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
          isFocused
            ? "bg-[var(--button-focus-bg)] text-[var(--button-text)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--button-focus-bg)] focus:ring-offset-2 active:opacity-100"
            : "bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover-bg)]"
        } ${isFocused || value ? "opacity-100" : "opacity-0"}`}
      >
        {t("addTodo")}
      </button>
    </form>
  );
}