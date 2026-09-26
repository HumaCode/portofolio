"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    size?: ModalSize;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    subtitle,
    icon,
    children,
    size = "2xl",
}) => {
    // Disable body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses: Record<ModalSize, string> = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
    };

    return (
        <div
            data-lenis-prevent
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto scrollbar-none"
        >
            <div
                className={`w-full ${sizeClasses[size]} rounded-2xl bg-[#16080c] border border-rose-900/40 shadow-[0_0_60px_rgba(225,29,72,0.2)] relative overflow-hidden my-auto text-left flex flex-col max-h-[90vh]`}
            >
                {/* Top Glowing Crimson Accent Line */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent" />

                {/* Modal Header */}
                <div className="p-5 sm:p-6 border-b border-white/[0.06] flex items-center justify-between gap-4 bg-[#14060a]/80 shrink-0">
                    <div className="flex items-center gap-3">
                        {icon && (
                            <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-800/50 flex items-center justify-center text-rose-400 shrink-0 shadow-md">
                                {icon}
                            </div>
                        )}
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                                {title}
                            </h3>
                            {subtitle && (
                                <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl bg-[#13131b] hover:bg-rose-900/30 text-zinc-400 hover:text-white border border-white/[0.08] transition-all"
                        aria-label="Tutup Modal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Modal Body */}
                <div
                    data-lenis-prevent
                    className="p-5 sm:p-6 overflow-y-auto flex-1 overscroll-contain scrollbar-none"
                >
                    {children}
                </div>
            </div>
        </div>
    );
};
