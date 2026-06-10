import { PrismaClient } from "@prisma/client";

process.env.DATABASE_URL ||= "postgresql://institui:institui@localhost:5432/institui";

export const prisma = new PrismaClient();
