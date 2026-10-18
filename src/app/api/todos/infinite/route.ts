import { z } from "zod";

import { withApi } from "@/server/api";
import { prisma } from "@/server/db";

const cursorQuerySchema = z.object({
  cursor: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const GET = withApi(async (request) => {
  const { searchParams } = new URL(request.url);
  const { cursor, limit } = cursorQuerySchema.parse({
    cursor: searchParams.get("cursor") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  });

  // Fetch one extra row to know whether another page exists.
  const rows = await prisma.todo.findMany({
    orderBy: { id: "asc" },
    take: limit + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
  });

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;

  return Response.json({
    items,
    nextCursor: hasMore ? items[items.length - 1].id : null,
  });
});
