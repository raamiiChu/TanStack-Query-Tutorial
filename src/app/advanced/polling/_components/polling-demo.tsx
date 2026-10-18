"use client";

import { useState } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";

import RequestLog from "@/components/demo/request-log";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createJob, jobQueries } from "@/features/jobs/queries";

const JobProgress = ({ jobId }: { jobId: number }) => {
  const { data: job } = useQuery(jobQueries.detail(jobId));

  if (!job) return null;

  return (
    <div className="space-y-2 rounded-md border p-4 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-semibold">
          Job #{job.id}: {job.name}
        </span>
        <Badge variant={job.status === "done" ? "success" : "info"}>
          {job.status}
        </Badge>
      </div>
      <div className="bg-muted h-3 overflow-hidden rounded-full">
        <div
          className="bg-primary h-full transition-all duration-500"
          style={{ width: `${job.progress}%` }}
        />
      </div>
      <p className="text-muted-foreground text-right font-mono">
        {job.progress}%
      </p>
    </div>
  );
};

const PollingDemo = () => {
  const [jobId, setJobId] = useState<number>();
  const startJob = useMutation({
    mutationFn: createJob,
    onSuccess: (job) => setJobId(job.id),
  });

  return (
    <>
      <Button
        onClick={() => startJob.mutate("Export segment")}
        disabled={startJob.isPending}
      >
        {startJob.isPending ? "Starting…" : "Start export job"}
      </Button>
      {jobId && <JobProgress key={jobId} jobId={jobId} />}
      <RequestLog filter="/api/jobs" limit={10} />
    </>
  );
};

export default PollingDemo;
