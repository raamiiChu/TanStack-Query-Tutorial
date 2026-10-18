import { apiFetch } from "@/lib/api-client";

import type { Todo, TodoCursorPage, TodoPage } from "./types";

export const fetchTodos = (limit: number, signal?: AbortSignal) =>
  apiFetch<Todo[]>(`/api/todos?limit=${limit}`, { signal });

export const fetchTodo = (id: number, signal?: AbortSignal) =>
  apiFetch<Todo>(`/api/todos/${id}`, { signal });

export const fetchTodoPage = (page: number, signal?: AbortSignal) =>
  apiFetch<TodoPage>(`/api/todos/paginated?page=${page}`, { signal });

export const fetchTodoCursorPage = (
  cursor: number | undefined,
  signal?: AbortSignal
) =>
  apiFetch<TodoCursorPage>(
    `/api/todos/infinite${cursor ? `?cursor=${cursor}` : ""}`,
    { signal }
  );

export const createTodo = (title: string) =>
  apiFetch<Todo>("/api/todos", { method: "POST", body: { title } });

export const updateTodo = ({
  id,
  ...data
}: Pick<Todo, "id"> & Partial<Pick<Todo, "title" | "completed">>) =>
  apiFetch<Todo>(`/api/todos/${id}`, { method: "PATCH", body: data });

export const deleteTodo = (id: number) =>
  apiFetch<void>(`/api/todos/${id}`, { method: "DELETE" });
