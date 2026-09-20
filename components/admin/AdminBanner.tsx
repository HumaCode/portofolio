"use client";

import React, { useState } from "react";
import { Database, Plus, CheckCircle, Loader2 } from "lucide-react";

interface AdminBannerProps {
    onOpenAddModal: () => void;
    onTriggerBackup: () => void;
}

export const AdminBanner: React.FC<AdminBannerProps> = ({
    onOpenAddModal,
    onTriggerBackup,
}) => {
    const [isBackingUp, setIsBackingUp] = useState(false);

    const handleBackupClick = () => {
        setIsBackingUp(true);
        onTriggerBackup();
        setTimeout(() => {
            setIsBackingUp(false);
        }, 1500);
    };

    return (
        <section className="relative overflow-hidden rounded-2xl bg-[#1b1b23] border border-white/[0.08] p-6 sm:p-8 shadow-2xl mb-8">
            {/* Background Glows */}
            <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-rose-600/15 blur-3xl pointer-events-none"></div>
            <div className="absolute right-64 -bottom-16 w-64 h-64 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                <div className="flex flex-col gap-2 max-w-3xl">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-md bg-rose-600/20 text-rose-300 font-semibold border border-rose-500/30">
                            PRD v1.0 • BAB 7 PRODUCTION
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded-md bg-[#1f1f27] text-emerald-400 border border-white/[0.06]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            API Gateway Online
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Selamat datang kembali, <span className="text-rose-400 font-black">fLINK!</span>
                    </h1>

                    <p className="text-zinc-300 text-sm leading-relaxed">
                        Sistem Content Management & Telemetry Portofolio Personal siap dikelola. Pantau performa, kelola proyek & tanggapi pesan kontak publik secara real-time.
                    </p>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        onClick={handleBackupClick}
                        disabled={isBackingUp}
                        className="px-4 py-2.5 rounded-xl bg-[#1f1f27] hover:bg-[#292932] border border-white/[0.1] text-xs font-semibold text-zinc-200 hover:text-white transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                        {isBackingUp ? (
                            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                        ) : (
                            <Database className="w-4 h-4 text-cyan-400" />
                        )}
                        <span>{isBackingUp ? "Membuat Backup..." : "Trigger Backup DB"}</span>
                    </button>

                    <button
                        onClick={onOpenAddModal}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-xs font-bold text-white transition-all flex items-center gap-2 shadow-lg shadow-rose-600/30 active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>+ Tambah Proyek</span>
                    </button>
                </div>
            </div>
        </section>
    );
};