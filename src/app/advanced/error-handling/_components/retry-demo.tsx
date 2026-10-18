"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import OptionGroup from "@/components/demo/option-group";
import QueryStateBadges from "@/components/demo/query-state-badges";
import RequestLog from "@/components/demo/request-log";
import { apiFetch } from "@/lib/api-client";

type Scenario = "none" | "404" | "500";

const SCENARIOS = [
  { label: "404 Not Found", value: "404" as Scenario },
  { label: "500 Server Error", value: "500" as Scenario },
];

const SCENARIO_PATHS: Record<Exclude<Scenario, "none">, string> = {
  "404": "/api/todos/9999",
  "500": "/api/todos/1?fail=1",
};

const RetryDemo = () => {
  const [scenario, setScenario] = useState<Scenario>("none");

  const { status, fetchStatus, failureCount, error } = useQuery({
    queryKey: ["retry-demo", scenario],
    queryFn: () =>
      apiFetch(SCENARIO_PATHS[scenario as Exclude<Scenario, "none">]),
    enabled: scenario !== "none",
    retryDelay: 500,
  });

  return (
    <>
      <OptionGroup
        label="fetch"
        options={SCENARIOS}
        value={scenario}
        onChange={setScenario}
      />
      {scenario !== "none" && (
        <QueryStateBadges
          status={status}
          fetchStatus={fetchStatus}
          failureCount={failureCount}
        />
      )}
      {error && <p className="text-destructive text-sm">{error.message}</p>}
      <RequestLog filter={/^\/api\/todos\/(9999|1\?fail=1)$/} limit={8} />
    </>
  );
};

export default RetryDemo;
