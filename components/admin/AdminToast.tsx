"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "info" | "warning" | "error" | "danger";

export interface ToastMessage {
    id: string;
    text: string;
    title?: string;
    type?: ToastType;
}

interface Props {
    toast: ToastMessage | null;
    onDismiss: () => void;
}

export const AdminToast: React.FC<Props> = ({ toast, onDismiss }) => {
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => {
            onDismiss();
        }, 4000);
        return () => clearTimeout(timer);
    }, [toast, onDismiss]);

    if (!toast) return null;

    const type = toast.type || "success";

    const getStyles = () => {
        switch (type) {
            case "success":
                return {
                    bg: "bg-[#0b1712]/95 border-emerald-500/50 text-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.25)]",
                    icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-pulse" />,
                    accent: "bg-emerald-500",
                    titleColor: "text-emerald-300",
                    defaultTitle: "Berhasil",
                };
            case "warning":
                return {
                    bg: "bg-[#1c1508]/95 border-amber-500/50 text-amber-100 shadow-[0_0_30px_rgba(245,158,11,0.25)]",
                    icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />,
                    accent: "bg-amber-500",
                    titleColor: "text-amber-300",
                    defaultTitle: "Peringatan",
                };
            case "danger":
            case "error":
                return {
                    bg: "bg-[#1b080c]/95 border-rose-600/60 text-rose-100 shadow-[0_0_35px_rgba(225,29,72,0.3)]",
                    icon: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 animate-pulse" />,
                    accent: "bg-rose-600",
                    titleColor: "text-rose-300",
                    defaultTitle: type === "danger" ? "Data Dihapus" : "Gagal / Error",
                };
            case "info":
            default:
                return {
                    bg: "bg-[#08131c]/95 border-cyan-500/50 text-cyan-100 shadow-[0_0_30px_rgba(6,182,212,0.25)]",
                    icon: <Info className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />,
                    accent: "bg-cyan-500",
                    titleColor: "text-cyan-300",
                    defaultTitle: "Informasi",
                };
        }
    };

    const style = getStyles();

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div
                className={`relative flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border backdrop-blur-2xl shadow-2xl overflow-hidden max-w-sm ${style.bg}`}
            >
                {/* Top accent glow line */}
                <div className={`absolute top-0 inset-x-0 h-[2px] ${style.accent}`} />

                {style.icon}

                <div className="flex flex-col min-w-0 pr-2">
                    <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${style.titleColor}`}>
                        {toast.title || style.defaultTitle}
                    </span>
                    <span className="text-xs font-semibold text-zinc-200 mt-0.5 leading-snug">
                        {toast.text}
                    </span>
                </div>

                <button
                    onClick={onDismiss}
                    className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all shrink-0 ml-auto"
                    aria-label="Tutup Notifikasi"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};