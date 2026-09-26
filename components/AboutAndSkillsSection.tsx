"use client";

import React from "react";
import { User, Cpu, Sparkles, CheckCircle2 } from "lucide-react";
import { portfolioData, SkillGauge, Profile } from "@/data/portfolio";

interface AboutAndSkillsSectionProps {
    initialProfile?: Profile;
    initialSkills?: SkillGauge[];
}

export const AboutAndSkillsSection: React.FC<AboutAndSkillsSectionProps> = ({ initialProfile, initialSkills }) => {
    const [profile, setProfile] = React.useState<Profile>(initialProfile || portfolioData.profile);
    const [skills, setSkills] = React.useState<SkillGauge[]>(initialSkills || portfolioData.skillsGauges);
    const { secondaryStack } = portfolioData;

    React.useEffect(() => {
        fetch("/api/profile")
            .then((res) => res.json())
            .then((data) => {
                if (data?.profile) setProfile(data.profile);
            })
            .catch(() => {});

        fetch("/api/skills")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) setSkills(data);
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
                            <div className="relative group w-full max-w-md rounded-3xl overflow-hidden bg-gradient-to-b from-[#1c060d] via-[#120407] to-[#0a0204] p-6 sm:p-8 flex flex-col items-center justify-center">
                                {/* Ambient Background Glow */}
                                <div className="absolute inset-0 bg-radial from-rose-600/20 via-transparent to-transparent blur-2xl pointer-events-none"></div>

                                {/* Aesthetic Organic Red Blob Pattern (Lebar & Melingkupi Karakter Sesuai Contoh) */}
                                <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-[340px] lg:h-[340px] flex items-center justify-center">
                                    {/* Layer SVG Blob Pattern Lebih Besar di Belakang */}
                                    <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                                        <svg
                                            viewBox="0 0 200 200"
                                            className="w-full h-full drop-shadow-[0_20px_40px_rgba(225,29,72,0.45)]"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <defs>
                                                <linearGradient id="avatarBlobGradient" x1="15%" y1="10%" x2="85%" y2="90%">
                                                    <stop offset="0%" stopColor="#f43f5e" />
                                                    <stop offset="35%" stopColor="#e11d48" />
                                                    <stop offset="70%" stopColor="#be123c" />
                                                    <stop offset="100%" stopColor="#881337" />
                                                </linearGradient>
                                            </defs>
                                            {/* Kurva meliuk organik lebih lebar dan tebal melingkupi karakter */}
                                            <path
                                                fill="url(#avatarBlobGradient)"
                                                d="M48.8,-68.2C62.1,-60.8,71.2,-46.3,75.9,-30.9C80.6,-15.5,80.9,0.8,76.8,15.8C72.7,30.8,64.2,44.5,52.5,54.8C40.8,65.1,25.9,72,10.2,74.8C-5.5,77.6,-22,76.3,-36.8,69.5C-51.6,62.7,-64.7,50.4,-72.6,35.4C-80.5,20.4,-83.2,2.7,-79.8,-13.7C-76.4,-30.1,-66.9,-45.2,-53.8,-53.6C-40.7,-62,-24,-63.7,-7.1,-67.2C9.8,-70.7,35.5,-75.6,48.8,-68.2Z"
                                                transform="translate(100 100)"
                                            />
                                        </svg>
                                    </div>

                                    {/* PNG Avatar Image (Ukuran proporsional di depan blob) */}
                                    <div className="relative z-10 w-[84%] h-[84%] flex items-center justify-center">
                                        <img
                                            src={profile.aboutImageUrl || profile.avatarUrl}
                                            alt={profile.name}
                                            className="w-full h-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </div>

                                {/* Location Badge Below Avatar */}
                                <div className="mt-5 w-full text-center px-4 py-2.5 rounded-xl bg-[#0b0406]/80 border border-rose-900/30 backdrop-blur-sm">
                                    <span className="text-[11px] font-mono uppercase text-rose-400 font-semibold tracking-wider block">
                                        Location
                                    </span>
                                    <p className="text-sm text-white font-medium truncate">{profile.location}</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
                            <div className="space-y-3 sm:space-y-4">
                                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug">
                                    {profile.tagline || "Architecting interactive digital products with precision."}
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
                        {skills.map((skill: SkillGauge) => {
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