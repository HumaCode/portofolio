"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, Trash2, Send, Clock, Building } from "lucide-react";
import { InboxMessage } from "@/data/portfolio";

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
                    <div className="p-12 text-center text-zinc-400">
                        <Mail className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                        <p className="text-sm font-medium">Tidak ada pesan dalam kategori ini.</p>
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
                                <a
                                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-rose-600/20"
                                >
                                    <Send className="w-3 h-3" /> Balas Email
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
        </div>
    );
};

