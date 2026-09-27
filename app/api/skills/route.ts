import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { ulid } from "ulid";

// GET /api/skills - Retrieve all skills from DB
export async function GET() {
  try {
    const skills = await db.skill.findMany({
      include: {
        skillCategory: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: [
        { percentage: "desc" },
        { createdAt: "asc" },
      ],
    });
    return NextResponse.json(skills);
  } catch (error) {
    console.error("Failed to fetch skills:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data keahlian dari database." },
      { status: 500 }
    );
  }
}

// POST /api/skills - Create or Update skill (Protected)
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, percentage, category, categoryId, color, strokeColor } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Nama keahlian wajib diisi." }, { status: 400 });
    }

    const parsedPercentage = Math.min(100, Math.max(0, parseInt(percentage, 10) || 0));

    let finalCategoryId: string | null = categoryId || null;
    let finalCategoryName = (category || "General").trim();

    if (finalCategoryId) {
      const foundCat = await db.skillCategory.findUnique({
        where: { id: finalCategoryId },
        select: { id: true, name: true },
      });
      if (foundCat) {
        finalCategoryName = foundCat.name;
      }
    } else if (finalCategoryName) {
      const categorySlug = finalCategoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const categoryRecord = await db.skillCategory.upsert({
        where: { slug: categorySlug },
        update: { name: finalCategoryName },
        create: {
          id: ulid(),
          name: finalCategoryName,
          slug: categorySlug,
        },
        select: { id: true, name: true },
      });
      finalCategoryId = categoryRecord.id;
      finalCategoryName = categoryRecord.name;
    }

    if (id && id.length > 5) {
      const updatedSkill = await db.skill.update({
        where: { id },
        data: {
          name: name.trim(),
          percentage: parsedPercentage,
          category: finalCategoryName,
          categoryId: finalCategoryId,
          color: color || "from-rose-500 to-red-600",
          strokeColor: strokeColor || "#f43f5e",
        },
      });
      return NextResponse.json(updatedSkill);
    } else {
      const newSkill = await db.skill.create({
        data: {
          id: ulid(),
          name: name.trim(),
          percentage: parsedPercentage,
          category: finalCategoryName,
          categoryId: finalCategoryId,
          color: color || "from-rose-500 to-red-600",
          strokeColor: strokeColor || "#f43f5e",
        },
      });
      return NextResponse.json(newSkill, { status: 201 });
    }
  } catch (error) {
    console.error("Failed to save skill:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data keahlian ke database." },
      { status: 500 }
    );
  }
}

// DELETE /api/skills - Remove skill by id (Protected)
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Parameter ID wajib disertakan." }, { status: 400 });
    }

    await db.skill.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Skill berhasil dihapus." });
  } catch (error) {
    console.error("Failed to delete skill:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data keahlian dari database." },
      { status: 500 }
    );
  }
}
