import { uuidv7 } from "uuidv7";
import type { Todo } from "~/types";
import type { Language } from "~/lib/i18n";
import { DEFAULT_LANGUAGE } from "~/lib/i18n";

const STORAGE_PREFIX = "todo-app";
const STORAGE_KEYS = {
  TODOS: `${STORAGE_PREFIX}-todos`,
  POSITION: `${STORAGE_PREFIX}-position`,
  SHOW_COMPLETED: `${STORAGE_PREFIX}-show-completed`,
  BACKGROUND_IMAGE: `${STORAGE_PREFIX}-background-image`,
  LANGUAGE: `${STORAGE_PREFIX}-language`,
} as const;

type StorageState = {
  todos: Todo[];
  position: { x: number; y: number };
  showCompleted: boolean;
  backgroundImage: string;
  language: Language;
};

const DEFAULT_STATE: StorageState = {
  todos: [],
  position: { x: 50, y: 50 },
  showCompleted: false,
  backgroundImage: "",
  language: DEFAULT_LANGUAGE,
};

function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Failed to load ${key}:`, err);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save ${key}:`, err);
  }
}

export function loadState(): StorageState {
  return {
    todos: getItem(STORAGE_KEYS.TODOS, DEFAULT_STATE.todos).map((todo: Todo) => ({
      id: todo.id || uuidv7(),
      text: todo.text,
      completed: todo.completed,
      createdAt: todo.createdAt || Date.now(),
    })),
    position: getItem(STORAGE_KEYS.POSITION, DEFAULT_STATE.position),
    showCompleted: getItem(STORAGE_KEYS.SHOW_COMPLETED, DEFAULT_STATE.showCompleted),
    backgroundImage: getItem(STORAGE_KEYS.BACKGROUND_IMAGE, DEFAULT_STATE.backgroundImage),
    language: getItem(STORAGE_KEYS.LANGUAGE, DEFAULT_STATE.language),
  };
}

export function saveTodos(todos: Todo[]): void {
  setItem(STORAGE_KEYS.TODOS, todos);
}

export function savePosition(position: { x: number; y: number }): void {
  setItem(STORAGE_KEYS.POSITION, position);
}

export function saveShowCompleted(showCompleted: boolean): void {
  setItem(STORAGE_KEYS.SHOW_COMPLETED, showCompleted);
}

export function saveBackgroundImage(backgroundImage: string): void {
  setItem(STORAGE_KEYS.BACKGROUND_IMAGE, backgroundImage);
}

export function saveLanguage(language: Language): void {
  setItem(STORAGE_KEYS.LANGUAGE, language);
}

export function createTodo(text: string): Todo {
  return {
    id: uuidv7(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now(),
  };
}