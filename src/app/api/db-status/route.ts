import { NextResponse } from "next/server";
import { getPrismaClient, isDatabaseConfigured } from "@/lib/prisma";

export async function GET() {
  try {
    if (!isDatabaseConfigured) {
      return NextResponse.json({
        status: "local_storage_active",
        databaseConfigured: false,
        activeEngine: "Persistent Local JSON Engine (data/formpulse.json)",
        message:
          "FormPulse is operating smoothly using the persistent local JSON data engine.",
        instructions:
          "To connect live PostgreSQL or Supabase, provide DATABASE_URL in your .env file and run `npx prisma db push`.",
      });
    }

    const prisma = await getPrismaClient();
    if (!prisma) {
      return NextResponse.json({
        status: "client_unavailable",
        databaseConfigured: true,
        message:
          "DATABASE_URL is set, but Prisma Client could not be initialized.",
      });
    }

    // Ping PostgreSQL
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "connected",
      databaseConfigured: true,
      provider: "postgresql",
      message: "Successfully connected to PostgreSQL database via Prisma.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "connection_error",
        databaseConfigured: true,
        error: error instanceof Error ? error.message : "Unknown database error",
        message:
          "DATABASE_URL is set but could not connect to PostgreSQL. Please check credentials or network connectivity.",
      },
      { status: 500 }
    );
  }
}
