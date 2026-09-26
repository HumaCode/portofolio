"use client";

import React, { useState } from "react";
import { Award, Briefcase, ExternalLink, Code2, CheckCircle, Sparkles } from "lucide-react";
import { portfolioData, Certificate, Project } from "@/data/portfolio";

export const CertificatesAndProjectsSection: React.FC = () => {
    const { certificates, projects, profile } = portfolioData;
    const [selectedTag, setSelectedTag] = useState<string>("All");

    const allTags = ["All", "React", "Tailwind CSS", "Vue JS", "REST APIs"];

    const filteredProjects =
        selectedTag === "All"
            ? projects
            : projects.filter((project) => project.tags.includes(selectedTag));

    return (
        <>
            {/* Certificates Section */}
            <section
                id="certificates"
                className="min-h-screen flex items-center justify-center py-20 lg:py-28 border-b border-rose-950/40 relative scroll-mt-0"
            >
                <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full my-auto">
                    <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-950/60 border border-rose-800/40 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                            <Award className="w-3.5 h-3.5" />
                            <span>Validated Knowledge</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                            Certifications & Credentials
                        </h2>
                        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
                            Officially accredited skill validations and professional achievements.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                        {/* Cert Left Column: List */}
                        <div className="lg:col-span-7 flex flex-col justify-between gap-4 sm:gap-5">
                            {certificates.map((cert: Certificate) => (
                                <div
                                    key={cert.id}
                                    className="bg-[#14060a]/80 border border-rose-900/30 hover:border-rose-500/50 rounded-2xl p-4 sm:p-5 lg:p-6 transition-all shadow-lg flex items-center justify-between gap-4 group"
                                >
                                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-rose-950/90 border border-rose-700/40 flex items-center justify-center text-rose-400 shrink-0 group-hover:scale-105 group-hover:bg-rose-900/50 transition-all">
                                            <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <div className="truncate">
                                            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white group-hover:text-rose-300 transition-colors truncate">
                                                {cert.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-zinc-400 truncate">{cert.issuer}</p>
                                            <div className="flex items-center gap-2 mt-1 text-xs font-medium text-rose-400/90">
                                                <span className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-900/40">
                                                    {cert.year}
                                                </span>
                                                <span className="flex items-center gap-1 text-emerald-400">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Verified
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <a
                                        href={cert.verifyUrl}
                                        className="p-2 text-zinc-400 hover:text-white hover:bg-rose-950/80 rounded-lg transition-colors shrink-0"
                                        aria-label={`Verify ${cert.title}`}
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            ))}
                        </div>

                        {/* Cert Right Column: Visual Persona Badge */}
                        <div className="lg:col-span-5 flex items-center justify-center">
                            <div className="relative group w-full max-w-sm lg:max-w-none h-full min-h-[320px] sm:min-h-[420px] lg:min-h-[480px] rounded-2xl overflow-hidden border border-rose-800/40 shadow-2xl bg-[#1b070d] flex flex-col justify-end">
                                <img
                                    src={profile.certImageUrl}
                                    alt="Charlotte Certifications"
                                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0406] via-[#0b0406]/30 to-transparent"></div>
                                <div className="relative z-10 m-4 sm:m-5 p-4 rounded-xl bg-[#0b0406]/85 backdrop-blur-md border border-rose-900/40">
                                    <p className="text-xs uppercase font-mono tracking-wider text-rose-400 font-bold">
                                        Continuous Learning
                                    </p>
                                    <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                                        Always keeping up with the evolving modern web ecosystem and best engineering standards.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section
                id="projects"
                className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 sm:py-16 border-b border-rose-950/40 relative scroll-mt-20"
            >
                <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full my-auto">
                    <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-2">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-950/60 border border-rose-800/40 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>Selected Work</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                            Featured Case Studies
                        </h2>
                        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
                            A curation of production-ready web apps, responsive designs, and technical solutions.
                        </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(tag)}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedTag === tag
                                    ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                                    : "bg-[#16060a] text-zinc-400 hover:text-white border border-rose-900/30 hover:border-rose-700/50"
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {filteredProjects.map((project: Project) => (
                            <div
                                key={project.id}
                                className="group bg-[#14060a]/90 border border-rose-900/30 hover:border-rose-600/60 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-rose-950/40 transition-all flex flex-col"
                            >
                                {/* Project Image Preview */}
                                <div className="relative h-36 w-full overflow-hidden bg-zinc-900">
                                    <img
                                        src={project.imageUrl}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#14060a] via-transparent to-transparent opacity-70"></div>
                                </div>

                                {/* Project Body */}
                                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                    <div>
                                        <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-zinc-300 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>

                                    <div>
                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {project.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-800/40 text-[10px] font-medium text-rose-300"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Action Links */}
                                        <div className="flex items-center gap-2.5 pt-2 border-t border-rose-950/60">
                                            {project.demoUrl && (
                                                <a
                                                    href={project.demoUrl}
                                                    className="flex-1 text-center py-1.5 px-2.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                                                >
                                                    <ExternalLink className="w-3 h-3" /> Demo
                                                </a>
                                            )}
                                            {project.codeUrl && (
                                                <a
                                                    href={project.codeUrl}
                                                    className="flex-1 text-center py-1.5 px-2.5 rounded-lg bg-[#200a10] hover:bg-[#2e0e17] border border-rose-800/40 text-zinc-300 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                                                >
                                                    <Code2 className="w-3 h-3" /> Source
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};