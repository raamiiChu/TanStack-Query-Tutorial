import { z } from "zod";

import { HttpError, idParamSchema, withApi } from "@/server/api";
import { prisma } from "@/server/db";

const updateTodoSchema = z.object({
  title: z.string().trim().min(1).max(100).optional(),
  completed: z.boolean().optional(),
});

const findTodoOrThrow = async (id: number) => {
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) throw new HttpError(404, `Todo ${id} not found`);
  return todo;
};

export const GET = withApi(
  async (_request, { params }: RouteContext<"/api/todos/[id]">) => {
    const id = idParamSchema.parse((await params).id);
    return Response.json(await findTodoOrThrow(id));
  }
);

export const PATCH = withApi(
  async (request, { params }: RouteContext<"/api/todos/[id]">) => {
    const id = idParamSchema.parse((await params).id);
    const data = updateTodoSchema.parse(await request.json());
    await findTodoOrThrow(id);

    const todo = await prisma.todo.update({ where: { id }, data });
    return Response.json(todo);
  }
);

export const DELETE = withApi(
  async (_request, { params }: RouteContext<"/api/todos/[id]">) => {
    const id = idParamSchema.parse((await params).id);
    await findTodoOrThrow(id);

    await prisma.todo.delete({ where: { id } });
    return new Response(null, { status: 204 });
  }
);
