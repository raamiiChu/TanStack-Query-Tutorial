import { HttpError, idParamSchema, withApi } from "@/server/api";
import { prisma } from "@/server/db";

export const GET = withApi(
  async (_request, { params }: RouteContext<"/api/jobs/[id]">) => {
    const id = idParamSchema.parse((await params).id);
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) throw new HttpError(404, `Job ${id} not found`);

    // Progress is derived from elapsed time to mimic a background worker.
    const elapsed = Date.now() - job.createdAt.getTime();
    const progress = Math.min(
      100,
      Math.round((elapsed / job.durationMs) * 100)
    );

    return Response.json({
      ...job,
      progress,
      status: progress >= 100 ? "done" : "running",
    });
  }
);
