import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { ulid } from "ulid";

// GET /api/certificates - Retrieve all certificates from DB
export async function GET() {
  try {
    const certs = await db.certificate.findMany({
      orderBy: [
        { year: "desc" },
        { createdAt: "desc" },
      ],
    });
    return NextResponse.json(certs);
  } catch (error) {
    console.error("Failed to fetch certificates:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data sertifikat dari database." },
      { status: 500 }
    );
  }
}

// POST /api/certificates - Create or Update certificate (Protected)
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, title, issuer, year, verifyUrl, isVerified } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Judul sertifikat wajib diisi." }, { status: 400 });
    }
    if (!issuer || issuer.trim() === "") {
      return NextResponse.json({ error: "Penerbit/Institusi sertifikat wajib diisi." }, { status: 400 });
    }

    if (id && id.length > 5) {
      const updatedCert = await db.certificate.update({
        where: { id },
        data: {
          title: title.trim(),
          issuer: issuer.trim(),
          year: (year || new Date().getFullYear().toString()).trim(),
          verifyUrl: verifyUrl ? verifyUrl.trim() : null,
          isVerified: isVerified ?? true,
        },
      });
      return NextResponse.json(updatedCert);
    } else {
      const newCert = await db.certificate.create({
        data: {
          id: ulid(),
          title: title.trim(),
          issuer: issuer.trim(),
          year: (year || new Date().getFullYear().toString()).trim(),
          verifyUrl: verifyUrl ? verifyUrl.trim() : null,
          isVerified: isVerified ?? true,
        },
      });
      return NextResponse.json(newCert, { status: 201 });
    }
  } catch (error) {
    console.error("Failed to save certificate:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data sertifikat ke database." },
      { status: 500 }
    );
  }
}

// DELETE /api/certificates - Remove certificate by id (Protected)
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

    await db.certificate.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Sertifikat berhasil dihapus." });
  } catch (error) {
    console.error("Failed to delete certificate:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data sertifikat dari database." },
      { status: 500 }
    );
  }
}
