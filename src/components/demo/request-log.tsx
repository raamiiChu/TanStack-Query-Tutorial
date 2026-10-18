"use client";

import { Badge } from "@/components/ui/badge";
import { type RequestLogEntry, useRequestLog } from "@/lib/network-simulator";
import { cn } from "@/lib/utils";

const statusVariant = (status: RequestLogEntry["status"]) => {
  if (status === "pending") return "info";
  if (status === "cancelled") return "warning";
  if (status === "error" || status >= 400) return "destructive";
  return "success";
};

type RequestLogProps = {
  /** Path prefix, or a RegExp for demos that share a page with other demos. */
  filter?: string | RegExp;
  limit?: number;
  className?: string;
};

const RequestLog = ({ filter, limit = 6, className }: RequestLogProps) => {
  const log = useRequestLog();
  const entries = log.filter((entry) => {
    if (!filter) return true;
    return typeof filter === "string"
      ? entry.path.startsWith(filter)
      : filter.test(entry.path);
  });

  return (
    <div className={cn("bg-muted/50 rounded-lg border p-3 text-xs", className)}>
      <div className="mb-2 flex items-center justify-between font-medium">
        <span>Network requests</span>
        <Badge variant="outline">total: {entries.length}</Badge>
      </div>
      {entries.length === 0 ? (
        <p className="text-muted-foreground">No requests yet</p>
      ) : (
        <ul className="space-y-1 font-mono">
          {entries.slice(0, limit).map((entry) => (
            <li key={entry.id} className="flex items-center gap-2">
              <span className="w-12 font-semibold">{entry.method}</span>
              <span className="flex-1 truncate">{entry.path}</span>
              <span className="text-muted-foreground w-14 text-right">
                {entry.duration === undefined ? "…" : `${entry.duration}ms`}
              </span>
              <Badge variant={statusVariant(entry.status)} className="w-16">
                {entry.status}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RequestLog;
