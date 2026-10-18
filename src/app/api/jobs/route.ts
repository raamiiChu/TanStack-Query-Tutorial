import { z } from "zod";

import { withApi } from "@/server/api";
import { prisma } from "@/server/db";

const createJobSchema = z.object({
  name: z.string().trim().min(1).max(100),
  durationMs: z.number().int().min(1_000).max(60_000).default(8_000),
});

export const POST = withApi(async (request) => {
  const data = createJobSchema.parse(await request.json());
  const job = await prisma.job.create({ data });

  return Response.json(job, { status: 201 });
});
