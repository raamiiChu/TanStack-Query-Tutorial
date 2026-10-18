"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-client";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: Error;
    queryMeta: { errorMessage?: string };
    mutationMeta: { errorMessage?: string };
  }
}

const MAX_RETRIES = 3;

const makeQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.meta?.errorMessage) {
          toast.error(query.meta.errorMessage, { description: error.message });
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (mutation.meta?.errorMessage) {
          toast.error(mutation.meta.errorMessage, {
            description: error.message,
          });
        }
      },
    }),
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          // 4xx won't succeed on retry, so fail fast.
          if (error instanceof ApiError && error.status < 500) return false;
          return failureCount < MAX_RETRIES;
        },
      },
    },
  });

let browserQueryClient: QueryClient | undefined;

const getQueryClient = () => {
  // Keep server renders isolated and reuse one client in the browser.
  if (typeof window === "undefined") return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
};

export const QueryProvider = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={getQueryClient()}>
    {children}
    <ReactQueryDevtools buttonPosition="bottom-right" />
  </QueryClientProvider>
);
