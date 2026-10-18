# TanStack Query Tutorial

An interactive tutorial site for an engineering sharing session on
**TanStack Query v5** (formerly React Query), aimed at developers who already use
it and want to go beyond the basics.

The site itself is the slide deck: every page explains one topic and has live
demos with a **Preview** / **Code** tab, where the code tab shows the actual
source file of the demo.

## Topics

| Section   | Pages                                                                  |
| --------- | ---------------------------------------------------------------------- |
| Basics    | Mental model (staleTime / gcTime, dedup), Query keys & `queryOptions`  |
| Mutations | `invalidateQueries` vs `setQueryData`, Optimistic updates (cache & UI) |
| Lists     | Pagination with `keepPreviousData`, `useInfiniteQuery` + cursor paging |
| Advanced  | Prefetching, Dependent & parallel queries, Polling, Suspense, Errors   |
| Backend   | Prisma + Next.js Route Handlers powering the demos                     |
| Wrap-up   | Common pitfalls, v4 → v5 migration cheatsheet                          |

## Tech stack

- [Next.js](https://nextjs.org) (App Router, Route Handlers)
- [TanStack Query v5](https://tanstack.com/query) + Devtools
- [Prisma ORM](https://www.prisma.io) with SQLite (`better-sqlite3` driver adapter)
- Tailwind CSS v4 + shadcn/ui

## Getting started

```bash
pnpm install        # also runs `prisma generate`
pnpm db:setup       # create dev.db and seed it
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
pnpm db:reset       # drop, migrate and reseed the database
pnpm db:studio      # browse the data with Prisma Studio
pnpm lint
pnpm format
```

## Demo tooling

- **Network simulator** (sidebar): adds latency and a random error rate to every
  API call. Route handlers read `?delay=<ms>` and `?fail=<0..1>`.
- **Request log** (under each demo): what actually hit the server, including
  cancelled requests.
- **Reset button** (on each demo): reseeds the database, clears the query cache
  and the request log.
- **TanStack Query Devtools**: bottom-right corner.

## Project structure

```
prisma/                  schema, migrations, seed
src/app/api/             Route Handlers (todos, jobs, reset)
src/app/<section>/       tutorial pages, demos live in _components/
src/features/            fetchers + query key factories / queryOptions
src/server/              Prisma client, API helpers, seed data
src/lib/                 api client, network simulator
```
