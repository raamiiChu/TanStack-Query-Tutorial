"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import RenderCounter from "@/components/demo/render-counter";
import RequestLog from "@/components/demo/request-log";
import TodoRow from "@/components/demo/todo-row";
import { Button } from "@/components/ui/button";
import { updateTodo } from "@/features/todos/api";
import { todoKeys, todoQueries } from "@/features/todos/queries";
import type { Todo } from "@/features/todos/types";

const LIMIT = 10;
const EDITED_SUFFIX = " (edited)";

const selectCompletedCount = (todos: Todo[]) =>
  todos.filter((todo) => todo.completed).length;

const selectTitles = (todos: Todo[]) => todos.map((todo) => todo.title);

const WholeList = () => {
  const { data: todos } = useQuery(todoQueries.list(LIMIT));

  return <p className="text-sm">{todos?.length ?? "…"} todos</p>;
};

const CompletedCount = () => {
  const { data: completedCount } = useQuery({
    ...todoQueries.list(LIMIT),
    select: selectCompletedCount,
  });

  return <p className="text-sm">{completedCount ?? "…"} completed</p>;
};

const TodoTitles = () => {
  const { data: titles } = useQuery({
    ...todoQueries.list(LIMIT),
    select: selectTitles,
  });

  return <p className="text-sm">{titles?.[0] ?? "…"}</p>;
};

const TodoEditor = () => {
  const queryClient = useQueryClient();
  const { data: todos } = useQuery(todoQueries.list(LIMIT));
  const firstTodo = todos?.[0];

  const editTodo = useMutation({
    mutationFn: updateTodo,
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData<Todo[]>(todoKeys.list(LIMIT), (old) =>
        old?.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
      );
    },
  });

  if (!todos || !firstTodo) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="secondary"
          disabled={editTodo.isPending}
          onClick={() =>
            editTodo.mutate({
              id: firstTodo.id,
              completed: !firstTodo.completed,
            })
          }
        >
          Toggle completed
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={editTodo.isPending}
          onClick={() =>
            editTodo.mutate({
              id: firstTodo.id,
              title: firstTodo.title.endsWith(EDITED_SUFFIX)
                ? firstTodo.title.slice(0, -EDITED_SUFFIX.length)
                : `${firstTodo.title}${EDITED_SUFFIX}`,
            })
          }
        >
          Rename
        </Button>
      </div>
      <ul className="space-y-2">
        {todos.slice(0, 3).map((todo) => (
          <TodoRow
            key={todo.id}
            todo={todo}
            className={todo.id === firstTodo.id ? "border-amber-400" : ""}
          />
        ))}
      </ul>
    </div>
  );
};

const SelectDemo = () => (
  <>
    <TodoEditor />
    <div className="grid gap-2 md:grid-cols-3">
      <RenderCounter label="no select">
        <WholeList />
      </RenderCounter>
      <RenderCounter label="select: completed count">
        <CompletedCount />
      </RenderCounter>
      <RenderCounter label="select: titles">
        <TodoTitles />
      </RenderCounter>
    </div>
    <RequestLog filter={/^\/api\/todos(\?limit=10|\/\d{2,})$/} />
  </>
);

export default SelectDemo;
