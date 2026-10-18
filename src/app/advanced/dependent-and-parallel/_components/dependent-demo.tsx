"use client";

import { skipToken, useQuery } from "@tanstack/react-query";

import QueryStateBadges from "@/components/demo/query-state-badges";
import RequestLog from "@/components/demo/request-log";
import TodoRow from "@/components/demo/todo-row";
import { fetchTodo } from "@/features/todos/api";
import { todoKeys, todoQueries } from "@/features/todos/queries";

const DependentDemo = () => {
  const latestTodos = useQuery(todoQueries.list(1));
  const latestId = latestTodos.data?.[0]?.id;

  const latestDetail = useQuery({
    queryKey: todoKeys.detail(latestId ?? 0),
    queryFn: latestId ? ({ signal }) => fetchTodo(latestId, signal) : skipToken,
  });

  return (
    <>
      <div className="space-y-2">
        <p className="text-sm font-semibold">1. Latest todo id</p>
        <QueryStateBadges
          status={latestTodos.status}
          fetchStatus={latestTodos.fetchStatus}
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold">2. Detail (waits for step 1)</p>
        <QueryStateBadges
          status={latestDetail.status}
          fetchStatus={latestDetail.fetchStatus}
        />
        {latestDetail.data && (
          <ul>
            <TodoRow todo={latestDetail.data} />
          </ul>
        )}
      </div>
      <RequestLog filter={/^\/api\/todos(\?limit=1|\/\d{2,})$/} />
    </>
  );
};

export default DependentDemo;
