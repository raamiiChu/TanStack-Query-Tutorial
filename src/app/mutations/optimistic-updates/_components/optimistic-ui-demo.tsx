"use client";

import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import RequestLog from "@/components/demo/request-log";
import TodoRow from "@/components/demo/todo-row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTodo } from "@/features/todos/api";
import { todoKeys, todoQueries } from "@/features/todos/queries";

const OptimisticUiDemo = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const { data: todos } = useQuery(todoQueries.list(3));

  const addTodo = useMutation({
    mutationFn: createTodo,
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: todoKeys.list(3) }),
  });

  return (
    <>
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          addTodo.mutate(title);
          setTitle("");
        }}
      >
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="New todo"
        />
        <Button type="submit" disabled={!title.trim()}>
          Add
        </Button>
      </form>

      <ul className="space-y-2">
        {addTodo.isPending && (
          <TodoRow
            todo={{ title: addTodo.variables, completed: false }}
            className="opacity-50"
          />
        )}
        {addTodo.isError && (
          <TodoRow
            todo={{ title: addTodo.variables, completed: false }}
            className="border-destructive text-destructive"
          >
            <Button
              size="sm"
              variant="outline"
              onClick={() => addTodo.mutate(addTodo.variables)}
            >
              Retry
            </Button>
          </TodoRow>
        )}
        {todos?.map((todo) => (
          <TodoRow key={todo.id} todo={todo} />
        ))}
      </ul>

      <RequestLog filter={/^\/api\/todos(\?limit=3)?$/} />
    </>
  );
};

export default OptimisticUiDemo;
