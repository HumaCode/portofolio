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
            {/* Certificates Section - Full Viewport */}
            <section
                id="certificates"
                className="min-h-screen flex items-center justify-center pt-20 pb-16 border-b border-rose-950/40 relative scroll-mt-0"
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
                    <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/40 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                            <Award className="w-3.5 h-3.5" />
                            <span>Validated Knowledge</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                            Certifications & Credentials
                        </h2>
                        <p className="text-zinc-400 text-sm sm:text-base">
                            Officially accredited skill validations and professional achievements.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        {/* Cert Left Column: List */}
                        <div className="lg:col-span-7 space-y-4">
                            {certificates.map((cert: Certificate) => (
                                <div
                                    key={cert.id}
                                    className="bg-[#14060a]/80 border border-rose-900/30 hover:border-rose-500/50 rounded-2xl p-5 sm:p-6 transition-all shadow-lg flex items-start justify-between gap-4 group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-rose-950/90 border border-rose-700/40 flex items-center justify-center text-rose-400 shrink-0 group-hover:scale-105 group-hover:bg-rose-900/50 transition-all">
                                            <Award className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
                                                {cert.title}
                                            </h3>
                                            <p className="text-sm text-zinc-400 mt-0.5">{cert.issuer}</p>
                                            <div className="flex items-center gap-2 mt-2 text-xs font-medium text-rose-400/90">
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
                        <div className="lg:col-span-5 flex justify-center">
                            <div className="relative group w-full max-w-sm rounded-3xl overflow-hidden border border-rose-800/40 shadow-2xl bg-[#1b070d]">
                                <img
                                    src={profile.certImageUrl}
                                    alt="Charlotte Certifications"
                                    className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0406] via-[#0b0406]/20 to-transparent"></div>
                                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-[#0b0406]/85 backdrop-blur-md border border-rose-900/40">
                                    <p className="text-xs uppercase font-mono tracking-wider text-rose-400 font-bold">
                                        Continuous Learning
                                    </p>
                                    <p className="text-xs text-zinc-300 mt-1">
                                        Always keeping up with the evolving modern web ecosystem and best engineering standards.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Section - Full Viewport */}
            <section
                id="projects"
                className="min-h-screen flex items-center justify-center pt-20 pb-16 border-b border-rose-950/40 relative scroll-mt-0"
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
                    <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/40 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>Selected Work</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                            Featured Case Studies
                        </h2>
                        <p className="text-zinc-400 text-sm sm:text-base">
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
                                <div className="relative h-44 w-full overflow-hidden bg-zinc-900">
                                    <img
                                        src={project.imageUrl}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#14060a] via-transparent to-transparent opacity-70"></div>
                                </div>

                                {/* Project Body */}
                                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-zinc-300 text-xs sm:text-sm mt-2 line-clamp-3 leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>

                                    <div>
                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {project.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2.5 py-0.5 rounded-md bg-rose-950/60 border border-rose-800/40 text-[11px] font-medium text-rose-300"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Action Links */}
                                        <div className="flex items-center gap-3 pt-2 border-t border-rose-950/60">
                                            {project.demoUrl && (
                                                <a
                                                    href={project.demoUrl}
                                                    className="flex-1 text-center py-2 px-3 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" /> Demo
                                                </a>
                                            )}
                                            {project.codeUrl && (
                                                <a
                                                    href={project.codeUrl}
                                                    className="flex-1 text-center py-2 px-3 rounded-lg bg-[#200a10] hover:bg-[#2e0e17] border border-rose-800/40 text-zinc-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                                                >
                                                    <Code2 className="w-3.5 h-3.5" /> Source
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