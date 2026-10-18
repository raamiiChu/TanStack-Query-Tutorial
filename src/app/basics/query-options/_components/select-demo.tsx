"use client";

import { useQuery } from "@tanstack/react-query";

import RequestLog from "@/components/demo/request-log";
import { Badge } from "@/components/ui/badge";
import { todoQueries } from "@/features/todos/queries";
import type { Todo } from "@/features/todos/types";

const selectCompletedCount = (todos: Todo[]) =>
  todos.filter((todo) => todo.completed).length;

const CompletedCount = () => {
  const { data: completedCount } = useQuery({
    ...todoQueries.list(10),
    select: selectCompletedCount,
  });

  return <Badge variant="success">completed: {completedCount ?? "…"}</Badge>;
};

const TodoTitles = () => {
  const { data: titles } = useQuery({
    ...todoQueries.list(10),
    select: (todos) => todos.map((todo) => todo.title),
  });

  return (
    <ul className="list-disc pl-6 text-sm">
      {titles?.map((title) => (
        <li key={title}>{title}</li>
      ))}
    </ul>
  );
};

const SelectDemo = () => (
  <>
    <CompletedCount />
    <TodoTitles />
    <RequestLog filter="/api/todos?limit=10" />
  </>
);

export default SelectDemo;
