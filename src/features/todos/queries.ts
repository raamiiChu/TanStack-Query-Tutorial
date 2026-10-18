import {
  infiniteQueryOptions,
  keepPreviousData,
  queryOptions,
} from "@tanstack/react-query";

import {
  fetchTodo,
  fetchTodoCursorPage,
  fetchTodoPage,
  fetchTodos,
} from "./api";

export const todoKeys = {
  all: ["todos"] as const,
  lists: () => [...todoKeys.all, "list"] as const,
  list: (limit: number) => [...todoKeys.lists(), { limit }] as const,
  pages: () => [...todoKeys.all, "page"] as const,
  page: (page: number) => [...todoKeys.pages(), page] as const,
  infinite: () => [...todoKeys.all, "infinite"] as const,
  details: () => [...todoKeys.all, "detail"] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
};

export const todoQueries = {
  list: (limit = 5) =>
    queryOptions({
      queryKey: todoKeys.list(limit),
      queryFn: ({ signal }) => fetchTodos(limit, signal),
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: todoKeys.detail(id),
      queryFn: ({ signal }) => fetchTodo(id, signal),
    }),

  page: (page: number) =>
    queryOptions({
      queryKey: todoKeys.page(page),
      queryFn: ({ signal }) => fetchTodoPage(page, signal),
      placeholderData: keepPreviousData,
    }),

  infinite: () =>
    infiniteQueryOptions({
      queryKey: todoKeys.infinite(),
      queryFn: ({ pageParam, signal }) =>
        fetchTodoCursorPage(pageParam, signal),
      initialPageParam: undefined as number | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }),
};
