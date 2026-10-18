import {
  getNetworkSettings,
  logRequestEnd,
  logRequestStart,
} from "@/lib/network-simulator";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

/**
 * Thin fetch wrapper used by every demo:
 * - throws `ApiError` on non-2xx so TanStack Query treats it as an error
 * - forwards the network simulator settings (`delay`, `fail`) to the API
 * - records each request in the request log shown next to the demos
 */
export const apiFetch = async <T>(
  path: string,
  { body, method = "GET", ...init }: ApiFetchOptions = {}
): Promise<T> => {
  const { delay, failRate } = getNetworkSettings();
  const url = new URL(path, window.location.origin);
  if (delay > 0) url.searchParams.set("delay", String(delay));
  if (failRate > 0 && !url.searchParams.has("fail")) {
    url.searchParams.set("fail", String(failRate));
  }

  const logId = logRequestStart(method, path);

  try {
    const response = await fetch(url, {
      ...init,
      method,
      headers: { "Content-Type": "application/json", ...init.headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    logRequestEnd(logId, response.status);

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        payload.message ?? response.statusText
      );
    }
    if (response.status === 204) return undefined as T;

    return (await response.json()) as T;
  } catch (error) {
    if (!(error instanceof ApiError)) {
      logRequestEnd(
        logId,
        error instanceof DOMException && error.name === "AbortError"
          ? "cancelled"
          : "error"
      );
    }
    throw error;
  }
};
