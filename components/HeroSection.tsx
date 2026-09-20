"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, Send, Sparkles, FolderGit2, Users, Award } from "lucide-react";
import { portfolioData } from "@/data/portfolio";
import { useSmoothScroll } from "@/components/useSmoothScroll";

export const HeroSection: React.FC = () => {
    const { profile } = portfolioData;
    const { scrollToSection } = useSmoothScroll();

    // Daftar teks profesi yang akan diketik secara otomatis
    const roles = [
        "<Frontend & Fullstack Developer />",
        "<React & Next.js />",
        "<UI/UX & Laravel Engineer />",
    ];

    const [currentRoleIndex, setCurrentRoleIndex] = React.useState(0);
    const [currentText, setCurrentText] = React.useState("");
    const [isDeleting, setIsDeleting] = React.useState(false);

    React.useEffect(() => {
        const fullText = roles[currentRoleIndex];

        // Jika selesai mengetik teks penuh
        if (!isDeleting && currentText === fullText) {
            const timeout = setTimeout(() => {
                setIsDeleting(true);
            }, 1800); // Jeda 1.8 detik saat kata selesai diketik
            return () => clearTimeout(timeout);
        }

        // Jika selesai menghapus seluruh teks
        if (isDeleting && currentText === "") {
            setIsDeleting(false);
            setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
            return;
        }

        // Kecepatan mengetik & menghapus
        const speed = isDeleting ? 35 : 70;
        const timer = setTimeout(() => {
            setCurrentText((prev) =>
                isDeleting
                    ? fullText.substring(0, prev.length - 1)
                    : fullText.substring(0, prev.length + 1)
            );
        }, speed);

        return () => clearTimeout(timer);
    }, [currentText, isDeleting, currentRoleIndex]);

    return (
        <section
            id="home"
            className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 md:py-12 border-b border-rose-950/40 hero-glow-bg scroll-mt-24"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Column: Hero Text & CTA */}
                    <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
                        {/* Status Pill Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/70 border border-rose-800/40 text-rose-300 text-xs font-semibold backdrop-blur-sm shadow-inner shadow-rose-900/30">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>Available for new projects</span>
                            <Sparkles className="w-3.5 h-3.5 text-rose-400 ml-0.5" />
                        </div>

                        {/* Main Headline */}
                        <div className="space-y-2">
                            <p className="text-rose-400 font-mono text-sm tracking-wider uppercase font-semibold">
                                Hi there, I am
                            </p>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                                {profile.name}{" "}
                                <span className="block mt-1 text-3xl sm:text-4xl lg:text-5xl bg-gradient-to-r from-rose-400 via-rose-500 to-red-600 bg-clip-text text-transparent min-h-[1.3em]">
                                    {currentText}
                                    <span className="inline-block w-0.5 h-[0.85em] bg-rose-400 ml-1 translate-y-1 animate-pulse"></span>
                                </span>
                            </h1>
                        </div>

                        {/* Description */}
                        <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                            {profile.bio}
                        </p>

                        {/* CTA Action Buttons */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                            <Link
                                href="#projects"
                                onClick={(e) => scrollToSection(e, "#projects")}
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold text-sm shadow-xl shadow-rose-600/30 transition-all flex items-center gap-2 active:scale-95"
                            >
                                <span>View Projects</span>
                                <Send className="w-4 h-4" />
                            </Link>
                            <a
                                href="#contact"
                                onClick={(e) => scrollToSection(e, "#contact")}
                                className="px-5 py-2.5 rounded-xl bg-[#18070b]/90 hover:bg-[#250b12] border border-rose-800/40 hover:border-rose-500/70 text-zinc-200 font-semibold text-sm transition-all flex items-center gap-2 active:scale-95"
                            >
                                <span>Download CV</span>
                                <Download className="w-4 h-4 text-rose-400" />
                            </a>
                        </div>

                        {/* Quick Metrics Bar */}
                        <div className="grid grid-cols-3 gap-3 pt-5 border-t border-rose-950/60 max-w-lg mx-auto lg:mx-0">
                            <div className="text-center lg:text-left">
                                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-rose-400 mb-1">
                                    <Award className="w-4 h-4" />
                                    <span className="text-2xl font-bold text-white tracking-tight">
                                        {profile.yearsExp}
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-400 font-medium">Years Experience</p>
                            </div>

                            <div className="text-center lg:text-left border-x border-rose-950/60 px-2">
                                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-rose-400 mb-1">
                                    <FolderGit2 className="w-4 h-4" />
                                    <span className="text-2xl font-bold text-white tracking-tight">
                                        {profile.projectsCount}
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-400 font-medium">Completed Projects</p>
                            </div>

                            <div className="text-center lg:text-left">
                                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-rose-400 mb-1">
                                    <Users className="w-4 h-4" />
                                    <span className="text-2xl font-bold text-white tracking-tight">
                                        {profile.clientsCount}
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-400 font-medium">Satisfied Clients</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Hero Concentric Rings Avatar */}
                    <div className="lg:col-span-5 flex justify-center items-center relative">
                        {/* Outer Pulsing Glow Ambient */}
                        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-rose-600/30 to-red-500/20 blur-3xl -z-10 animate-pulse"></div>

                        {/* Outer Rotating SVG Orbit Ring */}
                        <div className="absolute w-[290px] h-[290px] sm:w-[370px] sm:h-[370px] pointer-events-none animate-spin-slow">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="48"
                                    fill="none"
                                    stroke="rgba(225, 29, 72, 0.4)"
                                    strokeWidth="0.5"
                                    strokeDasharray="4 4"
                                />
                            </svg>
                        </div>

                        {/* Reverse Rotating SVG Ring with glowing dot */}
                        <div className="absolute w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] pointer-events-none animate-spin-reverse-slow">
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-rose-400 shadow-lg shadow-rose-400/90 animate-ping"></div>
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-rose-500 shadow-lg shadow-rose-500/90"></div>
                            <div className="absolute bottom-4 right-10 w-2 h-2 rounded-full bg-red-400 shadow-md shadow-red-400/80"></div>
                        </div>

                        {/* Concentric Ring 2 (Outer Container with scale pulse) */}
                        <div className="w-72 h-72 sm:w-88 sm:h-88 rounded-full border border-rose-500/30 concentric-ring-2 flex items-center justify-center p-4 relative hover:scale-105 transition-transform duration-500">
                            {/* Inner Rotating Dashed SVG */}
                            <div className="absolute inset-2 rounded-full pointer-events-none animate-spin-slow">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="47"
                                        fill="none"
                                        stroke="rgba(244, 63, 94, 0.5)"
                                        strokeWidth="0.8"
                                        strokeDasharray="6 8"
                                    />
                                </svg>
                            </div>

                            {/* Concentric Ring 1 (Inner with glow pulse) */}
                            <div className="w-full h-full rounded-full border border-rose-500/50 concentric-ring-1 flex items-center justify-center p-3 relative bg-[#130508]/60 backdrop-blur-sm shadow-[0_0_50px_rgba(225,29,72,0.3)]">
                                {/* Center Avatar Container */}
                                <div className="w-full h-full rounded-full overflow-hidden border-2 border-rose-500/80 relative shadow-2xl bg-black/40 group">
                                    <img
                                        src={profile.avatarUrl}
                                        alt={profile.name}
                                        className="w-full h-full object-cover scale-105 group-hover:scale-115 transition-transform duration-700"
                                    />
                                    {/* Subtle inner shadow & gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0406]/70 via-transparent to-transparent pointer-events-none"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};