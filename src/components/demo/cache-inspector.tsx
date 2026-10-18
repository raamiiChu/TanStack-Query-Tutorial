"use client";

import { useEffect, useState } from "react";

import { type QueryKey, hashKey, useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";

const useNow = (intervalMs = 500) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);
  return now;
};

const useQueryCacheVersion = () => {
  const queryClient = useQueryClient();
  const [version, setVersion] = useState(0);
  useEffect(
    () =>
      // Cache events can fire while another component renders, so defer the update.
      queryClient
        .getQueryCache()
        .subscribe(() => queueMicrotask(() => setVersion((prev) => prev + 1))),
    [queryClient]
  );
  return version;
};

/** Shows every query in the cache whose key starts with `queryKey`. */
const CacheInspector = ({ queryKey }: { queryKey: QueryKey }) => {
  const queryClient = useQueryClient();
  const now = useNow();
  useQueryCacheVersion();

  const queries = queryClient.getQueryCache().findAll({ queryKey });

  return (
    <div className="bg-muted/50 rounded-lg border p-3 text-xs">
      <div className="mb-2 flex items-center justify-between font-medium">
        <span>Query cache</span>
        <Badge variant="outline">entries: {queries.length}</Badge>
      </div>
      {queries.length === 0 ? (
        <p className="text-muted-foreground">
          Nothing cached for <code>{hashKey(queryKey)}</code>
        </p>
      ) : (
        <ul className="space-y-1 font-mono">
          {queries.map((query) => {
            const observers = query.getObserversCount();
            const updatedAgo = query.state.dataUpdatedAt
              ? `${Math.round((now - query.state.dataUpdatedAt) / 1000)}s ago`
              : "never";

            return (
              <li key={query.queryHash} className="flex items-center gap-2">
                <span className="flex-1 truncate">{query.queryHash}</span>
                <span className="text-muted-foreground">{updatedAgo}</span>
                <Badge variant={observers > 0 ? "success" : "secondary"}>
                  {observers > 0 ? `active (${observers})` : "inactive"}
                </Badge>
                <Badge variant={query.isStale() ? "warning" : "success"}>
                  {query.isStale() ? "stale" : "fresh"}
                </Badge>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CacheInspector;
