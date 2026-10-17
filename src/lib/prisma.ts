/**
 * Prisma Client Singleton & Database Connectivity Manager
 * Gracefully switches between PostgreSQL (when DATABASE_URL is provided)
 * and the local resilient storage engine (when offline/zero-config).
 */

export interface PrismaClientLike {
  $queryRaw: (query: TemplateStringsArray, ...values: unknown[]) => Promise<unknown>;
  form: {
    findMany: (args?: unknown) => Promise<unknown[]>;
    findUnique: (args?: unknown) => Promise<unknown | null>;
    create: (args: unknown) => Promise<unknown>;
    update: (args: unknown) => Promise<unknown>;
    delete: (args: unknown) => Promise<unknown>;
  };
  question: {
    findMany: (args?: unknown) => Promise<unknown[]>;
    create: (args: unknown) => Promise<unknown>;
  };
  submission: {
    findMany: (args?: unknown) => Promise<unknown[]>;
    create: (args: unknown) => Promise<unknown>;
    delete: (args: unknown) => Promise<unknown>;
  };
}

declare global {
  // eslint-disable-next-line no-var
  var prismaInstance: PrismaClientLike | undefined;
}

export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

/**
 * Returns the PrismaClient instance if configured, or null for local fallback.
 */
export async function getPrismaClient(): Promise<PrismaClientLike | null> {
  if (!isDatabaseConfigured) return null;

  try {
    if (!global.prismaInstance) {
      // Dynamic require prevents build-time failures before prisma generate is run
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { PrismaClient } = require("@prisma/client");
      global.prismaInstance = new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
      });
    }
    return global.prismaInstance || null;
  } catch (err) {
    console.warn("Prisma Client failed to load:", err);
    return null;
  }
}
