"use client";

import React from "react";
import Link from "next/link";
import { Download, Send, Sparkles, FolderGit2, Users, Award, Code2, Zap } from "lucide-react";
import { portfolioData, Profile } from "@/data/portfolio";
import { useSmoothScroll } from "@/components/useSmoothScroll";

interface HeroSectionProps {
    initialProfile?: Profile;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ initialProfile }) => {
    const [profile, setProfile] = React.useState<Profile>(initialProfile || portfolioData.profile);
    const { scrollToSection } = useSmoothScroll();

    React.useEffect(() => {
        fetch("/api/profile")
            .then((res) => res.json())
            .then((data) => {
                if (data?.profile) setProfile(data.profile);
            })
            .catch(() => {});
    }, []);

    // Daftar teks profesi yang akan diketik secara otomatis (diambil dari profile.roles)
    const roles = React.useMemo(() => {
        if (profile.roles && profile.roles.length > 0) {
            return profile.roles;
        }
        return [profile.role || "<Frontend & Fullstack Developer />"];
    }, [profile.roles, profile.role]);

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
            const timeout = setTimeout(() => {
                setIsDeleting(false);
                setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
            }, 0);
            return () => clearTimeout(timeout);
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
    }, [currentText, isDeleting, currentRoleIndex, roles]);

    return (
        <section
            id="home"
            className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 md:py-12 border-b border-rose-950/40 hero-glow-bg scroll-mt-24"
        >
            <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
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
                        {/* Main Avatar Wrapper with balanced responsive dimensions */}
                        <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[380px] lg:h-[380px] xl:w-[420px] xl:h-[420px] flex items-center justify-center">
                            {/* Outer Ambient Glow Pulsing in Background */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-600/35 via-rose-500/20 to-red-600/25 blur-3xl -z-10 animate-pulse pointer-events-none"></div>

                            {/* Outer Orbit Rings (behind the avatar, pointer-events-none) */}
                            <div className="absolute -inset-4 sm:-inset-6 rounded-full border border-dashed border-rose-500/30 animate-spin-slow pointer-events-none -z-10"></div>
                            <div className="absolute -inset-8 sm:-inset-10 rounded-full border border-rose-500/15 pointer-events-none -z-10"></div>
                            
                            {/* Orbiting Satellite Dot */}
                            <div className="absolute -inset-4 sm:-inset-6 pointer-events-none animate-spin-reverse-slow -z-10">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_12px_#f43f5e]"></div>
                            </div>

                            {/* Core Avatar Frame: Crystal Clear, No Obscuring Overlays */}
                            <div className="relative z-10 w-full h-full rounded-full p-2 sm:p-2.5 bg-gradient-to-b from-rose-500/40 via-rose-900/20 to-rose-950/40 border border-rose-500/40 backdrop-blur-sm shadow-[0_0_50px_rgba(225,29,72,0.3)] group hover:scale-[1.02] transition-transform duration-500">
                                <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-b from-[#240c12] via-[#140609] to-[#090204] border border-rose-500/30 relative flex items-center justify-center">
                                    <img
                                        src={profile.avatarUrl}
                                        alt={profile.name}
                                        className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 select-none"
                                    />
                                    {/* Subtle inner ambient rim light to highlight shoulders & silhouette */}
                                    <div className="absolute inset-0 rounded-full shadow-[inset_0_0_28px_rgba(244,63,94,0.3)] pointer-events-none"></div>
                                </div>
                            </div>

                            {/* Floating Peripheral HUD Badges (Balanced framing around the orbit) */}
                            {/* 1. Brand Tag (Top Right) */}
                            <div className="absolute -top-2 -right-1 sm:-top-3 sm:-right-3 z-20 px-3.5 py-1.5 rounded-full bg-[#140508]/90 backdrop-blur-md border border-rose-500/50 text-xs font-mono text-rose-300 shadow-xl shadow-rose-950/80 flex items-center gap-2 animate-float pointer-events-auto hover:border-rose-400 hover:scale-105 transition-all">
                                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                                <span className="font-semibold text-white tracking-wide">{profile.brandName || "fLINK"}</span>
                            </div>

                            {/* 2. Primary Tech Badge (Top Left) */}
                            <div className="absolute top-8 -left-3 sm:top-10 sm:-left-6 z-20 px-3 py-1.5 rounded-full bg-[#140508]/90 backdrop-blur-md border border-cyan-500/40 text-xs font-mono text-cyan-300 shadow-xl shadow-cyan-950/60 flex items-center gap-2 animate-float pointer-events-auto hover:border-cyan-400 hover:scale-105 transition-all">
                                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                                <span className="font-semibold text-zinc-200 tracking-tight">Next.js &bull; React</span>
                            </div>

                            {/* 3. Role/Capability Badge (Bottom Left) */}
                            <div className="absolute bottom-10 -left-2 sm:bottom-12 sm:-left-4 z-20 px-3 py-1.5 rounded-full bg-[#140508]/90 backdrop-blur-md border border-rose-500/40 text-xs font-mono text-rose-300 shadow-xl shadow-rose-950/60 flex items-center gap-2 animate-float-slow pointer-events-auto hover:border-rose-400 hover:scale-105 transition-all">
                                <Zap className="w-3.5 h-3.5 text-amber-400" />
                                <span className="font-semibold text-zinc-200 tracking-tight">Full Stack Dev</span>
                            </div>

                            {/* 4. Status Badge (Bottom Center) */}
                            <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-[#140508]/90 backdrop-blur-md border border-emerald-500/40 text-xs font-semibold text-zinc-200 shadow-xl shadow-black/80 flex items-center gap-2.5 whitespace-nowrap animate-float-slow pointer-events-auto hover:scale-105 transition-all">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                                <span className="text-zinc-200 font-medium">
                                    {profile.isAvailable !== false ? "Open for Collaboration" : "Currently Focused"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};