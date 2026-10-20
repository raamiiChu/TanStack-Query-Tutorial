"use client";

import { Profiler, useState, useSyncExternalStore } from "react";

import { Badge } from "@/components/ui/badge";

const createCounter = () => {
  let count = 0;
  const listeners = new Set<() => void>();

  return {
    increment: () => {
      count += 1;
      // onRender runs during the commit, so notify after it finishes.
      queueMicrotask(() => listeners.forEach((listener) => listener()));
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => count,
  };
};

type Counter = ReturnType<typeof createCounter>;

const CountBadge = ({ counter }: { counter: Counter }) => {
  const count = useSyncExternalStore(
    counter.subscribe,
    counter.getSnapshot,
    () => 0
  );

  return <Badge variant="outline">renders: {count}</Badge>;
};

type RenderCounterProps = {
  label: string;
  children: React.ReactNode;
};

/**
 * Counts how often `children` commits, using React's Profiler. The badge lives
 * outside the profiled tree so updating it never re-renders `children`.
 */
const RenderCounter = ({ label, children }: RenderCounterProps) => {
  const [counter] = useState(createCounter);

  return (
    <div className="space-y-2 rounded-md border p-3">
      <div className="flex items-center justify-between gap-2">
        <code className="text-muted-foreground text-xs">{label}</code>
        <CountBadge counter={counter} />
      </div>
      <Profiler id={label} onRender={counter.increment}>
        {children}
      </Profiler>
    </div>
  );
};

export default RenderCounter;
