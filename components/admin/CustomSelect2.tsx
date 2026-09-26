"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, Plus } from "lucide-react";

interface CustomSelect2Props {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
    required?: boolean;
}

export const CustomSelect2: React.FC<CustomSelect2Props> = ({
    value,
    onChange,
    options,
    placeholder = "-- Pilih Kategori --",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter options based on search query
    const filteredOptions = options.filter((opt) =>
        opt.toLowerCase().includes(search.toLowerCase())
    );

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative w-full">
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#13131b] border ${
                    isOpen ? "border-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.2)]" : "border-white/[0.1]"
                } text-left text-xs flex items-center justify-between transition-all focus:outline-none`}
            >
                <span className={value ? "text-white font-medium" : "text-zinc-500"}>
                    {value || placeholder}
                </span>
                <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-rose-400" : ""
                    }`}
                />
            </button>

            {/* Dropdown Menu (Select2 Box) */}
            {isOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#16080c] border border-rose-900/50 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Live Search Input */}
                    <div className="p-2 border-b border-white/[0.08] bg-[#120508] relative flex items-center">
                        <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3" />
                        <input
                            type="text"
                            autoFocus
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari kategori..."
                            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#1b1b23] border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                        />
                    </div>

                    {/* Options List */}
                    <div className="max-h-48 overflow-y-auto p-1.5 scrollbar-none data-lenis-prevent space-y-0.5">
                        {filteredOptions.length === 0 ? (
                            <div className="py-4 text-center text-xs text-zinc-500 italic">
                                Kategori "{search}" tidak ditemukan.
                            </div>
                        ) : (
                            filteredOptions.map((opt) => {
                                const isSelected = value === opt;
                                return (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => {
                                            onChange(opt);
                                            setIsOpen(false);
                                            setSearch("");
                                        }}
                                        className={`w-full px-3 py-2 rounded-lg text-xs text-left flex items-center justify-between transition-colors ${
                                            isSelected
                                                ? "bg-rose-600/25 text-rose-300 font-semibold border border-rose-500/30"
                                                : "text-zinc-300 hover:bg-white/[0.06] hover:text-white"
                                        }`}
                                    >
                                        <span>{opt}</span>
                                        {isSelected && <Check className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
