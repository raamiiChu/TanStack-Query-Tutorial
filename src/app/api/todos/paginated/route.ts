import { z } from "zod";

import { withApi } from "@/server/api";
import { prisma } from "@/server/db";

const pageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(5),
});

export const GET = withApi(async (request) => {
  const { searchParams } = new URL(request.url);
  const { page, pageSize } = pageQuerySchema.parse({
    page: searchParams.get("page") ?? undefined,
    pageSize: searchParams.get("pageSize") ?? undefined,
  });

  const [items, total] = await prisma.$transaction([
    prisma.todo.findMany({
      orderBy: { id: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.todo.count(),
  ]);

  return Response.json({
    items,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  });
});
