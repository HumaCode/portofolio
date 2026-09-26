"use client";

import React from "react";
import { User, Cpu, Sparkles, CheckCircle2 } from "lucide-react";
import { portfolioData, SkillGauge } from "@/data/portfolio";

export const AboutAndSkillsSection: React.FC = () => {
    const [profile, setProfile] = React.useState(portfolioData.profile);
    const { skillsGauges, secondaryStack } = portfolioData;

    React.useEffect(() => {
        fetch("/api/profile")
            .then((res) => res.json())
            .then((data) => {
                if (data?.profile) setProfile(data.profile);
            })
            .catch(() => {});
    }, []);

    return (
        <>
            {/* About Section */}
            <section
                id="about"
                className="py-16 sm:py-20 border-b border-rose-950/40 relative scroll-mt-10"
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
                    {/* Section Header */}
                    <div className="text-center max-w-2xl mx-auto mb-6 space-y-1.5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/40 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                            <User className="w-3.5 h-3.5" />
                            <span>Profile & Identity</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                            About Me
                        </h2>
                        <p className="text-zinc-400 text-xs sm:text-sm">
                            Passionate developer bridging interface aesthetics and modern performant engineering.
                        </p>
                    </div>

                    {/* About Bio & Persona Image */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center bg-[#130508]/60 border border-rose-900/30 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-sm">
                        <div className="lg:col-span-5 flex justify-center">
                            <div className="relative group w-full max-w-sm rounded-2xl overflow-hidden border border-rose-800/40 shadow-2xl bg-[#1b070d]">
                                <img
                                    src={profile.aboutImageUrl}
                                    alt="About Charlotte"
                                    className="w-full h-64 sm:h-80 object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0406] via-transparent to-transparent opacity-80"></div>
                                <div className="absolute bottom-3 left-4 right-4">
                                    <span className="text-[11px] font-mono uppercase text-rose-400 font-semibold tracking-wider">
                                        Location
                                    </span>
                                    <p className="text-sm text-white font-medium">{profile.location}</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                            <div className="space-y-2 sm:space-y-3">
                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                                    Architecting interactive digital products with precision.
                                </h3>
                                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                                    {profile.aboutBio}
                                </p>
                            </div>

                            <div className="space-y-2.5 pt-3 border-t border-rose-950/60">
                                <h4 className="text-[11px] uppercase font-mono tracking-widest text-rose-400 font-bold">
                                    Additional Tech Stack & Ecosystem
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {(profile.secondaryStack && profile.secondaryStack.length > 0
                                        ? profile.secondaryStack
                                        : secondaryStack
                                    ).map((tech) => (
                                        <span
                                            key={tech}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-800/30 text-xs font-medium text-zinc-200 hover:border-rose-500/50 hover:bg-rose-900/30 transition-all cursor-default"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section
                id="skills"
                className="py-12 sm:py-16 border-b border-rose-950/40 relative scroll-mt-10"
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
                    <div className="text-center max-w-2xl mx-auto mb-8 space-y-1.5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/50 border border-rose-800/40 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                            <Cpu className="w-3.5 h-3.5" />
                            <span>Core Specializations</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            Technical Arsenal & Skills
                        </h2>
                        <p className="text-zinc-400 text-xs sm:text-sm">
                            Proficiency breakdown across frontend, backend, UI engineering, and modern stacks.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                        {skillsGauges.map((skill: SkillGauge) => {
                            const radius = 42;
                            const circumference = 2 * Math.PI * radius;
                            const strokeDashoffset = circumference - (skill.percentage / 100) * circumference;

                            return (
                                <div
                                    key={skill.name}
                                    className="bg-[#14060a]/80 border border-rose-900/30 hover:border-rose-600/50 rounded-2xl p-5 text-center shadow-lg transition-all group hover:-translate-y-1 flex flex-col items-center justify-center"
                                >
                                    <div className="relative w-24 h-24 sm:w-26 sm:h-26 mx-auto flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                            {/* Background track circle */}
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r={radius}
                                                className="stroke-rose-950/80"
                                                strokeWidth="8"
                                                fill="transparent"
                                            />
                                            {/* Animated value circle */}
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r={radius}
                                                stroke={skill.strokeColor}
                                                strokeWidth="8"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={strokeDashoffset}
                                                className="gauge-circle shadow-lg"
                                                fill="transparent"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        {/* Centered Percentage */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                                                {skill.percentage}%
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="mt-4 font-semibold text-sm sm:text-base text-zinc-100 group-hover:text-rose-400 transition-colors">
                                        {skill.name}
                                    </h3>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
};