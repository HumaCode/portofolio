"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, Trash2, Send, Clock, Building, Loader2 } from "lucide-react";
import { InboxMessage } from "@/data/portfolio";
import { Modal } from "../Modal";

interface Props {
    messages: InboxMessage[];
    onToggleRead: (id: string) => void;
    onDeleteMessage: (id: string) => void;
    onMarkAllRead: () => void;
}

export const AdminInboxManager: React.FC<Props> = ({
    messages,
    onToggleRead,
    onDeleteMessage,
    onMarkAllRead,
}) => {
    const [filter, setFilter] = useState<"all" | "unread">("all");
    const [replyModalMsg, setReplyModalMsg] = useState<InboxMessage | null>(null);
    const [replyText, setReplyText] = useState("");
    const [sendingReply, setSendingReply] = useState(false);

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyModalMsg || !replyText.trim()) return;

        try {
            setSendingReply(true);
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "reply",
                    id: replyModalMsg.id,
                    replyText: replyText.trim(),
                }),
            });

            if (res.ok) {
                onToggleRead(replyModalMsg.id);
                setReplyModalMsg(null);
                setReplyText("");
                alert(`Balasan berhasil dikirimkan ke ${replyModalMsg.email}!`);
            }
        } catch (err) {
            console.error("Gagal mengirim balasan", err);
        } finally {
            setSendingReply(false);
        }
    };

    const unreadCount = messages.filter((m) => !m.isRead).length;

    const filteredMessages =
        filter === "unread" ? messages.filter((m) => !m.isRead) : messages;

    return (
        <div className="rounded-2xl bg-[#1b1b23] border border-white/[0.08] shadow-2xl overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <Mail className="w-5 h-5 text-rose-500" />
                        <span>Inbox Pesan Kontak Masuk</span>
                        {unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold">
                                {unreadCount} Baru
                            </span>
                        )}
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                        Pesan dan inquiry kolaborasi dari form kontak publik
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-[#13131b] p-1 rounded-xl border border-white/[0.06] text-xs">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-3 py-1 rounded-lg transition-colors ${
                                filter === "all"
                                    ? "bg-[#1f1f27] text-white font-semibold"
                                    : "text-zinc-400 hover:text-zinc-200"
                            }`}
                        >
                            Semua ({messages.length})
                        </button>
                        <button
                            onClick={() => setFilter("unread")}
                            className={`px-3 py-1 rounded-lg transition-colors ${
                                filter === "unread"
                                    ? "bg-rose-600/20 text-rose-300 font-semibold"
                                    : "text-zinc-400 hover:text-zinc-200"
                            }`}
                        >
                            Belum Dibaca ({unreadCount})
                        </button>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={onMarkAllRead}
                            className="px-3 py-1.5 rounded-xl bg-[#13131b] hover:bg-[#1f1f27] border border-white/[0.08] text-xs text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
                        >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="hidden sm:inline">Tandai Semua Dibaca</span>
                        </button>
                    )}
                </div>
            </div>
            <div className="divide-y divide-white/[0.04]">
                {filteredMessages.length === 0 ? (
                    <div className="py-16 px-6 text-center text-zinc-400">
                        <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-rose-950/40 border border-rose-900/30 flex items-center justify-center text-rose-400 shadow-inner">
                                <Mail className="w-6 h-6 text-rose-500 animate-pulse" />
                            </div>
                            <h3 className="text-sm font-bold text-zinc-200">
                                {filter === "unread" ? "Tidak Ada Pesan Belum Dibaca" : "Inbox Pesan Masih Kosong"}
                            </h3>
                            <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
                                {filter === "unread"
                                    ? "Semua pesan kontak yang masuk sudah selesai Anda baca."
                                    : "Belum ada pesan kontak dari pengunjung portofolio. Pesan baru dari form publik akan otomatis muncul di sini."}
                            </p>
                            {filter === "unread" && (
                                <button
                                    onClick={() => setFilter("all")}
                                    className="mt-2 px-3 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-medium transition-colors"
                                >
                                    Tampilkan Semua Pesan
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    filteredMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`p-5 sm:p-6 transition-all hover:bg-[#1f1f27]/60 relative ${
                                !msg.isRead
                                    ? "bg-rose-950/10 border-l-4 border-l-rose-500"
                                    : "border-l-4 border-l-transparent"
                            }`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                            msg.accentColor === "cyan"
                                                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                                                : msg.accentColor === "emerald"
                                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                : "bg-rose-600/20 text-rose-400 border border-rose-500/30"
                                        }`}
                                    >
                                        {msg.initials}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="font-bold text-sm text-white">{msg.senderName}</h4>
                                            {msg.senderCompany && (
                                                <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 bg-[#13131b] px-2 py-0.5 rounded border border-white/[0.06]">
                                                    <Building className="w-3 h-3 text-zinc-500" />
                                                    {msg.senderCompany}
                                                </span>
                                            )}
                                            {!msg.isRead && (
                                                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold font-mono">
                                                    BARU
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs text-zinc-400 mt-0.5">{msg.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                                    <Clock className="w-3 h-3 text-zinc-500" />
                                    <span>{msg.timeAgo}</span>
                                </div>
                            </div>

                            <div className="mt-3.5 sm:pl-13 space-y-1.5">
                                <h5 className="font-semibold text-xs text-rose-300">{msg.subject}</h5>
                                <p className="text-xs text-zinc-300 leading-relaxed">{msg.message}</p>
                            </div>

                            <div className="mt-4 sm:pl-13 flex items-center gap-2 flex-wrap">
                                <button
                                    onClick={() => setReplyModalMsg(msg)}
                                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-rose-600/20"
                                >
                                    <Send className="w-3 h-3" /> Balas Langsung
                                </button>

                                <a
                                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                                    className="px-3 py-1.5 rounded-lg bg-[#13131b] hover:bg-[#252532] text-zinc-300 text-xs font-medium border border-white/[0.08] flex items-center gap-1.5 transition-colors"
                                >
                                    Buka Mail App
                                </a>

                                <button
                                    onClick={() => onToggleRead(msg.id)}
                                    className="px-3 py-1.5 rounded-lg bg-[#13131b] hover:bg-[#292932] text-zinc-300 text-xs font-medium border border-white/[0.08] flex items-center gap-1.5 transition-colors"
                                >
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>{msg.isRead ? "Tandai Belum Dibaca" : "Tandai Dibaca"}</span>
                                </button>

                                <button
                                    onClick={() => onDeleteMessage(msg.id)}
                                    className="p-1.5 rounded-lg bg-[#13131b] hover:bg-red-600/20 hover:text-red-400 text-zinc-400 border border-white/[0.06] transition-colors"
                                    title="Hapus Pesan"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Reply Balas Email Direct */}
            <Modal
                isOpen={Boolean(replyModalMsg)}
                onClose={() => {
                    setReplyModalMsg(null);
                    setReplyText("");
                }}
                title={`Balas Email ke ${replyModalMsg?.senderName}`}
                subtitle={`Tujuan: ${replyModalMsg?.email}`}
                icon={<Send className="w-5 h-5 text-rose-500" />}
                size="xl"
            >
                <form onSubmit={handleSendReply} className="space-y-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#13131b] border border-white/[0.06] space-y-1">
                        <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">Subjek Pesan:</span>
                        <p className="font-semibold text-white">{replyModalMsg?.subject}</p>
                        <p className="text-[11px] text-zinc-400 leading-relaxed italic pt-1">
                            "{replyModalMsg?.message}"
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Pesan Balasan Anda</label>
                        <textarea
                            rows={5}
                            required
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Halo ${replyModalMsg?.senderName},\n\nTerima kasih atas tawaran kerjasama Anda...`}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131b] border border-white/[0.1] text-white focus:outline-none focus:border-rose-500 transition-all text-xs leading-relaxed"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.06]">
                        <button
                            type="button"
                            onClick={() => {
                                setReplyModalMsg(null);
                                setReplyText("");
                            }}
                            className="px-4 py-2 rounded-xl bg-[#13131b] hover:bg-[#252532] text-xs font-semibold text-zinc-300 border border-white/[0.08]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={sendingReply || !replyText.trim()}
                            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-xs font-bold text-white shadow-lg shadow-rose-600/30 flex items-center gap-1.5 transition-all"
                        >
                            {sendingReply ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Mengirim Balasan...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Kirim Balasan</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

