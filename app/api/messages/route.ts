import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { ulid } from "ulid";

// GET /api/messages - Retrieve all inbox messages for Admin
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await db.inboxMessage.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Failed to fetch inbox messages:", error);
    return NextResponse.json({ error: "Gagal mengambil pesan kontak." }, { status: 500 });
  }
}

// POST /api/messages - Public Contact Form submission or Reply action
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, senderName, senderCompany, email, subject, message, id, replyText } = body;

    // Aksi 1: Kirim Balasan dari Dashboard Admin
    if (action === "reply") {
      const session = await auth();
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!id || !replyText) {
        return NextResponse.json({ error: "ID pesan dan isi balasan wajib diisi." }, { status: 400 });
      }

      // Tandai pesan sudah dibaca di DB
      await db.inboxMessage.update({
        where: { id },
        data: { isRead: true },
      });

      // Catatan: Jika disetup SMTP/Nodemailer, email balasan dikirimkan di sini
      return NextResponse.json({ success: true, message: "Balasan berhasil dikirim!" });
    }

    // Aksi 2: Form Kontak Publik (Submit Pesan Baru dari Pengunjung)
    if (!senderName || !email || !subject || !message) {
      return NextResponse.json({ error: "Mohon lengkapi semua field formulir." }, { status: 400 });
    }

    // Buat inisial nama pengirim (misal: "Budi Santoso" -> "BS")
    const names = senderName.trim().split(" ");
    const initials =
      names.length > 1
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : senderName.substring(0, 2).toUpperCase();

    const colors = ["crimson", "cyan", "emerald", "neutral"];
    const accentColor = colors[Math.floor(Math.random() * colors.length)];

    const newMessage = await db.inboxMessage.create({
      data: {
        id: ulid(),
        senderName: senderName.trim(),
        senderCompany: senderCompany?.trim() || null,
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        initials,
        accentColor,
        isRead: false,
      },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Failed to process message:", error);
    return NextResponse.json({ error: "Gagal memproses pesan." }, { status: 500 });
  }
}

// PATCH /api/messages - Toggle Read status or Mark All Read
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, markAllRead } = body;

    if (markAllRead) {
      await db.inboxMessage.updateMany({
        where: { isRead: false },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true });
    }

    if (id) {
      const existing = await db.inboxMessage.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: "Pesan tidak ditemukan." }, { status: 404 });
      }

      const updated = await db.inboxMessage.update({
        where: { id },
        data: { isRead: !existing.isRead },
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Payload tidak valid." }, { status: 400 });
  } catch (error) {
    console.error("Failed to update message status:", error);
    return NextResponse.json({ error: "Gagal memperbarui status pesan." }, { status: 500 });
  }
}

// DELETE /api/messages - Delete message by ID
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID pesan diperlukan." }, { status: 400 });
    }

    await db.inboxMessage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete message:", error);
    return NextResponse.json({ error: "Gagal menghapus pesan." }, { status: 500 });
  }
}
