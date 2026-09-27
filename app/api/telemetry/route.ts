import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import os from "os";

export async function GET() {
  const startTime = Date.now();
  try {
    // Ping Database MySQL (Execute simple query)
    await db.$queryRaw`SELECT 1`;
    const dbPing = Date.now() - startTime;

    // Memory Usage calculation
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMemPercent = Math.round(((totalMem - freeMem) / totalMem) * 100);

    return NextResponse.json({
      dbPing: Math.max(1, dbPing),
      memoryUsagePercent: usedMemPercent,
      nodeVersion: process.version,
      uptimeSeconds: Math.floor(process.uptime()),
      databaseNode: "MySQL 8.x (Laragon Local)",
      framework: "Next.js 16 (React 19)",
      stylingToken: "Tailwind CSS v4",
    });
  } catch (error) {
    return NextResponse.json(
      {
        dbPing: 999,
        memoryUsagePercent: 0,
        error: "Gagal mengukur telemetry server.",
      },
      { status: 500 }
    );
  }
}
