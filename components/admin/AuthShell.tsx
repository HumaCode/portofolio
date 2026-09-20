import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Shared full-page shell for the admin authentication screens (login & forgot password).
 * Renders the fixed sci-fi backdrop (glow blobs, radial vignette, 32px grid) plus the
 * "PORTAL SECURE" top bar and telemetry footer, matching the Obsidian Cyber design.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex min-h-screen flex-col">
            {/* Fixed decorative backdrop */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-rose-600/10 blur-[140px] rounded-full"></div>
                <div className="absolute -bottom-40 right-1/4 w-[600px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full"></div>
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, rgba(31,31,39,0.2) 0%, rgba(19,19,27,0) 55%, rgba(13,13,21,0.8) 100%)",
                    }}
                ></div>
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                ></div>
            </div>

            {/* Top security bar */}
            <header className="relative z-20 w-full px-4 sm:px-6 py-4">
                <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(78,222,163,0.8)]"></span>
                        <span className="font-mono text-[11px] uppercase text-zinc-200 tracking-wider">
                            PORTAL SECURE • SSL/TLS ENCRYPTED
                        </span>
                    </div>
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Return to Public Portfolio</span>
                    </Link>
                </div>
            </header>

            {/* Centered content (margin-auto avoids clipping on tall cards) */}
            <main className="relative z-10 flex w-full flex-1 flex-col px-4 sm:px-6 py-6 sm:py-10">
                <div className="m-auto w-full">{children}</div>
            </main>

            {/* Telemetry footer */}
            <footer className="relative z-20 w-full px-4 sm:px-6 py-4">
                <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
                    <span className="font-mono text-[11px] uppercase text-zinc-500">
                        fLINK Admin CMS v1.0 • Laravel 11.x Core
                    </span>
                    <span className="text-xs text-zinc-500">All system activities monitored &amp; logged.</span>
                </div>
            </footer>
        </div>
    );
}
