import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaInstance: PrismaClient | undefined;
}

export const isDatabaseConfigured = Boolean(
  process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.includes("[YOUR-PASSWORD]") &&
    !process.env.DATABASE_URL.includes("[PASSWORD]")
);

/**
 * Returns the PrismaClient instance if configured, or null for local fallback.
 */
export function getPrismaClient(): PrismaClient | null {
  if (!isDatabaseConfigured) return null;

  if (!global.prismaInstance) {
    global.prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  return global.prismaInstance;
}

export const prisma = getPrismaClient();
