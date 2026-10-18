"use client";

import { useEffect, useState } from "react";

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";

import OptionGroup from "@/components/demo/option-group";
import RequestLog from "@/components/demo/request-log";
import TodoRow from "@/components/demo/todo-row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { todoQueries } from "@/features/todos/queries";
import { cn } from "@/lib/utils";

const ON_OFF = [
  { label: "on", value: true },
  { label: "off", value: false },
];

const PAGE_SIZE = 5;

const PaginationDemo = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [keepPrevious, setKeepPrevious] = useState(true);
  const [prefetchNext, setPrefetchNext] = useState(false);

  const { data, isPending, isFetching, isPlaceholderData } = useQuery({
    ...todoQueries.page(page),
    placeholderData: keepPrevious ? keepPreviousData : undefined,
  });

  const hasNextPage = data ? page < data.totalPages : false;

  useEffect(() => {
    if (prefetchNext && hasNextPage) {
      queryClient.prefetchQuery(todoQueries.page(page + 1));
    }
  }, [prefetchNext, hasNextPage, page, queryClient]);

  return (
    <>
      <OptionGroup
        label="keepPrevious"
        options={ON_OFF}
        value={keepPrevious}
        onChange={setKeepPrevious}
      />
      <OptionGroup
        label="prefetchNext"
        options={ON_OFF}
        value={prefetchNext}
        onChange={setPrefetchNext}
      />

      <ul
        className={cn(
          "space-y-2 transition-opacity",
          isPlaceholderData && "opacity-50"
        )}
      >
        {isPending
          ? Array.from({ length: PAGE_SIZE }, (_, index) => (
              <Skeleton key={index} className="h-10" />
            ))
          : data?.items.map((todo) => <TodoRow key={todo.id} todo={todo} />)}
      </ul>

      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          <ChevronLeft />
        </Button>
        <span className="text-sm">
          Page {page} / {data?.totalPages ?? "…"}
        </span>
        <Button
          size="icon"
          variant="outline"
          disabled={isPlaceholderData || !hasNextPage}
          onClick={() => setPage((prev) => prev + 1)}
        >
          <ChevronRight />
        </Button>
        {isFetching && <Badge variant="info">fetching…</Badge>}
        {isPlaceholderData && <Badge variant="warning">placeholder data</Badge>}
      </div>

      <RequestLog filter="/api/todos" />
    </>
  );
};

export default PaginationDemo;
