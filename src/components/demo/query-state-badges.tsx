import type { FetchStatus, QueryStatus } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";

type QueryStateBadgesProps = {
  status: QueryStatus;
  fetchStatus: FetchStatus;
  isStale?: boolean;
  failureCount?: number;
};

const statusVariant = {
  pending: "warning",
  error: "destructive",
  success: "success",
} as const;

const fetchStatusVariant = {
  fetching: "info",
  paused: "warning",
  idle: "secondary",
} as const;

const QueryStateBadges = ({
  status,
  fetchStatus,
  isStale,
  failureCount,
}: QueryStateBadgesProps) => (
  <div className="flex flex-wrap items-center gap-2 text-xs">
    <Badge variant={statusVariant[status]}>status: {status}</Badge>
    <Badge variant={fetchStatusVariant[fetchStatus]}>
      fetchStatus: {fetchStatus}
    </Badge>
    {isStale !== undefined && (
      <Badge variant={isStale ? "warning" : "success"}>
        {isStale ? "stale" : "fresh"}
      </Badge>
    )}
    {failureCount !== undefined && failureCount > 0 && (
      <Badge variant="destructive">failureCount: {failureCount}</Badge>
    )}
  </div>
);

export default QueryStateBadges;
