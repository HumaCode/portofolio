"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Project } from "@/data/portfolio";

interface Props {
    isOpen: boolean;
    editingProject: Project | null;
    onClose: () => void;
    onSave: (project: Project, isNew: boolean) => void;
}

export const AdminProjectModal: React.FC<Props> = ({
    isOpen,
    editingProject,
    onClose,
    onSave,
}) => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Web App");
    const [desc, setDesc] = useState("");
    const [tags, setTags] = useState("");
    const [demo, setDemo] = useState("");
    const [code, setCode] = useState("");
    const [isFeatured, setIsFeatured] = useState(false);
    const [isInternal, setIsInternal] = useState(false);

    useEffect(() => {
        if (editingProject) {
            setTitle(editingProject.title);
            setCategory(editingProject.category || "Web App");
            setDesc(editingProject.description);
            setTags(editingProject.tags.join(", "));
            setDemo(editingProject.demoUrl || "");
            setCode(editingProject.codeUrl || "");
            setIsFeatured(Boolean(editingProject.isFeatured));
            setIsInternal(Boolean(editingProject.isInternal));
        } else {
            setTitle("");
            setCategory("Web App");
            setDesc("");
            setTags("");
            setDemo("");
            setCode("");
            setIsFeatured(false);
            setIsInternal(false);
        }
    }, [editingProject, isOpen]);

    if (!isOpen) return null;
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const splitTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
        const item: Project = {
            id: editingProject ? editingProject.id : `proj-${Date.now()}`,
            title,
            category,
            description: desc,
            tags: splitTags.length ? splitTags : ["Next.js", "Tailwind CSS"],
            imageUrl: editingProject?.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCpNQO6-9JwaXPggIP-hXRJFKc15qhn8FfVqKjn2Vb1QLEcPuNxmC5YaFjGOyTupTdts6a0KWmbGcT3i_Jq_WN11ngEwk6Q5nQ5KltO6DZ7rywW7UWj4nvczWSwpFIt4kOn-2HML-tTIiis1SME5Si6QfhCtKRFod0W_01FuwmCN29hzzEgmtWSm2U_SPfA1gqvpBs-3JDXzs_4U84SdGFh7r27nCd_x1k5PfIrfYTdLfnN8fC1sk3l_g",
            demoUrl: demo,
            codeUrl: code,
            isFeatured,
            isInternal,
        };
        onSave(item, !editingProject);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-[#1b1b23] border border-white/[0.1] shadow-2xl p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#13131b] text-zinc-400 hover:text-white">
                    <X className="w-4 h-4" />
                </button>
                <h3 className="text-base font-bold text-white mb-4">
                    {editingProject ? "Edit Proyek" : "Tambah Proyek Baru"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                    <div>
                        <label className="block text-zinc-300 font-medium mb-1">Judul Proyek *</label>
                        <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.1] text-white focus:outline-none focus:border-rose-500" placeholder="Nama proyek..." />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-zinc-300 font-medium mb-1">Kategori</label>
                            <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.1] text-white focus:outline-none focus:border-rose-500" placeholder="GovTech / Web App" />
                        </div>
                        <div>
                            <label className="block text-zinc-300 font-medium mb-1">Stack (koma)</label>
                            <input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.1] text-white focus:outline-none focus:border-rose-500" placeholder="React, Tailwind" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-zinc-300 font-medium mb-1">Deskripsi</label>
                        <textarea rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.1] text-white focus:outline-none focus:border-rose-500" placeholder="Deskripsi ringkas..." />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-zinc-300 font-medium mb-1">URL Live</label>
                            <input value={demo} onChange={(e) => setDemo(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.1] text-white focus:outline-none focus:border-rose-500" placeholder="https://..." />
                        </div>
                        <div>
                            <label className="block text-zinc-300 font-medium mb-1">URL Code</label>
                            <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.1] text-white focus:outline-none focus:border-rose-500" placeholder="https://github.com/..." />
                        </div>
                    </div>
                    <div className="flex items-center gap-6 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded bg-[#13131b] text-rose-600 focus:ring-rose-500" />
                            <span>Featured</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                            <input type="checkbox" checked={isInternal} onChange={(e) => setIsInternal(e.target.checked)} className="rounded bg-[#13131b] text-rose-600 focus:ring-rose-500" />
                            <span>Internal</span>
                        </label>
                    </div>
                    <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.08]">
                        <button type="button" onClick={onClose} className="px-3.5 py-1.5 rounded-xl bg-[#13131b] hover:bg-[#292932] text-zinc-300">Batal</button>
                        <button type="submit" className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md shadow-rose-600/30">
                            {editingProject ? "Simpan" : "Tambah"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

