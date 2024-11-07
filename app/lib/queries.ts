import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Todo } from "~/types";
import { loadState, saveTodos } from "./storage";

const TODOS_KEY = "todos";

export function useTodos() {
  return useQuery({
    queryKey: [TODOS_KEY],
    queryFn: () => loadState().todos,
    initialData: [],
  });
}

export function useAddTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTodo: Todo) => {
      const currentTodos = queryClient.getQueryData<Todo[]>([TODOS_KEY]) || [];
      const updatedTodos = [...currentTodos, newTodo];
      saveTodos(updatedTodos);
      return newTodo;
    },
    onSuccess: (newTodo) => {
      queryClient.setQueryData<Todo[]>([TODOS_KEY], (old = []) => [...old, newTodo]);
    },
  });
}

export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      const currentTodos = queryClient.getQueryData<Todo[]>([TODOS_KEY]) || [];
      const updatedTodos = currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      saveTodos(updatedTodos);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [TODOS_KEY] });
      const previousTodos = queryClient.getQueryData<Todo[]>([TODOS_KEY]);

      queryClient.setQueryData<Todo[]>([TODOS_KEY], (old = []) =>
        old.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );

      return { previousTodos };
    },
    onError: (_, __, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData([TODOS_KEY], context.previousTodos);
      }
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      const currentTodos = queryClient.getQueryData<Todo[]>([TODOS_KEY]) || [];
      const updatedTodos = currentTodos.filter((todo) => todo.id !== id);
      saveTodos(updatedTodos);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [TODOS_KEY] });
      const previousTodos = queryClient.getQueryData<Todo[]>([TODOS_KEY]);

      queryClient.setQueryData<Todo[]>([TODOS_KEY], (old = []) =>
        old.filter((todo) => todo.id !== id)
      );

      return { previousTodos };
    },
    onError: (_, __, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData([TODOS_KEY], context.previousTodos);
      }
    },
  });
}

export function useEditTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) => {
      const currentTodos = queryClient.getQueryData<Todo[]>([TODOS_KEY]) || [];
      const updatedTodos = currentTodos.map((todo) =>
        todo.id === id ? { ...todo, text } : todo
      );
      saveTodos(updatedTodos);
      return { id, text };
    },
    onMutate: async ({ id, text }) => {
      await queryClient.cancelQueries({ queryKey: [TODOS_KEY] });
      const previousTodos = queryClient.getQueryData<Todo[]>([TODOS_KEY]);

      queryClient.setQueryData<Todo[]>([TODOS_KEY], (old = []) =>
        old.map((todo) => (todo.id === id ? { ...todo, text } : todo))
      );

      return { previousTodos };
    },
    onError: (_, __, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData([TODOS_KEY], context.previousTodos);
      }
    },
  });
}