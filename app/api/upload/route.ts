import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/auth";
import { validateSecureFileUpload } from "@/lib/security";

// POST /api/upload - Secure Reusable File Upload endpoint
export async function POST(req: Request) {
  try {
    // 1. Authentication Shield (NextAuth v5 Middleware Check)
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized: Akses ditolak." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File gambar tidak ditemukan." }, { status: 400 });
    }

    // 2. Global Reusable Security Check (Magic Bytes + Anti Script Injection + Max 5MB)
    const securityCheck = await validateSecureFileUpload(file, {
      maxSizeMB: 5,
      allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"],
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"],
    });

    if (!securityCheck.isValid || !securityCheck.buffer) {
      return NextResponse.json(
        { error: securityCheck.error || "File ditolak oleh sistem keamanan." },
        { status: 400 }
      );
    }

    // 3. Private Storage Directory Outside 'public' Folder (Protected Local Storage)
    const privateStorageDir = path.join(process.cwd(), "storage", "private", "uploads");
    await mkdir(privateStorageDir, { recursive: true });

    // 4. Safe random filename with verified real extension (Prevents Path Traversal & Double Extension attack)
    const ext = securityCheck.detectedExt || ".jpg";
    const filename = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 10)}${ext}`;
    const filePath = path.join(privateStorageDir, filename);

    // 5. Write verified binary buffer securely
    await writeFile(filePath, securityCheck.buffer);

    // Protected API Route URL
    const secureUrl = `/api/files/${filename}`;
    return NextResponse.json({ url: secureUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Gagal mengunggah file ke direktori privat." }, { status: 500 });
  }
}
