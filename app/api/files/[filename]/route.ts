import { NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

// GET /api/files/[filename] - Secure File Serving Stream with Content-Type & Caching
export async function GET(
  req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Security Check: Prevent directory traversal attack (e.g., ../../.env)
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(process.cwd(), "storage", "private", "uploads", sanitizedFilename);

    try {
      await stat(filePath);
    } catch {
      return NextResponse.json({ error: "File tidak ditemukan." }, { status: 404 });
    }

    // Read file buffer
    const fileBuffer = await readFile(filePath);

    // Determine MIME Content-Type
    const ext = path.extname(sanitizedFilename).toLowerCase();
    let contentType = "image/jpeg";
    if (ext === ".png") contentType = "image/png";
    else if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".gif") contentType = "image/gif";
    else if (ext === ".svg") contentType = "image/svg+xml";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("File serve error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem saat membaca file." }, { status: 500 });
  }
}
