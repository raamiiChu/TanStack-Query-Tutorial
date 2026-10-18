"use client";

import { Suspense, useState } from "react";

import {
  QueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import RequestLog from "@/components/demo/request-log";
import TodoRow from "@/components/demo/todo-row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { todoQueries } from "@/features/todos/queries";

const TodoList = () => {
  // data is always defined: loading and error states are handled by the boundaries.
  const { data, isFetching, refetch } = useSuspenseQuery({
    ...todoQueries.list(4),
    retry: 1,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => refetch()}>
          Refetch
        </Button>
        {isFetching && <Badge variant="info">background refetch…</Badge>}
      </div>
      <ul className="space-y-2">
        {data.map((todo) => (
          <TodoRow key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

const TodoListSkeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 4 }, (_, index) => (
      <Skeleton key={index} className="h-10" />
    ))}
  </div>
);

const SuspenseDemo = () => {
  const [isMounted, setIsMounted] = useState(false);

  return (
    <>
      <Button onClick={() => setIsMounted((prev) => !prev)}>
        {isMounted ? "Unmount" : "Mount"} {"<TodoList />"}
      </Button>

      {isMounted && (
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              fallbackRender={({ error, resetErrorBoundary }) => (
                <div className="border-destructive text-destructive space-y-2 rounded-md border p-4 text-sm">
                  <p>
                    Something went wrong:{" "}
                    {error instanceof Error ? error.message : String(error)}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={resetErrorBoundary}
                  >
                    Try again
                  </Button>
                </div>
              )}
            >
              <Suspense fallback={<TodoListSkeleton />}>
                <TodoList />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      )}

      <RequestLog filter="/api/todos" />
    </>
  );
};

export default SuspenseDemo;
