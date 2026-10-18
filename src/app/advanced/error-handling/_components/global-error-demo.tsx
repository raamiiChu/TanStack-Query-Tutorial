"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import RequestLog from "@/components/demo/request-log";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";

const GlobalErrorDemo = () => {
  const queryClient = useQueryClient();

  const archiveTodo = useMutation({
    mutationFn: () =>
      apiFetch("/api/todos/2?fail=1", { method: "PATCH", body: {} }),
    meta: { errorMessage: "Could not archive todo" },
  });

  const loadReport = () =>
    queryClient
      .fetchQuery({
        queryKey: ["report"],
        queryFn: () => apiFetch("/api/todos?fail=1"),
        retry: false,
        meta: { errorMessage: "Could not load report" },
      })
      .catch(() => {});

  return (
    <>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={loadReport}>
          Failing query
        </Button>
        <Button variant="secondary" onClick={() => archiveTodo.mutate()}>
          Failing mutation
        </Button>
      </div>
      <p className="text-muted-foreground text-sm">
        Neither component handles the error itself: the toast comes from the
        QueryCache / MutationCache in the provider.
      </p>
      <RequestLog filter={/^\/api\/todos(\?|\/2\?)fail=1$/} />
    </>
  );
};

export default GlobalErrorDemo;
