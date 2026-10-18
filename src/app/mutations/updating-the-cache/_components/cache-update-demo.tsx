"use client";

import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

import OptionGroup from "@/components/demo/option-group";
import RequestLog from "@/components/demo/request-log";
import TodoRow from "@/components/demo/todo-row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTodo, deleteTodo } from "@/features/todos/api";
import { todoKeys, todoQueries } from "@/features/todos/queries";
import type { Todo } from "@/features/todos/types";

type Strategy = "invalidate" | "setQueryData";

const STRATEGIES = [
  { label: "invalidateQueries", value: "invalidate" as Strategy },
  { label: "setQueryData", value: "setQueryData" as Strategy },
];

const LIMIT = 5;

const CacheUpdateDemo = () => {
  const queryClient = useQueryClient();
  const [strategy, setStrategy] = useState<Strategy>("invalidate");
  const [title, setTitle] = useState("");
  const { data: todos } = useQuery(todoQueries.list(LIMIT));

  const addTodo = useMutation({
    mutationFn: createTodo,
    onSuccess: (newTodo) => {
      setTitle("");
      if (strategy === "invalidate") {
        // Returning the promise keeps the mutation pending until the refetch is done.
        return queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      }
      queryClient.setQueryData<Todo[]>(todoKeys.list(LIMIT), (old = []) =>
        [newTodo, ...old].slice(0, LIMIT)
      );
    },
    meta: { errorMessage: "Could not add todo" },
  });

  const removeTodo = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() }),
    meta: { errorMessage: "Could not delete todo" },
  });

  return (
    <>
      <OptionGroup
        label="strategy"
        options={STRATEGIES}
        value={strategy}
        onChange={setStrategy}
      />
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          addTodo.mutate(title);
        }}
      >
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="New todo"
        />
        <Button type="submit" disabled={addTodo.isPending || !title.trim()}>
          {addTodo.isPending ? "Adding…" : "Add"}
        </Button>
      </form>

      <ul className="space-y-2">
        {todos?.map((todo) => (
          <TodoRow key={todo.id} todo={todo}>
            <Button
              size="icon"
              variant="ghost"
              disabled={
                removeTodo.isPending && removeTodo.variables === todo.id
              }
              onClick={() => removeTodo.mutate(todo.id)}
            >
              <Trash2 />
            </Button>
          </TodoRow>
        ))}
      </ul>

      <RequestLog filter="/api/todos" />
    </>
  );
};

export default CacheUpdateDemo;
