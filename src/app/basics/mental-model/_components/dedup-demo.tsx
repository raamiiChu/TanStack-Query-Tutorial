"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import RequestLog from "@/components/demo/request-log";
import { Button } from "@/components/ui/button";
import { todoQueries } from "@/features/todos/queries";

const TodoCount = ({ label }: { label: string }) => {
  const { data, isFetching } = useQuery(todoQueries.list(4));

  return (
    <div className="rounded-md border p-3 text-sm">
      <p className="font-semibold">{label}</p>
      <p className="text-muted-foreground">
        {isFetching ? "Fetching…" : `${data?.length ?? 0} todos`}
      </p>
    </div>
  );
};

const DedupDemo = () => {
  const [isMounted, setIsMounted] = useState(false);

  return (
    <>
      <Button onClick={() => setIsMounted((prev) => !prev)}>
        {isMounted ? "Unmount" : "Mount"} 3 components
      </Button>

      {isMounted && (
        <div className="grid grid-cols-3 gap-2">
          <TodoCount label="<Header />" />
          <TodoCount label="<Sidebar />" />
          <TodoCount label="<Content />" />
        </div>
      )}

      <RequestLog filter="/api/todos?limit=4" />
    </>
  );
};

export default DedupDemo;
