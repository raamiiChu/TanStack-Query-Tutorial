"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import RequestLog from "@/components/demo/request-log";
import TodoRow from "@/components/demo/todo-row";
import { updateTodo } from "@/features/todos/api";
import { todoKeys, todoQueries } from "@/features/todos/queries";
import type { Todo } from "@/features/todos/types";

const LIMIT = 5;

const OptimisticCacheDemo = () => {
  const queryClient = useQueryClient();
  const queryKey = todoKeys.list(LIMIT);
  const { data: todos } = useQuery(todoQueries.list(LIMIT));

  const toggleTodo = useMutation({
    mutationFn: updateTodo,
    onMutate: async (variables) => {
      // Stop in-flight refetches from overwriting the optimistic value.
      await queryClient.cancelQueries({ queryKey });

      const previousTodos = queryClient.getQueryData<Todo[]>(queryKey);
      queryClient.setQueryData<Todo[]>(queryKey, (old) =>
        old?.map((todo) =>
          todo.id === variables.id ? { ...todo, ...variables } : todo
        )
      );

      return { previousTodos };
    },
    onError: (_error, _variables, onMutateResult) => {
      queryClient.setQueryData(queryKey, onMutateResult?.previousTodos);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
    meta: { errorMessage: "Could not update todo, rolled back" },
  });

  return (
    <>
      <ul className="space-y-2">
        {todos?.map((todo) => (
          <TodoRow
            key={todo.id}
            todo={todo}
            onToggle={() =>
              toggleTodo.mutate({ id: todo.id, completed: !todo.completed })
            }
          />
        ))}
      </ul>
      <RequestLog filter={/^\/api\/todos(\?limit=5|\/\d+)$/} />
    </>
  );
};

export default OptimisticCacheDemo;
