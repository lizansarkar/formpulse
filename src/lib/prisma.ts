import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaInstance: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var prismaConfiguredUrl: string | undefined;
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

  // If DATABASE_URL changed during development or instance doesn't exist, instantiate
  if (!global.prismaInstance || global.prismaConfiguredUrl !== process.env.DATABASE_URL) {
    global.prismaConfiguredUrl = process.env.DATABASE_URL;
    global.prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  return global.prismaInstance;
}

export const prisma = getPrismaClient();
