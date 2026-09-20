"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Clock, ExternalLink, User } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

interface AdminHeaderProps {
    onTabChange?: (tab: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onTabChange }) => {
    const { profile } = portfolioData;
    const [time, setTime] = useState<string>("");

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(`${now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })} WIB`);
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0d0d15]/90 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-all shadow-[0_0_15px_rgba(225,29,72,0.3)]">
                            <Shield className="w-5 h-5 text-rose-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                                {profile.brandName}
                                <span className="text-rose-500 font-mono text-xs px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                                    CMS ADMIN
                                </span>
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono -mt-0.5">Obsidian Cyber v1.0</span>
                        </div>
                    </Link>

                    <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#1b1b23] border border-white/[0.06] text-xs">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-emerald-400 font-mono text-[11px] font-semibold">API GATEWAY ONLINE</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {time && (
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1b1b23] border border-white/[0.06] text-zinc-300 font-mono text-xs">
                            <Clock className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{time}</span>
                        </div>
                    )}

                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1f1f27] hover:bg-[#292932] border border-white/[0.08] text-xs font-medium text-zinc-200 hover:text-white transition-all"
                    >
                        <span>Lihat Portofolio</span>
                        <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
                    </Link>

                    <button
                        onClick={() => onTabChange?.("profile")}
                        className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-[#1b1b23] hover:bg-[#292932] border border-white/[0.08] transition-colors"
                        title="Pengaturan Profil"
                    >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                            {profile.brandName.charAt(0)}
                        </div>
                        <span className="hidden md:block text-xs font-semibold text-zinc-200">
                            {profile.brandName} (Admin)
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
};