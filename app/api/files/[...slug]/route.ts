import { NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

// GET /api/files/...slug - Secure File Serving Stream with Content-Type & Caching
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const slugParts = resolvedParams.slug || [];
    
    if (slugParts.length === 0) {
      return NextResponse.json({ error: "File tidak ditentukan." }, { status: 400 });
    }

    // Security Check: Prevent directory traversal attack (e.g. ../../.env)
    const safePaths = slugParts.map((part) => path.basename(part));
    const filePath = path.join(process.cwd(), "storage", "private", "uploads", ...safePaths);

    try {
      await stat(filePath);
    } catch {
      return NextResponse.json({ error: "File tidak ditemukan." }, { status: 404 });
    }

    const sanitizedFilename = safePaths[safePaths.length - 1];

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
