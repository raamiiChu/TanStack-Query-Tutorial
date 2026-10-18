import type { PrismaClient } from "@/generated/prisma/client";

const TITLES = [
  "Read the TanStack Query docs",
  "Set up QueryClientProvider",
  "Design a query key factory",
  "Learn staleTime vs gcTime",
  "Try optimistic updates",
  "Build an infinite list",
  "Add Prisma to the project",
  "Write a cursor-based API",
  "Prefetch on hover",
  "Poll a long-running job",
  "Wrap queries with Suspense",
  "Handle errors globally",
  "Review the eslint plugin rules",
  "Remove useEffect fetching",
  "Prepare the engineering sharing",
];

export const SEED_TODO_COUNT = 60;

export const seedDatabase = async (prisma: PrismaClient) => {
  await prisma.$transaction([
    prisma.todo.deleteMany(),
    prisma.job.deleteMany(),
    prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name IN ('Todo', 'Job')`,
    prisma.todo.createMany({
      data: Array.from({ length: SEED_TODO_COUNT }, (_, index) => ({
        title: `#${index + 1} ${TITLES[index % TITLES.length]}`,
        completed: index % 3 === 0,
      })),
    }),
  ]);
};
