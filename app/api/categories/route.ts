import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { ulid } from "ulid";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

// GET /api/categories - Fetch all categories with project count
export async function GET() {
  try {
    const categories = await db.projectCategory.findMany({
      include: {
        _count: {
          select: { projects: true },
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
      projectCount: cat._count.projects,
      createdAt: cat.createdAt,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json({ error: "Gagal mengambil daftar kategori." }, { status: 500 });
  }
}

// POST /api/categories - Create or Update category (Protected)
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, description } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Nama kategori wajib diisi." }, { status: 400 });
    }

    const trimmedName = name.trim();
    const generatedSlug = slugify(trimmedName);

    if (id) {
      // UPDATE EXISTING CATEGORY
      const existingOther = await db.projectCategory.findFirst({
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

      const updatedCat = await db.projectCategory.update({
        where: { id },
        data: {
          name: trimmedName,
          slug: generatedSlug,
          description: description?.trim() || null,
        },
      });

      return NextResponse.json(updatedCat);
    } else {
      // CREATE NEW CATEGORY
      const existing = await db.projectCategory.findFirst({
        where: {
          OR: [{ name: trimmedName }, { slug: generatedSlug }],
        },
      });

      if (existing) {
        return NextResponse.json({ error: "Kategori dengan nama/slug ini sudah ada." }, { status: 400 });
      }

      const newCat = await db.projectCategory.create({
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
    console.error("Failed to save category:", error);
    return NextResponse.json({ error: "Gagal menyimpan data kategori." }, { status: 500 });
  }
}

// DELETE /api/categories - Delete category by ID
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

    await db.projectCategory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete category:", error);
    return NextResponse.json({ error: "Gagal menghapus kategori." }, { status: 500 });
  }
}
