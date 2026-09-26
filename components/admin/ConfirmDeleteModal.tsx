"use client";

import React from "react";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    title?: string;
    message?: React.ReactNode;
    itemName?: string;
    itemType?: string;
    isLoading?: boolean;
    confirmButtonText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    isOpen,
    title = "Konfirmasi Hapus",
    message,
    itemName,
    itemType = "data",
    isLoading = false,
    confirmButtonText = "Ya, Hapus",
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    return (
        <div
            data-lenis-prevent
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
            <div
                data-lenis-prevent
                className="w-full max-w-md bg-[#16080c] border border-rose-900/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(225,29,72,0.25)] relative overflow-hidden animate-in zoom-in-95 duration-200"
            >
                {/* Top Crimson Accent Line */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>

                <div className="flex items-start gap-4 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400 shrink-0 shadow-lg">
                        <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white">{title}</h3>
                        {message ? (
                            <div className="text-xs text-zinc-400 mt-1 leading-relaxed">
                                {message}
                            </div>
                        ) : (
                            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                                Apakah Anda yakin ingin menghapus {itemType}{" "}
                                {itemName && (
                                    <span className="font-semibold text-rose-400">"{itemName}"</span>
                                )}
                                ? Tindakan ini tidak dapat dibatalkan.
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.06]">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-xl bg-[#13131b] hover:bg-[#252532] text-xs font-semibold text-zinc-300 hover:text-white border border-white/[0.08] transition-all disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg shadow-red-600/30 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Menghapus...</span>
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{confirmButtonText}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
