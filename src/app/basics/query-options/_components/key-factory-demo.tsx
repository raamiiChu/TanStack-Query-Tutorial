"use client";

import { useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import CacheInspector from "@/components/demo/cache-inspector";
import OptionGroup from "@/components/demo/option-group";
import QueryKeyDisplay from "@/components/demo/query-key-display";
import QueryStateBadges from "@/components/demo/query-state-badges";
import RequestLog from "@/components/demo/request-log";
import TodoRow from "@/components/demo/todo-row";
import { Button } from "@/components/ui/button";
import { todoKeys, todoQueries } from "@/features/todos/queries";

const TODO_IDS = [1, 2, 3, 4, 5].map((id) => ({ label: `#${id}`, value: id }));

const KeyFactoryDemo = () => {
  const queryClient = useQueryClient();
  const [todoId, setTodoId] = useState(1);
  const { data, status, fetchStatus, isStale } = useQuery(
    todoQueries.detail(todoId)
  );

  return (
    <>
      <OptionGroup
        label="todoId"
        options={TODO_IDS}
        value={todoId}
        onChange={setTodoId}
      />
      <QueryKeyDisplay
        label={`todoQueries.detail(${todoId})`}
        queryKey={todoKeys.detail(todoId)}
        variableIndex={2}
      />
      <QueryStateBadges
        status={status}
        fetchStatus={fetchStatus}
        isStale={isStale}
      />
      {data && (
        <ul>
          <TodoRow todo={data} />
        </ul>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: todoKeys.details() })
          }
        >
          invalidate todoKeys.details()
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => queryClient.removeQueries({ queryKey: todoKeys.all })}
        >
          remove todoKeys.all
        </Button>
      </div>

      <CacheInspector
        queryKey={todoKeys.all}
        currentKey={todoKeys.detail(todoId)}
      />
      <RequestLog filter="/api/todos/" />
    </>
  );
};

export default KeyFactoryDemo;
