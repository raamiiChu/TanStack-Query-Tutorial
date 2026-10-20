"use client";

import { useState } from "react";

import { useQueries } from "@tanstack/react-query";

import OptionGroup from "@/components/demo/option-group";
import RequestLog from "@/components/demo/request-log";
import TodoRow from "@/components/demo/todo-row";
import { Badge } from "@/components/ui/badge";
import { todoQueries } from "@/features/todos/queries";

const COUNTS = [1, 3, 5].map((count) => ({
  label: String(count),
  value: count,
}));

const ParallelDemo = () => {
  const [count, setCount] = useState(1);
  const ids = Array.from({ length: count }, (_, index) => index + 1);

  const { todos, isPending } = useQueries({
    queries: ids.map((id) => todoQueries.detail(id)),
    combine: (results) => ({
      todos: results.flatMap((result) => (result.data ? [result.data] : [])),
      isPending: results.some((result) => result.isPending),
    }),
  });

  return (
    <>
      <OptionGroup
        label="queries"
        options={COUNTS}
        value={count}
        onChange={setCount}
      />
      {isPending && (
        <Badge variant="info">loading {count} todos in parallel…</Badge>
      )}
      <ul className="space-y-2">
        {todos.map((todo) => (
          <TodoRow key={todo.id} todo={todo} />
        ))}
      </ul>
      <RequestLog filter={/^\/api\/todos\/[1-5]$/} />
    </>
  );
};

export default ParallelDemo;
