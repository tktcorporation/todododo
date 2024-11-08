import { useCallback } from "react";

export type Language = "en" | "ja";

export const DEFAULT_LANGUAGE: Language = "en";

export const translations = {
  en: {
    addTodo: "Add",
    addTodoPlaceholder: "Enter a new task... (paste multiple lines to add multiple tasks)",
    noTasks: "No tasks",
    delete: "Delete",
    settings: "Settings",
    showCompletedTasks: "Show completed tasks",
    backgroundImage: "Background Image",
    uploadBackground: "Click or drag & drop to upload background image",
    pasteFromClipboard: "Paste image from clipboard (Ctrl+V)",
    uploadError: "Only image files can be uploaded.",
    clipboardError: "Failed to read from clipboard:",
    dragToMove: "Drag to move",
    confirmTodos: "Confirm Tasks",
    cancel: "Cancel",
    addTodos: "Add Tasks",
  },
  ja: {
    addTodo: "追加",
    addTodoPlaceholder: "新しいタスクを入力... (複数行をペーストで一括追加)",
    noTasks: "タスクなし",
    delete: "削除",
    settings: "設定",
    showCompletedTasks: "完了したタスクを表示",
    backgroundImage: "背景画像",
    uploadBackground: "クリックまたはドラッグ＆ドロップで背景画像をアップロード",
    pasteFromClipboard: "クリップボードから画像を貼り付け (Ctrl+V)",
    uploadError: "画像ファイルのみアップロードできます。",
    clipboardError: "クリップボードからの読み込みに失敗しました:",
    dragToMove: "ドラッグして移動",
    confirmTodos: "タスクの確認",
    cancel: "キャンセル",
    addTodos: "タスクを追加",
  },
} as const;

export function useTranslation(language: Language = DEFAULT_LANGUAGE) {
  const t = useCallback((key: keyof typeof translations["en"]) => {
    return translations[language][key];
  }, [language]);

  return { t };
}