import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { ulid } from "ulid";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

// GET /api/skill-categories - Fetch all skill categories with skill count
export async function GET() {
  try {
    const categories = await db.skillCategory.findMany({
      include: {
        _count: {
          select: { skills: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const formatted = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "-",
      skillCount: cat._count.skills,
      createdAt: cat.createdAt,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Failed to fetch skill categories:", error);
    return NextResponse.json({ error: "Gagal mengambil daftar kategori skill." }, { status: 500 });
  }
}

// POST /api/skill-categories - Create or Update skill category (Protected)
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, description } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Nama kategori skill wajib diisi." }, { status: 400 });
    }

    const trimmedName = name.trim();
    const generatedSlug = slugify(trimmedName);

    if (id) {
      // UPDATE EXISTING CATEGORY
      const existingOther = await db.skillCategory.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            { OR: [{ name: trimmedName }, { slug: generatedSlug }] },
          ],
        },
      });

      if (existingOther) {
        return NextResponse.json({ error: "Kategori lain dengan nama/slug ini sudah ada." }, { status: 400 });
      }

      const updatedCat = await db.skillCategory.update({
        where: { id },
        data: {
          name: trimmedName,
          slug: generatedSlug,
          description: description?.trim() || null,
        },
      });

      // Synchronize category string in skills that belong to this category
      await db.skill.updateMany({
        where: { categoryId: id },
        data: { category: trimmedName },
      });

      return NextResponse.json(updatedCat);
    } else {
      // CREATE NEW CATEGORY
      const existing = await db.skillCategory.findFirst({
        where: {
          OR: [{ name: trimmedName }, { slug: generatedSlug }],
        },
      });

      if (existing) {
        return NextResponse.json({ error: "Kategori skill dengan nama/slug ini sudah ada." }, { status: 400 });
      }

      const newCat = await db.skillCategory.create({
        data: {
          id: ulid(),
          name: trimmedName,
          slug: generatedSlug,
          description: description?.trim() || null,
        },
      });

      return NextResponse.json(newCat, { status: 201 });
    }
  } catch (error) {
    console.error("Failed to save skill category:", error);
    return NextResponse.json({ error: "Gagal menyimpan data kategori skill." }, { status: 500 });
  }
}

// DELETE /api/skill-categories - Delete category by ID
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID kategori wajib dikirim." }, { status: 400 });
    }

    // Set skills that belonged to this category to have categoryId null
    await db.skill.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    });

    await db.skillCategory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete skill category:", error);
    return NextResponse.json({ error: "Gagal menghapus kategori skill." }, { status: 500 });
  }
}
