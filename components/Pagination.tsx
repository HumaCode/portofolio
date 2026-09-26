"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}) => {
  const effectiveTotalPages = Math.max(1, totalPages);

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];

    // Always include first page
    pages.push(1);

    const startPage = Math.max(2, currentPage - siblingCount);
    const endPage = Math.min(effectiveTotalPages - 1, currentPage + siblingCount);

    if (startPage > 2) {
      pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < effectiveTotalPages - 1) {
      pages.push("...");
    }

    // Always include last page if > 1
    if (effectiveTotalPages > 1) {
      pages.push(effectiveTotalPages);
    }

    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-white/[0.06] bg-[#13131b]/80 text-xs">
      <div className="text-zinc-400 font-mono text-[11px] flex items-center gap-1">
        <span>Menampilkan Halaman</span>
        <span className="text-rose-400 font-bold px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
          {currentPage}
        </span>
        <span>dari</span>
        <span className="text-white font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
          {effectiveTotalPages}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {/* Tombol Kurang / Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg bg-[#1b1b23] border border-white/[0.08] text-zinc-300 hover:text-white hover:bg-rose-600/20 hover:border-rose-500/40 disabled:opacity-30 disabled:pointer-events-none transition-all"
          aria-label="Halaman Sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Angka-angka Halaman */}
        <div className="flex items-center gap-1 mx-1">
          {pages.map((page, idx) => {
            if (typeof page === "string") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-zinc-500 font-mono select-none"
                >
                  ...
                </span>
              );
            }

            const isCurrent = page === currentPage;

            return (
              <button
                key={`page-${page}`}
                onClick={() => onPageChange(page)}
                className={`min-w-[32px] h-8 px-2 rounded-lg font-mono font-bold text-xs transition-all ${
                  isCurrent
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 border border-rose-500"
                    : "bg-[#1b1b23] text-zinc-400 hover:text-white hover:bg-[#252532] border border-white/[0.06]"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Tombol Tambah / Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= effectiveTotalPages}
          className="p-1.5 rounded-lg bg-[#1b1b23] border border-white/[0.08] text-zinc-300 hover:text-white hover:bg-rose-600/20 hover:border-rose-500/40 disabled:opacity-30 disabled:pointer-events-none transition-all"
          aria-label="Halaman Selanjutnya"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
