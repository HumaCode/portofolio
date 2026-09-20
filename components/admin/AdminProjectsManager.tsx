"use client";

import React, { useState } from "react";
import { Search, Plus, Edit3, Trash2, ExternalLink, Code2, FolderGit2, Star, Lock } from "lucide-react";
import { Project } from "@/data/portfolio";
import { AdminProjectModal } from "./AdminProjectModal";

interface Props {
    projects: Project[];
    onSaveProject: (project: Project, isNew: boolean) => void;
    onDeleteProject: (id: string) => void;
    isModalOpen: boolean;
    onCloseModal: () => void;
    onOpenAddModal: () => void;
}

export const AdminProjectsManager: React.FC<Props> = ({
    projects,
    onSaveProject,
    onDeleteProject,
    isModalOpen,
    onCloseModal,
    onOpenAddModal,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Semua");
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const categories = ["Semua", "GovTech", "Public Sector", "Creative", "Enterprise", "Dashboard"];

    const filteredProjects = projects.filter((p) => {
        const matchesSearch =
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCat =
            selectedCategory === "Semua" ||
            (p.category && p.category.toLowerCase().includes(selectedCategory.toLowerCase()));

        return matchesSearch && matchesCat;
    });

    const handleOpenEdit = (project: Project) => {
        setEditingProject(project);
    };

    const handleCloseModal = () => {
        setEditingProject(null);
        onCloseModal();
    };
    return (
        <div className="rounded-2xl bg-[#1b1b23] border border-white/[0.08] shadow-2xl overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <FolderGit2 className="w-5 h-5 text-rose-500" />
                        <span>Koleksi Proyek Portofolio</span>
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                        Menampilkan {filteredProjects.length} dari {projects.length} entri proyek
                    </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative">
                        <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Cari proyek / stack..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-44 sm:w-56 pl-9 pr-3 py-1.5 rounded-xl bg-[#13131b] border border-white/[0.08] text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                        />
                    </div>

                    <button
                        onClick={onOpenAddModal}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-md shadow-rose-600/20"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah</span>
                    </button>
                </div>
            </div>

            <div className="px-5 sm:px-6 py-3 border-b border-white/[0.04] bg-[#13131b]/50 flex items-center gap-2 overflow-x-auto">
                <span className="text-[11px] text-zinc-400 mr-1 font-mono uppercase">Kategori:</span>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                            selectedCategory === cat
                                ? "bg-rose-600/20 text-rose-300 border border-rose-500/40"
                                : "bg-[#1b1b23] text-zinc-400 hover:text-white border border-white/[0.04]"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="bg-[#13131b] text-zinc-400 font-mono text-[11px] uppercase border-b border-white/[0.06]">
                        <tr>
                            <th className="px-5 py-3.5">Proyek & Kategori</th>
                            <th className="px-5 py-3.5">Tech Stack</th>
                            <th className="px-5 py-3.5">Tautan</th>
                            <th className="px-5 py-3.5">Status</th>
                            <th className="px-5 py-3.5 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                        {filteredProjects.map((p) => (
                            <tr key={p.id} className="hover:bg-[#1f1f27]/60 transition-colors group">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={p.imageUrl}
                                            alt={p.title}
                                            className="w-10 h-10 rounded-lg object-cover border border-white/[0.08] bg-[#13131b] shrink-0"
                                        />
                                        <div>
                                            <p className="font-bold text-white group-hover:text-rose-400 transition-colors">
                                                {p.title}
                                            </p>
                                            <p className="text-[11px] text-zinc-400 mt-0.5">
                                                {p.category || "General Web"}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-5 py-4">
                                    <div className="flex flex-wrap gap-1 max-w-xs">
                                        {p.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-0.5 rounded bg-[#13131b] border border-white/[0.06] text-[10px] text-zinc-300 font-mono"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        {p.demoUrl && p.demoUrl !== "#" && (
                                            <a
                                                href={p.demoUrl}
                                                target="_blank"
                                                className="px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[11px] font-medium border border-cyan-500/30 flex items-center gap-1"
                                            >
                                                <ExternalLink className="w-3 h-3" /> Live
                                            </a>
                                        )}
                                        {p.codeUrl && p.codeUrl !== "#" && (
                                            <a
                                                href={p.codeUrl}
                                                target="_blank"
                                                className="px-2.5 py-1 rounded bg-[#13131b] hover:bg-[#292932] text-zinc-300 text-[11px] font-medium border border-white/[0.08] flex items-center gap-1"
                                            >
                                                <Code2 className="w-3 h-3" /> Code
                                            </a>
                                        )}
                                        {p.isInternal && (
                                            <span className="text-[11px] text-zinc-400 italic flex items-center gap-1">
                                                <Lock className="w-3 h-3 text-amber-400" /> Internal
                                            </span>
                                        )}
                                    </div>
                                </td>

                                <td className="px-5 py-4">
                                    {p.isFeatured ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-bold font-mono">
                                            <Star className="w-3 h-3 fill-rose-500 text-rose-500" /> FEATURED
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold font-mono">
                                            PUBLIK
                                        </span>
                                    )}
                                </td>

                                <td className="px-5 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                        <button
                                            onClick={() => handleOpenEdit(p)}
                                            className="p-1.5 rounded-lg bg-[#13131b] hover:bg-rose-600/20 hover:text-rose-400 text-zinc-400 border border-white/[0.06] transition-colors"
                                            title="Edit Proyek"
                                        >
                                            <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => onDeleteProject(p.id)}
                                            className="p-1.5 rounded-lg bg-[#13131b] hover:bg-red-600/20 hover:text-red-400 text-zinc-400 border border-white/[0.06] transition-colors"
                                            title="Hapus Proyek"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AdminProjectModal
                isOpen={isModalOpen || Boolean(editingProject)}
                editingProject={editingProject}
                onClose={handleCloseModal}
                onSave={onSaveProject}
            />
        </div>
    );
};



