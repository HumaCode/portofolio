import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { ulid } from "ulid";

import nodemailer from "nodemailer";

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

      // Ambil detail pesan dari database
      const existingMsg = await db.inboxMessage.findUnique({ where: { id } });
      if (!existingMsg) {
        return NextResponse.json({ error: "Pesan tidak ditemukan." }, { status: 404 });
      }

      // Tandai pesan sudah dibaca di DB
      await db.inboxMessage.update({
        where: { id },
        data: { isRead: true },
      });

      // Cek apakah kredensial SMTP Gmail/Email sudah terpasang di .env
      const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
      const smtpPort = Number(process.env.SMTP_PORT) || 465;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      if (smtpUser && smtpPass) {
        try {
          const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          });

          await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || "Portfolio Admin"}" <${smtpUser}>`,
            to: existingMsg.email,
            subject: `Re: ${existingMsg.subject}`,
            text: replyText,
            html: `
              <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; rounded: 10px;">
                <h3 style="color: #e11d48;">Balasan Pesan Portofolio</h3>
                <p>Halo <strong>${existingMsg.senderName}</strong>,</p>
                <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #e11d48; margin: 15px 0;">
                  <p style="margin: 0; white-space: pre-wrap;">${replyText}</p>
                </div>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #777;">
                  <strong>Subjek Asal:</strong> ${existingMsg.subject}<br />
                  <strong>Pesan Anda:</strong> "${existingMsg.message}"
                </p>
              </div>
            `,
          });
          console.log(`✉️ Email balasan berhasil dikirim ke ${existingMsg.email}`);
          return NextResponse.json({ success: true, message: `Balasan email berhasil dikirim ke ${existingMsg.email}!` });
        } catch (emailErr) {
          console.error("Failed to send email via SMTP:", emailErr);
          return NextResponse.json({
            success: true,
            warning: "Pesan ditandai dibaca di DB, tetapi SMTP gagal mengirim email (cek kredensial SMTP_USER & SMTP_PASS di .env).",
          });
        }
      }

      return NextResponse.json({
        success: true,
        message: "Status pesan diubah ke 'Sudah Dibaca'. (Isi SMTP_USER & SMTP_PASS di .env untuk pengiriman email sungguhan)",
      });
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
