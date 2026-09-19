"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, Send, Sparkles, FolderGit2, Users, Award } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

export const HeroSection: React.FC = () => {
    const { profile } = portfolioData;

    return (
        <section
            id="home"
            className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 md:py-12 border-b border-rose-950/40 hero-glow-bg overflow-hidden scroll-mt-24"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Column: Hero Text & CTA */}
                    <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
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
                                <span className="block mt-1 bg-gradient-to-r from-rose-400 via-rose-500 to-red-600 bg-clip-text text-transparent">
                                    {profile.role}
                                </span>
                            </h1>
                        </div>

                        {/* Description */}
                        <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                            {profile.bio}
                        </p>

                        {/* CTA Action Buttons */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                            <Link
                                href="#projects"
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold text-sm shadow-xl shadow-rose-600/30 transition-all flex items-center gap-2 active:scale-95"
                            >
                                <span>View Projects</span>
                                <Send className="w-4 h-4" />
                            </Link>
                            <a
                                href="#contact"
                                className="px-6 py-3 rounded-xl bg-[#18070b]/90 hover:bg-[#250b12] border border-rose-800/40 hover:border-rose-500/70 text-zinc-200 font-semibold text-sm transition-all flex items-center gap-2 active:scale-95"
                            >
                                <span>Download CV</span>
                                <Download className="w-4 h-4 text-rose-400" />
                            </a>
                        </div>

                        {/* Quick Metrics Bar */}
                        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-rose-950/60 max-w-lg mx-auto lg:mx-0">
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
                        {/* Outer Pulsing Glow */}
                        <div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-rose-600/20 blur-3xl -z-10 animate-pulse"></div>

                        {/* Concentric Ring 2 (Outer) */}
                        <div className="w-72 h-72 sm:w-88 sm:h-88 rounded-full border border-rose-500/20 concentric-ring-2 flex items-center justify-center p-4 relative">
                            {/* Decorative floating dots */}
                            <div className="absolute top-4 right-8 w-2.5 h-2.5 rounded-full bg-rose-400 shadow-md shadow-rose-400/80"></div>
                            <div className="absolute bottom-6 left-6 w-2 h-2 rounded-full bg-red-500 shadow-md shadow-red-500/80"></div>

                            {/* Concentric Ring 1 (Inner) */}
                            <div className="w-full h-full rounded-full border border-rose-500/40 concentric-ring-1 flex items-center justify-center p-3 relative bg-[#130508]/40 backdrop-blur-xs">
                                {/* Center Avatar Container */}
                                <div className="w-full h-full rounded-full overflow-hidden border-2 border-rose-500/70 relative shadow-2xl bg-black/40">
                                    <img
                                        src={profile.avatarUrl}
                                        alt={profile.name}
                                        className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700"
                                    />
                                    {/* Subtle inner shadow overlay */}
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