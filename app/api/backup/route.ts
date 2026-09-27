import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const [profile, projects, categories, skills, skillCategories, certificates, messages] = await Promise.all([
      db.profile.findFirst(),
      db.project.findMany({ include: { category: true } }),
      db.projectCategory.findMany(),
      db.skill.findMany(),
      db.skillCategory.findMany(),
      db.certificate.findMany(),
      db.inboxMessage.findMany(),
    ]);

    const backupData = {
      meta: {
        exportedAt: new Date().toISOString(),
        version: "1.0",
        appName: "Portfolio CMS Admin",
      },
      data: {
        profile,
        projects,
        categories,
        skills,
        skillCategories,
        certificates,
        messages,
      },
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const filename = `portfolio_backup_${new Date().toISOString().split("T")[0]}.json`;

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Backup failed:", error);
    return NextResponse.json({ error: "Gagal membuat file backup database." }, { status: 500 });
  }
}
