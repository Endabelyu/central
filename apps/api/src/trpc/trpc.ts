import { initTRPC } from "@trpc/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
export const router = t.router;
