import React, { useState, useEffect } from "react";
import { Upload, Image as ImageIcon, Loader2, FolderGit2, ChevronDown } from "lucide-react";
import { Project } from "@/data/portfolio";
import { Modal } from "../Modal";
import { CustomSelect2 } from "./CustomSelect2";

interface Props {
    isOpen: boolean;
    editingProject: Project | null;
    onClose: () => void;
    onSave: (project: Project, isNew: boolean) => void;
    categories?: string[];
}

export const AdminProjectModal: React.FC<Props> = ({
    isOpen,
    editingProject,
    onClose,
    onSave,
    categories = [],
}) => {
    const availableCategories = categories.filter((c) => c !== "Semua");

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState(availableCategories[0] || "GovTech");
    const [desc, setDesc] = useState("");
    const [tags, setTags] = useState("");
    const [demo, setDemo] = useState("");
    const [code, setCode] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isFeatured, setIsFeatured] = useState(false);
    const [isInternal, setIsInternal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageMode, setImageMode] = useState<"file" | "url">("file");

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation Client Side: Max 5MB Limit
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            alert(`Ukuran file melebihi batas 5MB! (Ukuran file Anda: ${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
            e.target.value = "";
            return;
        }

        // Validation Client Side: Image Only
        if (!file.type.startsWith("image/")) {
            alert("File yang diunggah harus berupa gambar (JPG, PNG, WEBP, GIF, SVG)!");
            e.target.value = "";
            return;
        }

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setImageUrl(data.url);
            } else {
                alert(data.error || "Gagal mengunggah gambar. Silakan coba lagi.");
            }
        } catch (err) {
            console.error("Upload failed", err);
            alert("Terjadi kesalahan saat mengunggah file.");
        } finally {
            setUploading(false);
        }
    };

    const defaultPlaceholderImage =
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCpNQO6-9JwaXPggIP-hXRJFKc15qhn8FfVqKjn2Vb1QLEcPuNxmC5YaFjGOyTupTdts6a0KWmbGcT3i_Jq_WN11ngEwk6Q5nQ5KltO6DZ7rywW7UWj4nvczWSwpFIt4kOn-2HML-tTIiis1SME5Si6QfhCtKRFod0W_01FuwmCN29hzzEgmtWSm2U_SPfA1gqvpBs-3JDXzs_4U84SdGFh7r27nCd_x1k5PfIrfYTdLfnN8fC1sk3l_g";

    useEffect(() => {
        if (editingProject) {
            setTitle(editingProject.title);
            setCategory(editingProject.category || "Web App");
            setDesc(editingProject.description);
            setTags(editingProject.tags.join(", "));
            setDemo(editingProject.demoUrl || "");
            setCode(editingProject.codeUrl || "");
            setImageUrl(editingProject.imageUrl || "");
            setIsFeatured(Boolean(editingProject.isFeatured));
            setIsInternal(Boolean(editingProject.isInternal));
        } else {
            setTitle("");
            setCategory("");
            setDesc("");
            setTags("");
            setDemo("");
            setCode("");
            setImageUrl("");
            setIsFeatured(false);
            setIsInternal(false);
        }
    }, [editingProject, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const splitTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
        const item: Project = {
            id: editingProject ? editingProject.id : "",
            title,
            category,
            description: desc,
            tags: splitTags.length ? splitTags : ["Next.js", "Tailwind CSS"],
            imageUrl: imageUrl.trim() || defaultPlaceholderImage,
            demoUrl: demo,
            codeUrl: code,
            isFeatured,
            isInternal,
        };
        onSave(item, !editingProject);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingProject ? "Edit Proyek Portofolio" : "Tambah Proyek Portofolio Baru"}
            subtitle="Kelola detail data proyek, thumbnail, tech stack, dan tautan live"
            icon={<FolderGit2 className="w-5 h-5 text-rose-500" />}
            size="2xl"
        >
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5">Judul Proyek *</label>
                    <input
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131b] border border-white/[0.1] text-white focus:outline-none focus:border-rose-500 transition-all text-xs"
                        placeholder="Masukkan nama proyek portofolio..."
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-zinc-300 font-semibold mb-1.5">Kategori Proyek</label>
                        <CustomSelect2
                            value={category}
                            onChange={(val) => setCategory(val)}
                            options={availableCategories}
                            placeholder="-- Pilih Kategori --"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-300 font-semibold mb-1.5">Tech Stack (pisahkan koma)</label>
                        <input
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131b] border border-white/[0.1] text-white focus:outline-none focus:border-rose-500 transition-all text-xs font-mono"
                            placeholder="Contoh: React, Next.js, Tailwind CSS"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5">Deskripsi Singkat</label>
                    <textarea
                        rows={3}
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131b] border border-white/[0.1] text-white focus:outline-none focus:border-rose-500 transition-all text-xs leading-relaxed"
                        placeholder="Jelaskan secara ringkas fitur dan keunggulan utama proyek ini..."
                    />
                </div>

                {/* Gambar / Thumbnail Upload Section */}
                <div className="p-4 rounded-xl bg-[#13131b]/60 border border-white/[0.06] space-y-2.5">
                    <div className="flex items-center justify-between">
                        <label className="text-zinc-200 font-semibold">Gambar / Thumbnail Proyek</label>
                        <div className="flex items-center gap-1 bg-[#13131b] p-0.5 rounded-lg border border-white/[0.08] text-[10px]">
                            <button
                                type="button"
                                onClick={() => setImageMode("file")}
                                className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                                    imageMode === "file" ? "bg-rose-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
                                }`}
                            >
                                Upload File
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageMode("url")}
                                className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                                    imageMode === "url" ? "bg-rose-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
                                }`}
                            >
                                URL Link
                            </button>
                        </div>
                    </div>

                    <div className="flex items-stretch gap-4">
                        {/* Preview Card */}
                        <div className="w-28 h-24 rounded-xl bg-[#13131b] border border-white/[0.1] overflow-hidden shrink-0 flex flex-col items-center justify-center relative group shadow-inner">
                            {imageUrl.trim() ? (
                                <img
                                    src={imageUrl.trim()}
                                    alt="Thumbnail Preview"
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-zinc-500 gap-1 p-2 text-center">
                                    <ImageIcon className="w-7 h-7 text-rose-500/70 animate-pulse" />
                                    <span className="text-[10px] font-mono text-zinc-400 font-medium">No Image</span>
                                </div>
                            )}
                            {imageUrl.trim() && (
                                <span className="absolute bottom-0 inset-x-0 bg-black/75 backdrop-blur-xs text-[9px] text-rose-300 text-center py-0.5 font-mono font-bold tracking-wider">
                                    PREVIEW
                                </span>
                            )}
                        </div>

                        {/* Control Area */}
                        <div className="flex-1 flex flex-col justify-center">
                            {imageMode === "file" ? (
                                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-rose-900/40 hover:border-rose-500/60 rounded-xl bg-[#13131b]/80 hover:bg-[#1f0e13]/60 cursor-pointer transition-all p-3 text-center">
                                    {uploading ? (
                                        <div className="flex items-center gap-2 text-rose-400 font-semibold">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Mengunggah...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5 text-rose-400 mb-1" />
                                            <span className="text-xs font-semibold text-zinc-200">
                                                Pilih Gambar dari Perangkat
                                            </span>
                                            <span className="text-[10px] text-zinc-400 mt-0.5">
                                                PNG, JPG, WEBP (Maksimal 5MB)
                                            </span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                        className="hidden"
                                    />
                                </label>
                            ) : (
                                <div className="space-y-1.5">
                                    <input
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131b] border border-white/[0.1] text-white focus:outline-none focus:border-rose-500 text-xs"
                                        placeholder="Tempelkan URL link gambar (https://...)"
                                    />
                                    <p className="text-[10px] text-zinc-400 leading-normal">
                                        Masukkan alamat link gambar publik dari CDN, Cloudinary, atau web.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-zinc-300 font-semibold mb-1.5">Tautan Live Demo</label>
                        <input
                            value={demo}
                            onChange={(e) => setDemo(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131b] border border-white/[0.1] text-white focus:outline-none focus:border-rose-500 text-xs font-mono"
                            placeholder="https://demo.domain.com"
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-300 font-semibold mb-1.5">Tautan Source Code</label>
                        <input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131b] border border-white/[0.1] text-white focus:outline-none focus:border-rose-500 text-xs font-mono"
                            placeholder="https://github.com/username/repo"
                        />
                    </div>
                </div>

                {/* Custom Checkbox Toggle Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div
                        onClick={() => setIsFeatured(!isFeatured)}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isFeatured
                                ? "bg-rose-950/40 border-rose-500/60 shadow-[0_0_15px_rgba(225,29,72,0.15)]"
                                : "bg-[#13131b] border-white/[0.08] hover:border-white/[0.15]"
                        }`}
                    >
                        <div
                            className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-all ${
                                isFeatured
                                    ? "bg-rose-600 border-rose-500 text-white"
                                    : "bg-[#1b1b23] border-white/[0.2]"
                            }`}
                        >
                            {isFeatured && <span className="text-[10px] font-bold">✓</span>}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-white text-xs flex items-center gap-1">
                                Featured Project
                            </span>
                            <span className="text-[10px] text-zinc-400 mt-0.5 leading-tight">
                                Tampilkan di seksi sorotan utama landing page.
                            </span>
                        </div>
                    </div>

                    <div
                        onClick={() => setIsInternal(!isInternal)}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isInternal
                                ? "bg-amber-950/40 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                                : "bg-[#13131b] border-white/[0.08] hover:border-white/[0.15]"
                        }`}
                    >
                        <div
                            className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-all ${
                                isInternal
                                    ? "bg-amber-500 border-amber-400 text-black"
                                    : "bg-[#1b1b23] border-white/[0.2]"
                            }`}
                        >
                            {isInternal && <span className="text-[10px] font-bold">✓</span>}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-white text-xs flex items-center gap-1">
                                Internal Project
                            </span>
                            <span className="text-[10px] text-zinc-400 mt-0.5 leading-tight">
                                Proyek internal/privat (menyembunyikan tombol demo live).
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl bg-[#13131b] hover:bg-[#252532] border border-white/[0.08] text-zinc-300 hover:text-white transition-all text-xs font-semibold"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all active:scale-95"
                    >
                        {editingProject ? "Simpan Perubahan" : "Tambah Proyek"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

