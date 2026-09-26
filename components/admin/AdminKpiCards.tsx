"use client";

import React from "react";
import { Briefcase, Cpu, Award, Mail, ArrowUpRight } from "lucide-react";

interface AdminKpiCardsProps {
    projectsCount: number;
    featuredCount: number;
    skillsCount: number;
    certificatesCount: number;
    unreadInboxCount: number;
    totalInboxCount: number;
    onViewInbox?: () => void;
    onViewProjects?: () => void;
    onViewSkills?: () => void;
    onViewCertificates?: () => void;
}

export const AdminKpiCards: React.FC<AdminKpiCardsProps> = ({
    projectsCount,
    featuredCount,
    skillsCount,
    certificatesCount,
    unreadInboxCount,
    totalInboxCount,
    onViewInbox,
    onViewProjects,
    onViewSkills,
    onViewCertificates,
}) => {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {/* Card 1: Total Proyek */}
            <div
                onClick={onViewProjects}
                className="rounded-2xl bg-[#1b1b23] hover:bg-[#1f1f27] border border-white/[0.08] hover:border-rose-500/40 p-5 transition-all cursor-pointer shadow-lg group"
            >
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-zinc-400">Total Proyek</span>
                    <div className="w-10 h-10 rounded-xl bg-rose-600/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                        <Briefcase className="w-5 h-5" />
                    </div>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-black text-white font-mono">{projectsCount}</span>
                    <span className="text-xs font-medium text-rose-400">{featuredCount} Featured</span>
                </div>
                <div className="w-full bg-[#13131b] h-1.5 rounded-full overflow-hidden mt-3">
                    <div className="bg-rose-500 h-full rounded-full w-[78%]"></div>
                </div>
            </div>

            {/* Card 2: Skills */}
            <div
                onClick={onViewSkills}
                className="rounded-2xl bg-[#1b1b23] hover:bg-[#1f1f27] border border-white/[0.08] hover:border-cyan-500/40 p-5 transition-all cursor-pointer shadow-lg group"
            >
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-zinc-400">Skills Terdaftar</span>
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                        <Cpu className="w-5 h-5" />
                    </div>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-black text-white font-mono">{skillsCount}</span>
                    <span className="text-xs font-medium text-cyan-400">FE • BE • Mobile</span>
                </div>
                <div className="w-full bg-[#13131b] h-1.5 rounded-full overflow-hidden mt-3">
                    <div className="bg-cyan-400 h-full rounded-full w-[90%]"></div>
                </div>
            </div>

            {/* Card 3: Sertifikat */}
            <div
                onClick={onViewCertificates}
                className="rounded-2xl bg-[#1b1b23] hover:bg-[#1f1f27] border border-white/[0.08] hover:border-emerald-500/40 p-5 transition-all cursor-pointer shadow-lg group"
            >
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-zinc-400">Sertifikat & Lisensi</span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                        <Award className="w-5 h-5" />
                    </div>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-black text-white font-mono">{certificatesCount}</span>
                    <span className="text-xs font-medium text-emerald-400">BNSP & Global</span>
                </div>
                <div className="w-full bg-[#13131b] h-1.5 rounded-full overflow-hidden mt-3">
                    <div className="bg-emerald-400 h-full rounded-full w-full"></div>
                </div>
            </div>

            {/* Card 4: Inbox Messages */}
            <div
                onClick={onViewInbox}
                className="rounded-2xl bg-[#1b1b23] hover:bg-[#1f1f27] border border-white/[0.08] hover:border-rose-500/40 p-5 transition-all cursor-pointer shadow-lg group relative overflow-hidden"
            >
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-zinc-400">Pesan Kontak</span>
                    <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform relative">
                        <Mail className="w-5 h-5" />
                        {unreadInboxCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-[#1b1b23] animate-pulse"></span>
                        )}
                    </div>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-black text-white font-mono">{totalInboxCount}</span>
                    <span className="text-xs font-bold text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30">
                        {unreadInboxCount} Baru
                    </span>
                </div>
                <div className="flex items-center justify-between mt-3 text-[11px] text-zinc-400 group-hover:text-rose-300 transition-colors">
                    <span>Lihat & Balas Inbox</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
            </div>
        </section>
    );
};