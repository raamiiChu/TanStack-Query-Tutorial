import { z } from "zod";

import { withApi } from "@/server/api";
import { prisma } from "@/server/db";

const listQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(5),
});

const createTodoSchema = z.object({
  title: z.string().trim().min(1).max(100),
});

export const GET = withApi(async (request) => {
  const { searchParams } = new URL(request.url);
  const { limit } = listQuerySchema.parse({
    limit: searchParams.get("limit") ?? undefined,
  });

  const todos = await prisma.todo.findMany({
    orderBy: { id: "desc" },
    take: limit,
  });

  return Response.json(todos);
});

export const POST = withApi(async (request) => {
  const data = createTodoSchema.parse(await request.json());
  const todo = await prisma.todo.create({ data });

  // Return the created entity so the client can write it straight into its cache.
  return Response.json(todo, { status: 201 });
});
