"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { type QueryKey, hashKey, useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const useNow = (intervalMs = 500) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);
  return now;
};

const subscribeNothing = () => () => {};

// Cache defaults differ between server and browser (e.g. gcTime), so only render in the browser.
const useIsBrowser = () =>
  useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false
  );

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

const formatDuration = (ms: number) => {
  if (ms === Infinity) return "∞";
  if (ms >= 60_000) return `${ms / 60_000}min`;
  return `${ms / 1000}s`;
};

/** Shows every query in the cache whose key starts with `queryKey`. */
type CacheInspectorProps = {
  queryKey: QueryKey;
  /** Highlights the entry the demo is currently reading. */
  currentKey?: QueryKey;
};

const CacheInspector = ({ queryKey, currentKey }: CacheInspectorProps) => {
  const queryClient = useQueryClient();
  const now = useNow();
  useQueryCacheVersion();

  const isBrowser = useIsBrowser();

  const queries = isBrowser
    ? queryClient.getQueryCache().findAll({ queryKey })
    : [];
  const currentHash = currentKey && hashKey(currentKey);

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
              <li
                key={query.queryHash}
                className={cn(
                  "-mx-1 flex items-center gap-2 rounded px-1",
                  query.queryHash === currentHash && "bg-amber-400/20"
                )}
              >
                <span className="flex-1 truncate">{query.queryHash}</span>
                <span className="text-muted-foreground">{updatedAgo}</span>
                <Badge variant={observers > 0 ? "success" : "secondary"}>
                  {observers > 0 ? `active (${observers})` : "inactive"}
                </Badge>
                {observers > 0 ? (
                  <Badge variant={query.isStale() ? "warning" : "success"}>
                    {query.isStale() ? "stale" : "fresh"}
                  </Badge>
                ) : (
                  // Staleness is judged by the next observer's staleTime, so an
                  // inactive entry only has a garbage-collection deadline.
                  <Badge variant="outline">
                    gcTime: {formatDuration(query.gcTime)}
                  </Badge>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CacheInspector;
