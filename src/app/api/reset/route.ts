import { prisma } from "@/server/db";
import { seedDatabase } from "@/server/seed-data";

export const POST = async () => {
  await seedDatabase(prisma);
  return new Response(null, { status: 204 });
};
