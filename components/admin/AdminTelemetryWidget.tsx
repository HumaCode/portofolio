"use client";

import React, { useState, useEffect } from "react";
import { Activity, Server, Cpu, HardDrive, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

interface Props {
    isAvailable: boolean;
    onToggleAvailability: (available: boolean) => void;
}

export const AdminTelemetryWidget: React.FC<Props> = ({
    isAvailable,
    onToggleAvailability,
}) => {
    const { telemetry } = portfolioData;
    const [latency, setLatency] = useState(24);

    useEffect(() => {
        const interval = setInterval(() => {
            const jitter = Math.floor(Math.random() * 5) - 2; // -2 to +2
            setLatency(Math.max(18, Math.min(32, 24 + jitter)));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="rounded-2xl bg-[#1b1b23] border border-white/[0.08] p-5 sm:p-6 shadow-2xl flex flex-col justify-between space-y-6">
            <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                            Server Telemetry
                        </h3>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        99.98% UPTIME
                    </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="p-3.5 rounded-xl bg-[#13131b] border border-white/[0.06]">
                        <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                            <span>DB Ping</span>
                            <Zap className="w-3.5 h-3.5 text-cyan-400" />
                        </div>
                        <p className="text-xl font-black text-white font-mono">{latency} ms</p>
                        <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Optimal Latency</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#13131b] border border-white/[0.06]">
                        <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                            <span>Memory</span>
                            <HardDrive className="w-3.5 h-3.5 text-rose-400" />
                        </div>
                        <p className="text-xl font-black text-white font-mono">{telemetry.memoryUsagePercent}%</p>
                        <div className="w-full bg-[#1b1b23] h-1 rounded-full overflow-hidden mt-1.5">
                            <div
                                className="bg-rose-500 h-full rounded-full"
                                style={{ width: `${telemetry.memoryUsagePercent}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Tech Specs */}
                <div className="mt-4 p-3 rounded-xl bg-[#13131b]/60 border border-white/[0.04] space-y-2 text-xs">
                    <div className="flex justify-between text-zinc-400">
                        <span>Framework</span>
                        <span className="text-zinc-200 font-mono">Next.js 16 (React 19)</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                        <span>Styling Token</span>
                        <span className="text-zinc-200 font-mono">Tailwind CSS v4</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                        <span>Database Node</span>
                        <span className="text-zinc-200 font-mono">PostgreSQL / Edge</span>
                    </div>
                </div>
            </div>

            {/* Availability Status Switch */}
            <div className="pt-4 border-t border-white/[0.06]">
                <div className="flex items-center justify-between bg-[#13131b] p-3 rounded-xl border border-white/[0.06]">
                    <div>
                        <p className="text-xs font-bold text-white">Status Ketersediaan</p>
                        <p className="text-[11px] text-zinc-400">
                            {isAvailable ? "Terbuka untuk tawaran proyek" : "Sedang sibuk / Closed"}
                        </p>
                    </div>

                    <button
                        onClick={() => onToggleAvailability(!isAvailable)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-sm ${
                            isAvailable
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30"
                        }`}
                    >
                        <span
                            className={`w-2 h-2 rounded-full ${
                                isAvailable ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                            }`}
                        ></span>
                        <span>{isAvailable ? "READY TO HIRE" : "BUSY"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
