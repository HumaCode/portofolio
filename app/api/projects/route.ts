import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { ulid } from "ulid";
import { unlink } from "fs/promises";
import path from "path";

// Helper function to safely delete local private storage file if exists
async function deleteLocalFile(imageUrl?: string | null) {
  if (!imageUrl || !imageUrl.startsWith("/api/files/")) return;
  try {
    const filename = path.basename(imageUrl);
    const filePath = path.join(process.cwd(), "storage", "private", "uploads", filename);
    await unlink(filePath);
    console.log(`🗑️ Successfully unlinked old file: ${filename}`);
  } catch (err) {
    // Ignore error if file doesn't exist
  }
}

// GET /api/projects - Retrieve all projects from MySQL (Optimized Selection & Single Query Eager Loading)
export async function GET() {
  try {
    const projects = await db.project.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        tags: true,
        imageUrl: true,
        codeUrl: true,
        demoUrl: true,
        isFeatured: true,
        isInternal: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedProjects = projects.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category?.name || "General",
      description: p.description,
      tags: Array.isArray(p.tags) ? p.tags : JSON.parse(String(p.tags || "[]")),
      imageUrl: p.imageUrl,
      codeUrl: p.codeUrl || undefined,
      demoUrl: p.demoUrl || undefined,
      isFeatured: p.isFeatured,
      isInternal: p.isInternal,
    }));

    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json({ error: "Gagal mengambil data proyek dari database." }, { status: 500 });
  }
}

// POST /api/projects - Create or Update project (Protected)
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, title, category, description, tags, imageUrl, codeUrl, demoUrl, isFeatured, isInternal } = body;

    // Find or create ProjectCategory via Upsert (Optimized Single Query)
    let categoryRecord = null;
    if (category) {
      const categorySlug = category
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      categoryRecord = await db.projectCategory.upsert({
        where: { slug: categorySlug },
        update: { name: category },
        create: {
          id: ulid(),
          name: category,
          slug: categorySlug,
        },
        select: { id: true },
      });
    }

    if (id && id.length > 5) {
      // Find existing project to check if thumbnail image changed
      const existingProject = await db.project.findUnique({
        where: { id },
        select: { imageUrl: true },
      });

      if (existingProject && existingProject.imageUrl !== imageUrl) {
        // Unlink old thumbnail file if it was stored locally
        await deleteLocalFile(existingProject.imageUrl);
      }

      // Update existing project
      const updated = await db.project.update({
        where: { id },
        data: {
          title,
          description,
          tags: tags || [],
          imageUrl,
          codeUrl: codeUrl || null,
          demoUrl: demoUrl || null,
          isFeatured: Boolean(isFeatured),
          isInternal: Boolean(isInternal),
          categoryId: categoryRecord?.id || null,
        },
      });
      return NextResponse.json(updated);
    } else {
      // Create new project
      const created = await db.project.create({
        data: {
          id: ulid(),
          title,
          description,
          tags: tags || [],
          imageUrl,
          codeUrl: codeUrl || null,
          demoUrl: demoUrl || null,
          isFeatured: Boolean(isFeatured),
          isInternal: Boolean(isInternal),
          categoryId: categoryRecord?.id || null,
        },
      });
      return NextResponse.json(created, { status: 201 });
    }
  } catch (error) {
    console.error("Failed to save project:", error);
    return NextResponse.json({ error: "Gagal menyimpan proyek ke database." }, { status: 500 });
  }
}

// DELETE /api/projects - Delete project by ID (Protected)
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID proyek diperlukan." }, { status: 400 });
    }

    // Find project first to delete its associated thumbnail file
    const targetProject = await db.project.findUnique({
      where: { id },
      select: { imageUrl: true },
    });
    
    if (targetProject) {
      await deleteLocalFile(targetProject.imageUrl);
    }

    await db.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json({ error: "Gagal menghapus proyek dari database." }, { status: 500 });
  }
}
