import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import { PrismaClient } from "../src/generated/prisma/client";
import { seedDatabase } from "../src/server/seed-data";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  }),
});

seedDatabase(prisma)
  .then(() => console.log("Seeded database"))
  .finally(() => prisma.$disconnect());
