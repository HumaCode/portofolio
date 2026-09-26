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
                className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 sm:py-16 border-b border-rose-950/40 relative scroll-mt-20"
            >
                <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full my-auto">
                    {/* Section Header */}
                    <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-950/60 border border-rose-800/40 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                            <User className="w-3.5 h-3.5" />
                            <span>Profile & Identity</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                            About Me
                        </h2>
                        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
                            Passionate developer bridging interface aesthetics and modern performant engineering.
                        </p>
                    </div>

                    {/* About Bio & Persona Image */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#130508]/60 border border-rose-900/30 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-sm">
                        <div className="lg:col-span-5 flex justify-center">
                            <div className="relative group w-full max-w-md rounded-2xl overflow-hidden border border-rose-800/40 shadow-2xl bg-[#1b070d]">
                                <img
                                    src={profile.aboutImageUrl}
                                    alt="About Charlotte"
                                    className="w-full h-72 sm:h-96 object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0406] via-transparent to-transparent opacity-80"></div>
                                <div className="absolute bottom-4 left-5 right-5">
                                    <span className="text-xs font-mono uppercase text-rose-400 font-semibold tracking-wider">
                                        Location
                                    </span>
                                    <p className="text-base text-white font-medium">{profile.location}</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
                            <div className="space-y-3 sm:space-y-4">
                                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug">
                                    Architecting interactive digital products with precision.
                                </h3>
                                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                                    {profile.aboutBio}
                                </p>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-rose-950/60">
                                <h4 className="text-xs uppercase font-mono tracking-widest text-rose-400 font-bold">
                                    Additional Tech Stack & Ecosystem
                                </h4>
                                <div className="flex flex-wrap gap-2.5">
                                    {(profile.secondaryStack && profile.secondaryStack.length > 0
                                        ? profile.secondaryStack
                                        : secondaryStack
                                    ).map((tech) => (
                                        <span
                                            key={tech}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-800/30 text-xs sm:text-sm font-medium text-zinc-200 hover:border-rose-500/50 hover:bg-rose-900/30 transition-all cursor-default"
                                        >
                                            <CheckCircle2 className="w-4 h-4 text-rose-400" />
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
                className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 sm:py-16 border-b border-rose-950/40 relative scroll-mt-20"
            >
                <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full my-auto">
                    <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-2">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-950/50 border border-rose-800/40 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                            <Cpu className="w-3.5 h-3.5" />
                            <span>Core Specializations</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                            Technical Arsenal & Skills
                        </h2>
                        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
                            Proficiency breakdown across frontend, backend, UI engineering, and modern stacks.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-5 lg:gap-6">
                        {skillsGauges.map((skill: SkillGauge) => {
                            const radius = 42;
                            const circumference = 2 * Math.PI * radius;
                            const strokeDashoffset = circumference - (skill.percentage / 100) * circumference;

                            return (
                                <div
                                    key={skill.name}
                                    className="bg-[#14060a]/80 border border-rose-900/30 hover:border-rose-600/50 rounded-2xl p-4 sm:p-5 text-center shadow-lg transition-all group hover:-translate-y-1 flex flex-col items-center justify-center min-h-[190px] sm:min-h-[210px]"
                                >
                                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto flex items-center justify-center">
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
                                            <span className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white tracking-tight">
                                                {skill.percentage}%
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="mt-3.5 font-semibold text-xs sm:text-sm lg:text-base text-zinc-100 group-hover:text-rose-400 transition-colors">
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