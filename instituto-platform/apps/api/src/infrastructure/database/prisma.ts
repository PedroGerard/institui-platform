import { PrismaClient } from "@prisma/client";
import "../../config/env.js";

export const prisma = new PrismaClient();
