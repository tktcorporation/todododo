import { useCallback } from "react";

export type Language = "en" | "ja";

export const DEFAULT_LANGUAGE: Language = "en";

export const translations = {
  en: {
    addTodo: "Add",
    addTodoPlaceholder: "Enter a new task...",
    noTasks: "No tasks. Add a new task to get started.",
    delete: "Delete",
    settings: "Settings",
    showCompletedTasks: "Show completed tasks",
    backgroundImage: "Background Image",
    uploadBackground: "Click or drag & drop to upload background image",
    pasteFromClipboard: "Paste image from clipboard (Ctrl+V)",
    uploadError: "Only image files can be uploaded.",
    clipboardError: "Failed to read from clipboard:",
  },
  ja: {
    addTodo: "追加",
    addTodoPlaceholder: "新しいタスクを入力...",
    noTasks: "タスクがありません。新しいタスクを追加してください。",
    delete: "削除",
    settings: "設定",
    showCompletedTasks: "完了したタスクを表示",
    backgroundImage: "背景画像",
    uploadBackground: "クリックまたはドラッグ＆ドロップで背景画像をアップロード",
    pasteFromClipboard: "クリップボードから画像を貼り付け (Ctrl+V)",
    uploadError: "画像ファイルのみアップロードできます。",
    clipboardError: "クリップボードからの読み込みに失敗しました:",
  },
} as const;

export function useTranslation(language: Language = DEFAULT_LANGUAGE) {
  const t = useCallback((key: keyof typeof translations["en"]) => {
    return translations[language][key];
  }, [language]);

  return { t };
}