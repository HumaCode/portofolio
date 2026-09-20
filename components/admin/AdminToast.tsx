"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
    id: string;
    text: string;
    type?: "success" | "info" | "error";
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

    const isSuccess = toast.type === "success" || !toast.type;
    const isError = toast.type === "error";

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
            <div
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl ${
                    isSuccess
                        ? "bg-[#13131b]/95 border-emerald-500/40 text-white shadow-emerald-950/40"
                        : isError
                        ? "bg-[#13131b]/95 border-rose-500/40 text-white shadow-rose-950/40"
                        : "bg-[#13131b]/95 border-cyan-500/40 text-white shadow-cyan-950/40"
                }`}
            >
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                {isError && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                {!isSuccess && !isError && <Info className="w-5 h-5 text-cyan-400 shrink-0" />}

                <span className="text-xs font-semibold">{toast.text}</span>

                <button
                    onClick={onDismiss}
                    className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors ml-2"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
};