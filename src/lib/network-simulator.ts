import { useSyncExternalStore } from "react";

export type NetworkSettings = {
  delay: number;
  failRate: number;
};

export type RequestStatus = "pending" | "cancelled" | "error" | number;

export type RequestLogEntry = {
  id: number;
  method: string;
  path: string;
  status: RequestStatus;
  startedAt: number;
  duration?: number;
};

const MAX_LOG_ENTRIES = 50;

let settings: NetworkSettings = { delay: 600, failRate: 0 };
let requestLog: RequestLogEntry[] = [];
let nextRequestId = 1;

const listeners = new Set<() => void>();

// Requests can start while React is rendering (e.g. useSuspenseQuery), so
// notify subscribers after the current render instead of synchronously.
const emit = () =>
  queueMicrotask(() => listeners.forEach((listener) => listener()));

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getNetworkSettings = () => settings;

export const setNetworkSettings = (next: Partial<NetworkSettings>) => {
  settings = { ...settings, ...next };
  emit();
};

export const logRequestStart = (method: string, path: string) => {
  const entry: RequestLogEntry = {
    id: nextRequestId++,
    method,
    path,
    status: "pending",
    startedAt: Date.now(),
  };
  requestLog = [entry, ...requestLog].slice(0, MAX_LOG_ENTRIES);
  emit();
  return entry.id;
};

export const logRequestEnd = (id: number, status: RequestStatus) => {
  requestLog = requestLog.map((entry) =>
    entry.id === id
      ? { ...entry, status, duration: Date.now() - entry.startedAt }
      : entry
  );
  emit();
};

export const clearRequestLog = () => {
  requestLog = [];
  emit();
};

export const useNetworkSettings = () =>
  useSyncExternalStore(subscribe, getNetworkSettings, getNetworkSettings);

const EMPTY_LOG: RequestLogEntry[] = [];
const getRequestLog = () => requestLog;
const getEmptyLog = () => EMPTY_LOG;

export const useRequestLog = () =>
  useSyncExternalStore(subscribe, getRequestLog, getEmptyLog);
