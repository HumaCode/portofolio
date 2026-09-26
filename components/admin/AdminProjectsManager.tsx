"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Edit3, Trash2, ExternalLink, Code2, FolderGit2, Star, Lock, AlertTriangle, Eye, Tag, Loader2 } from "lucide-react";
import { Project } from "@/data/portfolio";
import { AdminProjectModal } from "./AdminProjectModal";
import { AdminProjectDetailModal } from "./AdminProjectDetailModal";
import { Pagination } from "../Pagination";
import { Modal } from "../Modal";
import { ImageLightbox } from "../ImageLightbox";

import { ToastType } from "./AdminToast";

export interface CategoryItem {
    id?: string;
    name: string;
    slug: string;
    description?: string;
    projectCount?: number;
}

interface Props {
    projects: Project[];
    onSaveProject: (project: Project, isNew: boolean) => void;
    onDeleteProject: (id: string) => void;
    isModalOpen: boolean;
    onCloseModal: () => void;
    onOpenAddModal: () => void;
    showToast?: (text: string, type?: ToastType, title?: string) => void;
}

export const AdminProjectsManager: React.FC<Props> = ({
    projects,
    onSaveProject,
    onDeleteProject,
    isModalOpen,
    onCloseModal,
    onOpenAddModal,
    showToast,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Semua");
    const [currentPage, setCurrentPage] = useState(1);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [deletingProject, setDeletingProject] = useState<Project | null>(null);
    const [viewingProject, setViewingProject] = useState<Project | null>(null);
    const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);
    
    // Category management state
    const [dbCategories, setDbCategories] = useState<CategoryItem[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
    const [newCatName, setNewCatName] = useState("");
    const [newCatDesc, setNewCatDesc] = useState("");
    const [submittingCat, setSubmittingCat] = useState(false);
    const [catError, setCatError] = useState<string | null>(null);
    const [deletingCatId, setDeletingCatId] = useState<string | null>(null);

    const ITEMS_PER_PAGE = 5;

    // Fetch categories from database
    const fetchDBCategories = async () => {
        try {
            setLoadingCategories(true);
            const res = await fetch("/api/categories");
            if (res.ok) {
                const data = await res.json();
                setDbCategories(data);
            }
        } catch (e) {
            console.error("Gagal mengambil data kategori:", e);
        } finally {
            setLoadingCategories(false);
        }
    };

    useEffect(() => {
        fetchDBCategories();
    }, []);

    // Murni mengambil daftar kategori dari tabel database ProjectCategory
    const dbCatNames = dbCategories.map((c) => c.name);
    const projectCatNames = projects.map((p) => p.category).filter((c): c is string => Boolean(c));
    const allCategoryNames = Array.from(new Set([...dbCatNames, ...projectCatNames]));
    
    // Tab "Semua" di posisi pertama disusul kategori dari database
    const categories: string[] = ["Semua", ...allCategoryNames];

    const slugify = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, "")
            .replace(/\-\-+/g, "-");
    };

    const handleStartEditCategory = (cat: CategoryItem) => {
        setEditingCategory(cat);
        setNewCatName(cat.name);
        setNewCatDesc(cat.description && cat.description !== "-" ? cat.description : "");
        setCatError(null);
    };

    const handleCancelEditCategory = () => {
        setEditingCategory(null);
        setNewCatName("");
        setNewCatDesc("");
        setCatError(null);
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatName.trim()) return;

        setSubmittingCat(true);
        setCatError(null);
        try {
            const isEditing = Boolean(editingCategory?.id);
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editingCategory?.id || undefined,
                    name: newCatName.trim(),
                    description: newCatDesc.trim() || undefined,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setCatError(data.error || "Gagal menyimpan kategori");
                showToast?.(data.error || "Gagal menyimpan kategori", "error");
            } else {
                const savedName = newCatName.trim();
                setNewCatName("");
                setNewCatDesc("");
                setEditingCategory(null);
                fetchDBCategories();
                showToast?.(
                    isEditing ? `Kategori "${savedName}" berhasil diperbarui!` : `Kategori "${savedName}" berhasil ditambahkan!`,
                    "success",
                    isEditing ? "Kategori Diperbarui" : "Kategori Dibuat"
                );
            }
        } catch (err) {
            setCatError("Terjadi kesalahan jaringan.");
            showToast?.("Terjadi kesalahan jaringan saat menyimpan kategori.", "error");
        } finally {
            setSubmittingCat(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        const target = dbCategories.find((c) => c.id === id);
        try {
            setDeletingCatId(id);
            const res = await fetch(`/api/categories?id=${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchDBCategories();
                showToast?.(`Kategori "${target?.name || "terpilih"}" berhasil dihapus.`, "danger", "Kategori Dihapus");
            } else {
                showToast?.("Gagal menghapus kategori.", "error");
            }
        } catch (e) {
            console.error("Gagal menghapus kategori:", e);
            showToast?.("Terjadi kesalahan jaringan.", "error");
        } finally {
            setDeletingCatId(null);
        }
    };

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

    // Reset to page 1 whenever filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
    const paginatedProjects = filteredProjects.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

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

            <div className="px-5 sm:px-6 py-3 border-b border-white/[0.04] bg-[#13131b]/50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                    <span className="text-[11px] text-zinc-400 mr-1 font-mono uppercase shrink-0">Kategori:</span>
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

                <button
                    onClick={() => setIsAddCategoryOpen(true)}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    title="Tambah Kategori Baru"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Kategori</span>
                </button>
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
                        {filteredProjects.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 px-5 text-center text-zinc-400">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <FolderGit2 className="w-10 h-10 text-zinc-600 animate-pulse" />
                                        <p className="text-sm font-semibold text-zinc-300">Belum ada proyek yang ditemukan</p>
                                        <p className="text-xs text-zinc-500 max-w-sm">
                                            {searchQuery || selectedCategory !== "Semua"
                                                ? "Coba ubah kata kunci pencarian atau filter kategori yang dipilih."
                                                : "Belum ada entri proyek di database. Klik tombol 'Tambah' di atas untuk membuat proyek baru."}
                                        </p>
                                        {(searchQuery || selectedCategory !== "Semua") && (
                                            <button
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setSelectedCategory("Semua");
                                                }}
                                                className="mt-2 px-3 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-medium transition-colors"
                                            >
                                                Reset Filter
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedProjects.map((p) => (
                                <tr key={p.id} className="hover:bg-[#1f1f27]/60 transition-colors group">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                onClick={() => setLightboxImage({ url: p.imageUrl, title: p.title })}
                                                className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/[0.08] bg-[#13131b] shrink-0 cursor-zoom-in group/img"
                                                title="Klik untuk memperbesar pratinjau gambar"
                                            >
                                                <img
                                                    src={p.imageUrl}
                                                    alt={p.title}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-rose-600/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Eye className="w-3.5 h-3.5 text-white drop-shadow-md" />
                                                </div>
                                            </div>
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
                                                onClick={() => setViewingProject(p)}
                                                className="p-1.5 rounded-lg bg-[#13131b] hover:bg-cyan-600/20 hover:text-cyan-400 text-zinc-400 border border-white/[0.06] transition-colors"
                                                title="Lihat Detail Proyek"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenEdit(p)}
                                                className="p-1.5 rounded-lg bg-[#13131b] hover:bg-rose-600/20 hover:text-rose-400 text-zinc-400 border border-white/[0.06] transition-colors"
                                                title="Edit Proyek"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => setDeletingProject(p)}
                                                className="p-1.5 rounded-lg bg-[#13131b] hover:bg-red-600/20 hover:text-red-400 text-zinc-400 border border-white/[0.06] transition-colors"
                                                title="Hapus Proyek"
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

            {/* Pagination Controls */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />

            {/* Modal Detail Proyek */}
            <AdminProjectDetailModal
                isOpen={Boolean(viewingProject)}
                project={viewingProject}
                onClose={() => setViewingProject(null)}
                onEdit={(proj) => {
                    setViewingProject(null);
                    setEditingProject(proj);
                }}
            />

            <AdminProjectModal
                isOpen={isModalOpen || Boolean(editingProject)}
                editingProject={editingProject}
                onClose={handleCloseModal}
                onSave={onSaveProject}
                categories={categories}
            />

            {/* Modal Confirm Delete */}
            {deletingProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-[#16080c] border border-rose-900/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(225,29,72,0.25)] relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>

                        <div className="flex items-start gap-4 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400 shrink-0 shadow-lg">
                                <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">Konfirmasi Hapus Proyek</h3>
                                <p className="text-xs text-zinc-400 mt-1">
                                    Apakah Anda yakin ingin menghapus proyek <span className="font-semibold text-rose-400">"{deletingProject.title}"</span>? Tindakan ini tidak dapat dibatalkan.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.06]">
                            <button
                                type="button"
                                onClick={() => setDeletingProject(null)}
                                className="px-4 py-2 rounded-xl bg-[#13131b] hover:bg-[#252532] text-xs font-semibold text-zinc-300 hover:text-white border border-white/[0.08] transition-all"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    onDeleteProject(deletingProject.id);
                                    setDeletingProject(null);
                                }}
                                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg shadow-red-600/30 flex items-center gap-1.5 transition-all active:scale-95"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Ya, Hapus Proyek</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Kategori Manajemen */}
            <Modal
                isOpen={isAddCategoryOpen}
                onClose={() => {
                    setIsAddCategoryOpen(false);
                    setNewCatName("");
                    setNewCatDesc("");
                    setCatError(null);
                }}
                title="Kategori Manajemen"
                subtitle="Kelola daftar kategori proyek, slug otomatis, serta tambah kategori baru"
                icon={<Tag className="w-5 h-5 text-rose-500" />}
                size="2xl"
            >
                <div className="space-y-6">
                    {/* BAGIAN ATAS: Form Input / Edit Kategori */}
                    <div className="p-4 rounded-xl bg-[#13131b]/80 border border-white/[0.08] space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                                {editingCategory ? (
                                    <>
                                        <Edit3 className="w-4 h-4 text-rose-500" />
                                        <span>Edit Kategori ({editingCategory.name})</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4 text-rose-500" />
                                        <span>Tambah Kategori Baru</span>
                                    </>
                                )}
                            </h4>
                            {editingCategory && (
                                <button
                                    type="button"
                                    onClick={handleCancelEditCategory}
                                    className="text-[10px] text-zinc-400 hover:text-white underline font-mono"
                                >
                                    Batal Edit
                                </button>
                            )}
                        </div>

                        {catError && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                <span>{catError}</span>
                            </div>
                        )}

                        <form onSubmit={handleCreateCategory} className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Nama Kategori *</label>
                                    <input
                                        type="text"
                                        required
                                        value={newCatName}
                                        onChange={(e) => setNewCatName(e.target.value)}
                                        placeholder="Contoh: AI & ML / E-Commerce"
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#1b1b23] border border-white/[0.1] text-white focus:outline-none focus:border-rose-500 transition-all text-xs"
                                    />
                                    {newCatName.trim() && (
                                        <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                                            Slug: <span className="text-rose-400/90">{slugify(newCatName)}</span>
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Deskripsi Ringkas (Opsional)</label>
                                    <input
                                        type="text"
                                        value={newCatDesc}
                                        onChange={(e) => setNewCatDesc(e.target.value)}
                                        placeholder="Keterangan singkat kategori..."
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#1b1b23] border border-white/[0.1] text-white focus:outline-none focus:border-rose-500 transition-all text-xs"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-1">
                                {editingCategory && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEditCategory}
                                        className="px-4 py-2 rounded-xl bg-[#13131b] hover:bg-[#252532] text-xs font-semibold text-zinc-300 hover:text-white border border-white/[0.08] transition-all"
                                    >
                                        Batal
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={submittingCat || !newCatName.trim()}
                                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-xs font-bold text-white shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-all"
                                >
                                    {submittingCat ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            <span>Menyimpan...</span>
                                        </>
                                    ) : editingCategory ? (
                                        <>
                                            <Edit3 className="w-3.5 h-3.5" />
                                            <span>Update Kategori</span>
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
                    </div>

                    {/* BAGIAN BAWAH: Tabel List Kategori */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
                                Daftar Kategori Terdaftar ({dbCategories.length})
                            </h4>
                            {loadingCategories && (
                                <span className="text-[11px] text-rose-400 flex items-center gap-1">
                                    <Loader2 className="w-3 h-3 animate-spin" /> Memuat...
                                </span>
                            )}
                        </div>

                        <div className="rounded-xl border border-white/[0.08] bg-[#13131b]/60 overflow-hidden max-h-60 overflow-y-auto data-lenis-prevent scrollbar-none">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-[#1b1b23] text-zinc-400 font-mono text-[11px] uppercase border-b border-white/[0.06] sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2.5">Nama Kategori</th>
                                        <th className="px-4 py-2.5">Slug URL</th>
                                        <th className="px-4 py-2.5">Proyek Terkait</th>
                                        <th className="px-4 py-2.5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.04]">
                                    {dbCategories.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-10 px-4 text-center text-zinc-400">
                                                <div className="flex flex-col items-center justify-center space-y-2">
                                                    <div className="w-10 h-10 rounded-xl bg-rose-950/40 border border-rose-900/30 flex items-center justify-center text-rose-400/80 shadow-inner">
                                                        <Tag className="w-5 h-5 text-rose-500 animate-pulse" />
                                                    </div>
                                                    <p className="text-xs font-bold text-zinc-300">Belum ada kategori kustom terdaftar</p>
                                                    <p className="text-[11px] text-zinc-500 max-w-xs leading-relaxed">
                                                        Gunakan form di atas untuk menambahkan kategori baru. Kategori ini akan otomatis tersimpan di database MySQL & tersedia di filter proyek.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        dbCategories.map((cat) => (
                                            <tr key={cat.id || cat.slug} className="hover:bg-white/[0.02]">
                                                <td className="px-4 py-3 font-semibold text-zinc-200">
                                                    {cat.name}
                                                    {cat.description && cat.description !== "-" && (
                                                        <p className="text-[10px] text-zinc-500 font-normal">{cat.description}</p>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 font-mono text-rose-400/90 text-[11px]">
                                                    /{cat.slug}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-mono border border-white/[0.06]">
                                                        {cat.projectCount || 0} proyek
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            onClick={() => handleStartEditCategory(cat)}
                                                            className="p-1.5 rounded-lg bg-[#13131b] hover:bg-rose-600/20 hover:text-rose-400 text-zinc-400 border border-white/[0.06] transition-colors"
                                                            title="Edit Kategori"
                                                        >
                                                            <Edit3 className="w-3.5 h-3.5" />
                                                        </button>
                                                        {cat.id ? (
                                                            <button
                                                                onClick={() => handleDeleteCategory(cat.id!)}
                                                                disabled={deletingCatId === cat.id}
                                                                className="p-1.5 rounded-lg bg-[#13131b] hover:bg-red-600/20 hover:text-red-400 text-zinc-400 border border-white/[0.06] transition-colors"
                                                                title="Hapus Kategori"
                                                            >
                                                                {deletingCatId === cat.id ? (
                                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                ) : (
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                )}
                                                            </button>
                                                        ) : (
                                                            <span className="text-[10px] text-zinc-600 italic">Default</span>
                                                        )}
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
            </Modal>

            {/* Lightbox Pratinjau Gambar */}
            <ImageLightbox
                isOpen={Boolean(lightboxImage)}
                imageUrl={lightboxImage?.url || null}
                title={lightboxImage?.title}
                onClose={() => setLightboxImage(null)}
            />
        </div>
    );
};



