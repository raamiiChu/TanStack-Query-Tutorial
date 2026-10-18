"use client";

import { useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import OptionGroup from "@/components/demo/option-group";
import RequestLog from "@/components/demo/request-log";
import { Skeleton } from "@/components/ui/skeleton";
import { todoQueries } from "@/features/todos/queries";
import { cn } from "@/lib/utils";

const ON_OFF = [
  { label: "on", value: true },
  { label: "off", value: false },
];

const TODO_IDS = [1, 2, 3, 4, 5, 6];

const TodoDetail = ({ id }: { id: number }) => {
  const { data, isPending } = useQuery(todoQueries.detail(id));

  if (isPending) return <Skeleton className="h-24" />;
  if (!data) return null;

  return (
    <div className="space-y-1 rounded-md border p-4 text-sm">
      <p className="font-semibold">{data.title}</p>
      <p className="text-muted-foreground">
        {data.completed ? "Completed" : "Not completed"} · created{" "}
        {new Date(data.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

const PrefetchDemo = () => {
  const queryClient = useQueryClient();
  const [prefetchOnHover, setPrefetchOnHover] = useState(true);
  const [selectedId, setSelectedId] = useState<number>();

  const prefetchTodo = (id: number) => {
    if (!prefetchOnHover) return;
    // prefetchQuery skips the request when cached data is still fresh.
    queryClient.prefetchQuery({ ...todoQueries.detail(id), staleTime: 10_000 });
  };

  return (
    <>
      <OptionGroup
        label="onHover"
        options={ON_OFF}
        value={prefetchOnHover}
        onChange={setPrefetchOnHover}
      />

      <div className="grid grid-cols-6 gap-2">
        {TODO_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onMouseEnter={() => prefetchTodo(id)}
            onFocus={() => prefetchTodo(id)}
            onClick={() => setSelectedId(id)}
            className={cn(
              "hover:bg-accent rounded-md border py-3 text-sm font-medium",
              selectedId === id && "border-primary"
            )}
          >
            Todo #{id}
          </button>
        ))}
      </div>

      {selectedId ? (
        <TodoDetail id={selectedId} />
      ) : (
        <p className="text-muted-foreground text-sm">
          Hover a todo, then click it.
        </p>
      )}

      <RequestLog filter="/api/todos" />
    </>
  );
};

export default PrefetchDemo;
