"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import RequestLog from "@/components/demo/request-log";
import TodoRow from "@/components/demo/todo-row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { todoQueries } from "@/features/todos/queries";

const InfiniteDemo = () => {
  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(todoQueries.infinite());

  const todos = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <>
      <div className="flex gap-2">
        <Badge variant="outline">pages: {data?.pages.length ?? 0}</Badge>
        <Badge variant="outline">
          pageParams: [{data?.pageParams.map(String).join(", ")}]
        </Badge>
        <Badge variant="outline">todos: {todos.length}</Badge>
      </div>

      {status === "pending" && <p className="text-sm">Loading…</p>}
      {status === "error" && (
        <p className="text-destructive text-sm">Failed to load todos</p>
      )}

      <ul className="space-y-2">
        {todos.map((todo) => (
          <TodoRow key={todo.id} todo={todo} />
        ))}
      </ul>

      <Button
        variant="secondary"
        className="w-full"
        disabled={!hasNextPage || isFetchingNextPage}
        onClick={() => fetchNextPage()}
      >
        {isFetchingNextPage
          ? "Loading more…"
          : hasNextPage
            ? "Load more"
            : "No more todos"}
      </Button>

      <RequestLog filter="/api/todos" />
    </>
  );
};

export default InfiniteDemo;
