"use client";

import { useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import CacheInspector from "@/components/demo/cache-inspector";
import OptionGroup from "@/components/demo/option-group";
import QueryStateBadges from "@/components/demo/query-state-badges";
import RequestLog from "@/components/demo/request-log";
import TodoRow from "@/components/demo/todo-row";
import { Button } from "@/components/ui/button";
import { todoKeys, todoQueries } from "@/features/todos/queries";

const STALE_TIMES = [
  { label: "0 (default)", value: 0 },
  { label: "10s", value: 10_000 },
  { label: "Infinity", value: Infinity },
];

const GC_TIMES = [
  { label: "5min (default)", value: 5 * 60 * 1000 },
  { label: "5s", value: 5_000 },
];

const TodoList = ({
  staleTime,
  gcTime,
}: {
  staleTime: number;
  gcTime: number;
}) => {
  const { data, status, fetchStatus, isStale } = useQuery({
    ...todoQueries.list(3),
    staleTime,
    gcTime,
  });

  return (
    <div className="space-y-2">
      <QueryStateBadges
        status={status}
        fetchStatus={fetchStatus}
        isStale={isStale}
      />
      <ul className="space-y-2">
        {data?.map((todo) => (
          <TodoRow key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

const LifecycleDemo = () => {
  const queryClient = useQueryClient();
  const [isMounted, setIsMounted] = useState(true);
  const [staleTime, setStaleTime] = useState(STALE_TIMES[0].value);
  const [gcTime, setGcTime] = useState(GC_TIMES[0].value);

  return (
    <>
      <OptionGroup
        label="staleTime"
        options={STALE_TIMES}
        value={staleTime}
        onChange={setStaleTime}
      />
      <OptionGroup
        label="gcTime"
        options={GC_TIMES}
        value={gcTime}
        onChange={(value) => {
          // A cached query only ever raises its gcTime, so start over to apply a shorter one.
          queryClient.removeQueries({ queryKey: todoKeys.list(3) });
          setGcTime(value);
        }}
      />
      <Button variant="secondary" onClick={() => setIsMounted((prev) => !prev)}>
        {isMounted ? "Unmount" : "Mount"} {"<TodoList />"}
      </Button>

      {isMounted ? (
        <TodoList key={gcTime} staleTime={staleTime} gcTime={gcTime} />
      ) : (
        <p className="text-muted-foreground text-sm">
          {"<TodoList />"} is unmounted — the query is now inactive.
        </p>
      )}

      <CacheInspector queryKey={todoKeys.list(3)} />
      <RequestLog filter="/api/todos?limit=3" />
    </>
  );
};

export default LifecycleDemo;
