"use client";

import React, { useEffect } from "react";
import { X, ZoomIn } from "lucide-react";

interface LightboxProps {
    isOpen: boolean;
    imageUrl: string | null;
    title?: string;
    onClose: () => void;
}

export const ImageLightbox: React.FC<LightboxProps> = ({
    isOpen,
    imageUrl,
    title,
    onClose,
}) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !imageUrl) return null;

    return (
        <div
            data-lenis-prevent
            onClick={onClose}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-lg animate-in fade-in duration-200 cursor-zoom-out"
        >
            {/* Top Bar Info & Close Button */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between z-10 pointer-events-auto"
            >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/[0.1] backdrop-blur-md">
                    <ZoomIn className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-semibold text-white truncate max-w-xs sm:max-w-md">
                        {title || "Pratinjau Gambar"}
                    </span>
                </div>

                <button
                    onClick={onClose}
                    className="p-2 rounded-xl bg-black/60 hover:bg-rose-900/40 text-zinc-300 hover:text-white border border-white/[0.1] backdrop-blur-md transition-all shadow-lg active:scale-95 cursor-pointer"
                    aria-label="Tutup Lightbox"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Main Lightbox Image Container */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-5xl max-h-[85vh] w-auto h-auto rounded-2xl overflow-hidden border border-rose-900/40 shadow-[0_0_80px_rgba(225,29,72,0.3)] bg-[#14060a] flex items-center justify-center group pointer-events-auto cursor-default"
            >
                <img
                    src={imageUrl}
                    alt={title || "Image Preview"}
                    className="max-w-full max-h-[85vh] object-contain select-none transition-transform duration-300"
                />
            </div>
        </div>
    );
};
