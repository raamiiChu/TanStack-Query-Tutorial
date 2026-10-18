import { queryOptions } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";

export type Job = {
  id: number;
  name: string;
  durationMs: number;
  createdAt: string;
  progress: number;
  status: "running" | "done";
};

export const createJob = (name: string) =>
  apiFetch<Omit<Job, "progress" | "status">>("/api/jobs", {
    method: "POST",
    body: { name },
  });

export const jobKeys = {
  all: ["jobs"] as const,
  detail: (id: number) => [...jobKeys.all, id] as const,
};

export const jobQueries = {
  detail: (id: number) =>
    queryOptions({
      queryKey: jobKeys.detail(id),
      queryFn: ({ signal }) => apiFetch<Job>(`/api/jobs/${id}`, { signal }),
      refetchInterval: (query) =>
        query.state.data?.status === "done" ? false : 1000,
    }),
};
