import React, { useState } from "react";
import { ExternalLink, Code2, FolderGit2, Star, Lock, Calendar, Layers, ShieldCheck, Tag, ZoomIn } from "lucide-react";
import { Project } from "@/data/portfolio";
import { Modal } from "../Modal";
import { ImageLightbox } from "../ImageLightbox";

interface Props {
    isOpen: boolean;
    project: Project | null;
    onClose: () => void;
    onEdit?: (project: Project) => void;
}

export const AdminProjectDetailModal: React.FC<Props> = ({
    isOpen,
    project,
    onClose,
    onEdit,
}) => {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    if (!project) return null;

    return (
        <>
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={project.title}
            subtitle={`Kategori: ${project.category || "General Web"} • Status: ${project.isFeatured ? "Featured" : "Publik"}`}
            icon={<FolderGit2 className="w-5 h-5 text-rose-500" />}
            size="2xl"
        >
            <div className="space-y-5 text-xs text-zinc-300">
                {/* Hero Thumbnail Display */}
                <div
                    onClick={() => setIsLightboxOpen(true)}
                    className="relative w-full h-48 sm:h-56 rounded-2xl bg-[#13131b] border border-white/[0.08] overflow-hidden group cursor-zoom-in"
                    title="Klik untuk memperbesar pratinjau gambar"
                >
                    <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuCpNQO6-9JwaXPggIP-hXRJFKc15qhn8FfVqKjn2Vb1QLEcPuNxmC5YaFjGOyTupTdts6a0KWmbGcT3i_Jq_WN11ngEwk6Q5nQ5KltO6DZ7rywW7UWj4nvczWSwpFIt4kOn-2HML-tTIiis1SME5Si6QfhCtKRFod0W_01FuwmCN29hzzEgmtWSm2U_SPfA1gqvpBs-3JDXzs_4U84SdGFh7r27nCd_x1k5PfIrfYTdLfnN8fC1sk3l_g";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14060a] via-transparent to-transparent opacity-80" />
                    
                    {/* Hover Zoom Hint */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/[0.1] text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] font-medium">
                        <ZoomIn className="w-3.5 h-3.5 text-rose-400" />
                        <span>Perbesar</span>
                    </div>
                    
                    {/* Floating Badges */}
                    <div className="absolute bottom-3 left-4 flex flex-wrap items-center gap-2">
                        {project.isFeatured && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 backdrop-blur-md text-rose-300 border border-rose-500/40 text-[10px] font-bold font-mono">
                                <Star className="w-3 h-3 fill-rose-400 text-rose-400" /> FEATURED
                            </span>
                        )}
                        {project.isInternal ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/40 text-[10px] font-bold font-mono">
                                <Lock className="w-3 h-3 text-amber-400" /> INTERNAL PROJECT
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-[10px] font-bold font-mono">
                                <ShieldCheck className="w-3 h-3 text-emerald-400" /> PUBLIC ACCESSIBLE
                            </span>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div className="p-4 rounded-xl bg-[#13131b]/60 border border-white/[0.06] space-y-1">
                    <h4 className="font-mono text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                        Deskripsi Proyek
                    </h4>
                    <p className="text-xs text-zinc-200 leading-relaxed pt-1">
                        {project.description || "Tidak ada deskripsi rinci yang dicantumkan untuk proyek ini."}
                    </p>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#13131b]/60 border border-white/[0.06] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-800/40 flex items-center justify-center text-rose-400 shrink-0">
                            <Layers className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] text-zinc-400 font-mono uppercase">Kategori Utama</span>
                            <span className="font-semibold text-white truncate text-xs">
                                {project.category || "General Web Project"}
                            </span>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#13131b]/60 border border-white/[0.06] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400 shrink-0">
                            <Tag className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] text-zinc-400 font-mono uppercase">Total Tech Stack</span>
                            <span className="font-semibold text-white text-xs">
                                {project.tags.length} Komponen Teknologi
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tech Stack List */}
                <div className="space-y-1.5">
                    <h4 className="font-mono text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                        Teknologi & Framework
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2.5 py-1 rounded-lg bg-[#13131b] border border-white/[0.08] text-zinc-200 font-mono text-[11px] font-medium"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Tautan Akses */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        {project.demoUrl && project.demoUrl !== "#" && (
                            <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold border border-cyan-500/30 flex items-center gap-1.5 transition-all"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Buka Live Demo</span>
                            </a>
                        )}
                        {project.codeUrl && project.codeUrl !== "#" && (
                            <a
                                href={project.codeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3.5 py-2 rounded-xl bg-[#13131b] hover:bg-[#252532] text-zinc-300 hover:text-white text-xs font-semibold border border-white/[0.08] flex items-center gap-1.5 transition-all"
                            >
                                <Code2 className="w-3.5 h-3.5" />
                                <span>Lihat Repository Code</span>
                            </a>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl bg-[#13131b] hover:bg-[#252532] border border-white/[0.08] text-zinc-300 text-xs font-semibold transition-all"
                        >
                            Tutup
                        </button>
                        {onEdit && (
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onEdit(project);
                                }}
                                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all active:scale-95"
                            >
                                Edit Proyek
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Modal>

        <ImageLightbox
            isOpen={isLightboxOpen}
            imageUrl={project.imageUrl}
            title={project.title}
            onClose={() => setIsLightboxOpen(false)}
        />
        </>
    );
};
