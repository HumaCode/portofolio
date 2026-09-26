"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    Cpu,
    Plus,
    Search,
    Edit2,
    Edit3,
    Trash2,
    Save,
    X,
    Tag,
    Layers,
    Loader2,
} from "lucide-react";
import { SkillGauge } from "@/data/portfolio";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

interface AdminSkill extends SkillGauge {
    id: string;
    categoryId?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface SkillCategoryItem {
    id: string;
    name: string;
    slug: string;
    description?: string;
    skillCount?: number;
    createdAt?: string;
}

interface AdminSkillsManagerProps {
    onShowToast: (text: string, type?: "success" | "error" | "info", title?: string) => void;
}

const COLOR_PRESETS = [
    { label: "Rose & Red", color: "from-rose-500 to-red-600", strokeColor: "#f43f5e" },
    { label: "Cyan & Blue", color: "from-cyan-400 to-blue-500", strokeColor: "#06b6d4" },
    { label: "Emerald & Green", color: "from-emerald-400 to-green-500", strokeColor: "#10b981" },
    { label: "Sky & Indigo", color: "from-sky-400 to-indigo-500", strokeColor: "#38bdf8" },
    { label: "Amber & Yellow", color: "from-amber-400 to-yellow-500", strokeColor: "#facc15" },
    { label: "Purple & Violet", color: "from-purple-500 to-violet-600", strokeColor: "#8b5cf6" },
];

export const AdminSkillsManager: React.FC<AdminSkillsManagerProps> = ({ onShowToast }) => {
    const [skills, setSkills] = useState<AdminSkill[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    // Modal state for Skills
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<AdminSkill | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form state for Skills
    const [formName, setFormName] = useState("");
    const [formCategory, setFormCategory] = useState("Frontend");
    const [formPercentage, setFormPercentage] = useState(85);
    const [formColorIndex, setFormColorIndex] = useState(0);

    // Category Management state
    const [dbCategories, setDbCategories] = useState<SkillCategoryItem[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [catFormName, setCatFormName] = useState("");
    const [catFormDesc, setCatFormDesc] = useState("");
    const [editingCategory, setEditingCategory] = useState<SkillCategoryItem | null>(null);
    const [savingCategory, setSavingCategory] = useState(false);

    // Confirm delete states
    const [deletingCategory, setDeletingCategory] = useState<{ id: string; name: string } | null>(null);
    const [deletingSkill, setDeletingSkill] = useState<{ id: string; name: string } | null>(null);
    const [isDeletingCategoryLoading, setIsDeletingCategoryLoading] = useState(false);
    const [isDeletingSkillLoading, setIsDeletingSkillLoading] = useState(false);

    const fetchSkills = useCallback(async () => {
        try {
            const res = await fetch("/api/skills");
            if (res.ok) {
                const data = await res.json();
                setSkills(data);
            }
        } catch (err) {
            console.error("Failed to load skills", err);
            onShowToast("Gagal memuat data keahlian dari database.", "error");
        } finally {
            setLoading(false);
        }
    }, [onShowToast]);

    const fetchSkillCategories = useCallback(async () => {
        try {
            setLoadingCategories(true);
            const res = await fetch("/api/skill-categories");
            if (res.ok) {
                const data = await res.json();
                setDbCategories(data);
            }
        } catch (err) {
            console.error("Failed to load skill categories", err);
        } finally {
            setLoadingCategories(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            try {
                const res = await fetch("/api/skills");
                if (res.ok && isMounted) {
                    const data = await res.json();
                    setSkills(data);
                }
            } catch (err) {
                console.error("Failed to load skills", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        load();
        fetchSkillCategories();
        return () => {
            isMounted = false;
        };
    }, [fetchSkillCategories]);

    const categories = useMemo(() => {
        const catNames = new Set<string>();
        dbCategories.forEach((c) => catNames.add(c.name));
        skills.forEach((s) => {
            if (s.category) catNames.add(s.category);
        });
        return ["All", ...Array.from(catNames)];
    }, [dbCategories, skills]);

    const filteredSkills = skills.filter((skill) => {
        const matchesSearch =
            skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (skill.category && skill.category.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory =
            selectedCategory === "All" || skill.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const openCreateModal = () => {
        setEditingSkill(null);
        setFormName("");
        setFormCategory(dbCategories[0]?.name || "Frontend");
        setFormPercentage(85);
        setFormColorIndex(0);
        setIsModalOpen(true);
    };

    const openEditModal = (skill: AdminSkill) => {
        setEditingSkill(skill);
        setFormName(skill.name);
        setFormCategory(skill.category || (dbCategories[0]?.name || "General"));
        setFormPercentage(skill.percentage);

        const foundIndex = COLOR_PRESETS.findIndex(
            (p) => p.strokeColor.toLowerCase() === skill.strokeColor?.toLowerCase()
        );
        setFormColorIndex(foundIndex >= 0 ? foundIndex : 0);
        setIsModalOpen(true);
    };

    // Category Handlers
    const handleStartEditCategory = (cat: SkillCategoryItem) => {
        setEditingCategory(cat);
        setCatFormName(cat.name);
        setCatFormDesc(cat.description && cat.description !== "-" ? cat.description : "");
    };

    const handleCancelEditCategory = () => {
        setEditingCategory(null);
        setCatFormName("");
        setCatFormDesc("");
    };

    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!catFormName.trim()) {
            onShowToast("Nama kategori skill wajib diisi!", "error");
            return;
        }

        setSavingCategory(true);
        try {
            const res = await fetch("/api/skill-categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editingCategory ? editingCategory.id : undefined,
                    name: catFormName.trim(),
                    description: catFormDesc.trim(),
                }),
            });

            if (res.ok) {
                await fetchSkillCategories();
                await fetchSkills();
                onShowToast(
                    editingCategory
                        ? `Kategori "${catFormName}" berhasil diperbarui!`
                        : `Kategori "${catFormName}" berhasil ditambahkan!`,
                    "success"
                );
                handleCancelEditCategory();
            } else {
                const data = await res.json();
                onShowToast(data.error || "Gagal menyimpan kategori.", "error");
            }
        } catch (err) {
            console.error("Save skill category error:", err);
            onShowToast("Terjadi kesalahan saat menyimpan kategori.", "error");
        } finally {
            setSavingCategory(false);
        }
    };

    const executeDeleteCategory = async () => {
        if (!deletingCategory) return;
        setIsDeletingCategoryLoading(true);
        try {
            const res = await fetch(`/api/skill-categories?id=${encodeURIComponent(deletingCategory.id)}`, {
                method: "DELETE",
            });
            if (res.ok) {
                await fetchSkillCategories();
                await fetchSkills();
                if (editingCategory?.id === deletingCategory.id) {
                    handleCancelEditCategory();
                }
                onShowToast(`Kategori "${deletingCategory.name}" berhasil dihapus.`, "success");
                setDeletingCategory(null);
            } else {
                const data = await res.json();
                onShowToast(data.error || "Gagal menghapus kategori.", "error");
            }
        } catch (err) {
            console.error("Delete skill category error:", err);
            onShowToast("Terjadi kesalahan saat menghapus kategori.", "error");
        } finally {
            setIsDeletingCategoryLoading(false);
        }
    };

    const handleSaveSkill = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName.trim()) {
            onShowToast("Nama keahlian wajib diisi!", "error");
            return;
        }

        const preset = COLOR_PRESETS[formColorIndex] || COLOR_PRESETS[0];
        const matchedCategory = dbCategories.find(
            (c) => c.name.toLowerCase() === formCategory.trim().toLowerCase()
        );

        setSubmitting(true);
        try {
            const payload = {
                id: editingSkill ? editingSkill.id : undefined,
                name: formName.trim(),
                category: formCategory.trim() || "General",
                categoryId: matchedCategory?.id || undefined,
                percentage: formPercentage,
                color: preset.color,
                strokeColor: preset.strokeColor,
            };

            const res = await fetch("/api/skills", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                await fetchSkills();
                setIsModalOpen(false);
                onShowToast(
                    editingSkill
                        ? `Skill "${payload.name}" berhasil diperbarui!`
                        : `Skill "${payload.name}" berhasil ditambahkan!`,
                    "success"
                );
            } else {
                const data = await res.json();
                onShowToast(data.error || "Gagal menyimpan skill.", "error");
            }
        } catch (err) {
            console.error("Save skill error:", err);
            onShowToast("Terjadi kesalahan saat menyimpan skill.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const executeDeleteSkill = async () => {
        if (!deletingSkill) return;
        setIsDeletingSkillLoading(true);
        try {
            const res = await fetch(`/api/skills?id=${encodeURIComponent(deletingSkill.id)}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setSkills((prev) => prev.filter((s) => s.id !== deletingSkill.id));
                onShowToast(`Skill "${deletingSkill.name}" berhasil dihapus.`, "success");
                setDeletingSkill(null);
            } else {
                onShowToast("Gagal menghapus skill.", "error");
            }
        } catch (err) {
            console.error("Delete skill error:", err);
            onShowToast("Terjadi kesalahan saat menghapus skill.", "error");
        } finally {
            setIsDeletingSkillLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="rounded-2xl bg-[#1b1b23] border border-white/[0.08] shadow-2xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-2">
                            <Cpu className="w-3.5 h-3.5" />
                            <span>Section Skills Management</span>
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
                            <span>Kelola Technical Skills & Gauges</span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-600/20 text-rose-300 border border-rose-500/30">
                                {skills.length} Skills
                            </span>
                        </h2>
                        <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                            Atur keahlian teknis dengan persentase gauge melingkar yang tampil di section Skills halaman publik.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
                        <button
                            onClick={() => setIsCategoryModalOpen(true)}
                            className="px-3.5 py-2.5 rounded-xl bg-[#13131b] hover:bg-[#252533] text-zinc-300 hover:text-white border border-white/[0.08] hover:border-rose-500/40 font-semibold text-xs transition-all flex items-center gap-2 shadow-sm"
                            title="Manajemen Kategori Skill"
                        >
                            <Tag className="w-3.5 h-3.5 text-rose-400" />
                            <span>Kelola Kategori</span>
                            {dbCategories.length > 0 && (
                                <span className="px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-mono text-[10px]">
                                    {dbCategories.length}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={openCreateModal}
                            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold text-xs transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Tambah Skill Baru</span>
                        </button>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Cari nama skill atau kategori..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#13131b] border border-white/[0.08] text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                        />
                    </div>

                    {/* Category Filter Pills & Quick Category Action */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                    selectedCategory === cat
                                        ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                                        : "bg-[#13131b] text-zinc-400 hover:text-white border border-white/[0.06]"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}

                        <button
                            onClick={() => setIsCategoryModalOpen(true)}
                            className="shrink-0 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all ml-1"
                            title="Kelola Kategori Skill"
                        >
                            <Layers className="w-3.5 h-3.5" />
                            <span>Kategori</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Skills Grid */}
            {loading ? (
                <div className="p-12 text-center text-zinc-400 bg-[#1b1b23] border border-white/[0.08] rounded-2xl">
                    <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin mx-auto mb-3"></div>
                    <p className="text-xs">Memuat data keahlian dari database...</p>
                </div>
            ) : filteredSkills.length === 0 ? (
                <div className="p-12 text-center text-zinc-400 bg-[#1b1b23] border border-white/[0.08] rounded-2xl space-y-3">
                    <Cpu className="w-12 h-12 text-rose-500/40 mx-auto" />
                    <h3 className="text-sm font-semibold text-white">Tidak ada skill yang ditemukan</h3>
                    <p className="text-xs max-w-sm mx-auto">
                        {searchQuery
                            ? `Tidak ada skill yang cocok dengan kata kunci "${searchQuery}".`
                            : "Belum ada data skill yang tersimpan di database."}
                    </p>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all inline-flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Skill Pertama</span>
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredSkills.map((skill) => {
                        const radius = 38;
                        const circumference = 2 * Math.PI * radius;
                        const strokeDashoffset = circumference - (skill.percentage / 100) * circumference;

                        return (
                            <div
                                key={skill.id}
                                className="p-5 rounded-2xl bg-[#1b1b23] border border-white/[0.08] hover:border-rose-500/40 transition-all shadow-xl flex items-center justify-between gap-4 group"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    {/* Circular Preview Gauge */}
                                    <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 90 90">
                                            <circle
                                                cx="45"
                                                cy="45"
                                                r={radius}
                                                fill="none"
                                                stroke="#240c12"
                                                strokeWidth="7"
                                            />
                                            <circle
                                                cx="45"
                                                cy="45"
                                                r={radius}
                                                fill="none"
                                                stroke={skill.strokeColor || "#f43f5e"}
                                                strokeWidth="7"
                                                strokeLinecap="round"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={strokeDashoffset}
                                                className="transition-all duration-700"
                                            />
                                        </svg>
                                        <span className="absolute text-xs font-bold text-white font-mono">
                                            {skill.percentage}%
                                        </span>
                                    </div>

                                    {/* Skill Details */}
                                    <div className="truncate">
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 border border-rose-900/40 text-rose-400 font-semibold uppercase">
                                            {skill.category || "General"}
                                        </span>
                                        <h3 className="text-sm font-bold text-white mt-1 group-hover:text-rose-300 transition-colors truncate">
                                            {skill.name}
                                        </h3>
                                        <div className="flex items-center gap-1.5 mt-1.5">
                                            <span
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{ backgroundColor: skill.strokeColor || "#f43f5e" }}
                                            ></span>
                                            <span className="text-[11px] text-zinc-400 font-mono truncate">
                                                {skill.strokeColor}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                        onClick={() => openEditModal(skill)}
                                        title="Edit Skill"
                                        className="p-2 rounded-xl bg-[#13131b] hover:bg-rose-600/20 text-zinc-400 hover:text-rose-400 border border-white/[0.06] hover:border-rose-500/30 transition-all"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => setDeletingSkill({ id: skill.id, name: skill.name })}
                                        title="Hapus Skill"
                                        className="p-2 rounded-xl bg-[#13131b] hover:bg-red-600/20 text-zinc-400 hover:text-red-400 border border-white/[0.06] hover:border-red-500/30 transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal Tambah / Edit Skill */}
            {isModalOpen && (
                <div
                    data-lenis-prevent
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
                >
                    <div
                        data-lenis-prevent
                        className="w-full max-w-lg rounded-2xl bg-[#1b1b23] border border-white/[0.1] shadow-2xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto overscroll-contain"
                    >
                        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                                    <Cpu className="w-4 h-4" />
                                </div>
                                <h3 className="text-base font-bold text-white">
                                    {editingSkill ? "Edit Data Keahlian" : "Tambah Keahlian Baru"}
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveSkill} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-zinc-300 font-semibold mb-1.5">
                                    Nama Teknologi / Keahlian <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="Contoh: React & Next.js, Laravel 11, Flutter"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131b] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500 text-xs"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-zinc-300 font-semibold">
                                            Kategori Skill <span className="text-rose-500">*</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setIsCategoryModalOpen(true)}
                                            className="text-[11px] text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 hover:underline"
                                        >
                                            <Tag className="w-3 h-3" />
                                            <span>Kelola Kategori</span>
                                        </button>
                                    </div>
                                    <select
                                        value={formCategory}
                                        onChange={(e) => setFormCategory(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131b] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500 text-xs"
                                    >
                                        {dbCategories.map((c) => (
                                            <option key={c.id || c.name} value={c.name} className="bg-[#1b1b23] text-white">
                                                {c.name}
                                            </option>
                                        ))}
                                        {formCategory && !dbCategories.some((c) => c.name.toLowerCase() === formCategory.toLowerCase()) && (
                                            <option value={formCategory} className="bg-[#1b1b23] text-white">
                                                {formCategory} (Kustom)
                                            </option>
                                        )}
                                        {dbCategories.length === 0 && (
                                            <>
                                                <option value="Frontend">Frontend</option>
                                                <option value="Backend">Backend</option>
                                                <option value="Mobile">Mobile</option>
                                                <option value="Database">Database</option>
                                                <option value="General">General</option>
                                            </>
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-zinc-300 font-semibold">Persentase Keahlian</label>
                                        <span className="font-mono font-bold text-rose-400">{formPercentage}%</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            min="10"
                                            max="100"
                                            step="1"
                                            value={formPercentage}
                                            onChange={(e) => setFormPercentage(parseInt(e.target.value, 10))}
                                            className="flex-1 accent-rose-500"
                                        />
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formPercentage}
                                            onChange={(e) =>
                                                setFormPercentage(
                                                    Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0))
                                                )
                                            }
                                            className="w-16 px-2 py-1.5 rounded-lg bg-[#13131b] border border-white/[0.08] text-white text-center font-mono text-xs focus:outline-none focus:border-rose-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Preset Warna Visual */}
                            <div>
                                <label className="block text-zinc-300 font-semibold mb-2">
                                    Skema Warna Gauge Visual
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {COLOR_PRESETS.map((preset, idx) => (
                                        <button
                                            type="button"
                                            key={preset.label}
                                            onClick={() => setFormColorIndex(idx)}
                                            className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                                                formColorIndex === idx
                                                    ? "bg-rose-500/10 border-rose-500 ring-1 ring-rose-500/40 text-white"
                                                    : "bg-[#13131b] border-white/[0.06] text-zinc-400 hover:text-white"
                                            }`}
                                        >
                                            <span
                                                className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                                                style={{ backgroundColor: preset.strokeColor }}
                                            ></span>
                                            <span className="text-[11px] font-medium truncate">{preset.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-xl bg-[#13131b] hover:bg-[#252533] border border-white/[0.08] text-zinc-300 hover:text-white font-semibold transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold transition-all shadow-lg shadow-rose-600/30 flex items-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                                            <span>Menyimpan...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            <span>{editingSkill ? "Perbarui Skill" : "Simpan Skill"}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Manajemen Kategori Skill */}
            {isCategoryModalOpen && (
                <div
                    data-lenis-prevent
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
                >
                    <div
                        data-lenis-prevent
                        className="rounded-2xl bg-[#1b1b23] border border-white/[0.08] shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh]"
                    >
                        {/* Header Modal */}
                        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                                    <Tag className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white tracking-tight">
                                        Manajemen Kategori Skill
                                    </h3>
                                    <p className="text-[11px] text-zinc-400">
                                        Kelola pengelompokan skill teknis untuk filter dan tampilan visual
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setIsCategoryModalOpen(false);
                                    handleCancelEditCategory();
                                }}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div data-lenis-prevent className="p-5 space-y-6 overflow-y-auto overscroll-contain flex-1">
                            {/* Form Input Kategori Baru / Edit */}
                            <form onSubmit={handleSaveCategory} className="p-4 rounded-xl bg-[#13131b]/80 border border-white/[0.06] space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                                        {editingCategory ? <Edit3 className="w-3.5 h-3.5 text-rose-400" /> : <Plus className="w-3.5 h-3.5 text-rose-400" />}
                                        <span>{editingCategory ? `Edit Kategori: ${editingCategory.name}` : "Tambah Kategori Baru"}</span>
                                    </span>
                                    {editingCategory && (
                                        <button
                                            type="button"
                                            onClick={handleCancelEditCategory}
                                            className="text-[11px] text-zinc-400 hover:text-white"
                                        >
                                            Batal Edit
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                                            Nama Kategori <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={catFormName}
                                            onChange={(e) => setCatFormName(e.target.value)}
                                            placeholder="Contoh: Frontend, Cloud, DevOps"
                                            className="w-full px-3 py-2 rounded-xl bg-[#1b1b23] border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                                            Deskripsi (Opsional)
                                        </label>
                                        <input
                                            type="text"
                                            value={catFormDesc}
                                            onChange={(e) => setCatFormDesc(e.target.value)}
                                            placeholder="Penjelasan singkat kategori..."
                                            className="w-full px-3 py-2 rounded-xl bg-[#1b1b23] border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-1">
                                    <button
                                        type="submit"
                                        disabled={savingCategory}
                                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold text-xs transition-all shadow-md shadow-rose-600/30 flex items-center gap-1.5"
                                    >
                                        {savingCategory ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                <span>Menyimpan...</span>
                                            </>
                                        ) : editingCategory ? (
                                            <>
                                                <Save className="w-3.5 h-3.5" />
                                                <span>Perbarui Kategori</span>
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-3.5 h-3.5" />
                                                <span>Simpan Kategori</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Daftar Kategori Terdaftar */}
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
                                        Kategori Terdaftar ({dbCategories.length})
                                    </h4>
                                    {loadingCategories && (
                                        <span className="text-[11px] text-rose-400 flex items-center gap-1">
                                            <Loader2 className="w-3 h-3 animate-spin" /> Memuat...
                                        </span>
                                    )}
                                </div>

                                <div
                                    data-lenis-prevent
                                    className="rounded-xl border border-white/[0.08] bg-[#13131b]/60 max-h-60 overflow-y-auto overscroll-contain"
                                >
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-[#1b1b23] text-zinc-400 font-mono text-[11px] uppercase border-b border-white/[0.06] sticky top-0">
                                            <tr>
                                                <th className="px-4 py-2.5">Nama Kategori</th>
                                                <th className="px-4 py-2.5">Slug</th>
                                                <th className="px-4 py-2.5">Jumlah Skill</th>
                                                <th className="px-4 py-2.5 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.04]">
                                            {dbCategories.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="py-8 px-4 text-center text-zinc-400">
                                                        <div className="flex flex-col items-center justify-center space-y-1.5">
                                                            <Tag className="w-6 h-6 text-rose-500/50" />
                                                            <p className="text-xs font-semibold text-zinc-300">Belum ada kategori terdaftar</p>
                                                            <p className="text-[11px] text-zinc-500">Gunakan form di atas untuk menambahkan kategori baru.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                dbCategories.map((cat) => (
                                                    <tr key={cat.id || cat.slug} className="hover:bg-white/[0.02]">
                                                        <td className="px-4 py-2.5 font-semibold text-zinc-200">
                                                            {cat.name}
                                                            {cat.description && cat.description !== "-" && (
                                                                <p className="text-[10px] text-zinc-500 font-normal">{cat.description}</p>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-2.5 font-mono text-rose-400/90 text-[11px]">
                                                            /{cat.slug}
                                                        </td>
                                                        <td className="px-4 py-2.5">
                                                            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-mono border border-white/[0.06]">
                                                                {cat.skillCount || 0} skill
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2.5 text-right">
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                <button
                                                                    onClick={() => handleStartEditCategory(cat)}
                                                                    className="p-1.5 rounded-lg bg-[#13131b] hover:bg-rose-600/20 hover:text-rose-400 text-zinc-400 border border-white/[0.06] transition-colors"
                                                                    title="Edit Kategori"
                                                                >
                                                                    <Edit3 className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeletingCategory({ id: cat.id, name: cat.name })}
                                                                    className="p-1.5 rounded-lg bg-[#13131b] hover:bg-red-600/20 hover:text-red-400 text-zinc-400 border border-white/[0.06] transition-colors"
                                                                    title="Hapus Kategori"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-[#171720] border-t border-white/[0.06] flex justify-end">
                            <button
                                onClick={() => {
                                    setIsCategoryModalOpen(false);
                                    handleCancelEditCategory();
                                }}
                                className="px-4 py-2 rounded-xl bg-[#13131b] hover:bg-[#252533] border border-white/[0.08] text-xs font-semibold text-zinc-300 hover:text-white transition-all"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus Kategori */}
            <ConfirmDeleteModal
                isOpen={Boolean(deletingCategory)}
                title="Konfirmasi Hapus Kategori"
                itemName={deletingCategory?.name}
                itemType="kategori skill"
                message={
                    <>
                        Apakah Anda yakin ingin menghapus kategori{" "}
                        <span className="font-semibold text-rose-400">"{deletingCategory?.name}"</span>?
                        Keahlian teknis yang terdaftar di kategori ini tidak akan terhapus, melainkan kategorinya akan dilepas.
                    </>
                }
                isLoading={isDeletingCategoryLoading}
                onConfirm={executeDeleteCategory}
                onCancel={() => setDeletingCategory(null)}
            />

            {/* Modal Konfirmasi Hapus Skill */}
            <ConfirmDeleteModal
                isOpen={Boolean(deletingSkill)}
                title="Konfirmasi Hapus Keahlian"
                itemName={deletingSkill?.name}
                itemType="keahlian"
                message={
                    <>
                        Apakah Anda yakin ingin menghapus keahlian{" "}
                        <span className="font-semibold text-rose-400">"{deletingSkill?.name}"</span> secara permanen dari portofolio?
                    </>
                }
                isLoading={isDeletingSkillLoading}
                onConfirm={executeDeleteSkill}
                onCancel={() => setDeletingSkill(null)}
            />
        </div>
    );
};
