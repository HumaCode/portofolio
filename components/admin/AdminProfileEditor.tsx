"use client";

import React, { useState } from "react";
import {
    User,
    Save,
    Image as ImageIcon,
    MapPin,
    Mail,
    Phone,
    Globe,
    Sparkles,
    Upload,
    Loader2,
    Plus,
    Minus,
    Map,
    Layers,
    CheckCircle2,
    Award,
    FolderGit2,
    Users,
} from "lucide-react";
import { Profile } from "@/data/portfolio";
import { MapLocationModal } from "@/components/admin/MapLocationModal";

interface Props {
    profile: Profile;
    onSaveProfile: (profile: Profile) => void;
    totalProjectsCount?: number;
}

export const AdminProfileEditor: React.FC<Props> = ({ profile, onSaveProfile, totalProjectsCount }) => {
    const [formData, setFormData] = useState<Profile>({ ...profile });
    const [prevProfile, setPrevProfile] = useState<Profile>(profile);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [avatarMode, setAvatarMode] = useState<"file" | "url">("file");
    const [aboutImageMode, setAboutImageMode] = useState<"file" | "url">("file");
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadingAboutImg, setUploadingAboutImg] = useState(false);
    const [tempUploadedUrl, setTempUploadedUrl] = useState<string | null>(null);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);

    // Sync state when profile prop changes without cascading render
    if (prevProfile !== profile) {
        setPrevProfile(profile);
        setFormData({ ...profile });
    }

    // Filter section view: "all" | "hero" | "about"
    const [activeSectionView, setActiveSectionView] = useState<"all" | "hero" | "about">("all");

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            alert(`Ukuran file melebihi batas 5MB! (Ukuran file: ${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
            e.target.value = "";
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("File yang diunggah harus berupa gambar (JPG, PNG, WEBP, GIF, SVG)!");
            e.target.value = "";
            return;
        }

        if (tempUploadedUrl && tempUploadedUrl !== profile.avatarUrl) {
            fetch(`/api/upload?url=${encodeURIComponent(tempUploadedUrl)}`, { method: "DELETE" }).catch(() => {});
        }

        try {
            setUploadingAvatar(true);
            const body = new FormData();
            body.append("file", file);
            body.append("folder", "avatar");

            const res = await fetch("/api/upload", {
                method: "POST",
                body,
            });

            const data = await res.json();
            if (res.ok) {
                setFormData((prev) => ({ ...prev, avatarUrl: data.url }));
                setTempUploadedUrl(data.url);
            } else {
                alert(data.error || "Gagal mengunggah foto profil.");
            }
        } catch (err) {
            console.error("Upload avatar failed", err);
            alert("Terjadi kesalahan jaringan saat mengunggah foto profil.");
        } finally {
            setUploadingAvatar(false);
            e.target.value = "";
        }
    };

    const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("Ukuran file melebihi batas 5MB!");
            e.target.value = "";
            return;
        }

        try {
            setUploadingAboutImg(true);
            const body = new FormData();
            body.append("file", file);
            body.append("folder", "about");
            const res = await fetch("/api/upload", { method: "POST", body });
            const data = await res.json();
            if (res.ok) {
                setFormData((prev) => ({ ...prev, aboutImageUrl: data.url }));
            } else {
                alert(data.error || "Gagal mengunggah foto About Me.");
            }
        } catch {
            alert("Gagal mengunggah foto About Me.");
        } finally {
            setUploadingAboutImg(false);
            e.target.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (profile.avatarUrl && profile.avatarUrl !== formData.avatarUrl && profile.avatarUrl.startsWith("/api/files/")) {
                await fetch(`/api/upload?url=${encodeURIComponent(profile.avatarUrl)}`, { method: "DELETE" }).catch(() => {});
            }

            await new Promise((resolve) => setTimeout(resolve, 600));

            onSaveProfile(formData);
            setTempUploadedUrl(null);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="rounded-2xl bg-[#1b1b23] border border-white/[0.08] shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Header with Title & Save Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-2">
                        <User className="w-3.5 h-3.5" />
                        <span>Profile & Content Configuration</span>
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        <span>Pengaturan Bio & Profil Portofolio</span>
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                        Kelola seluruh teks, foto identitas, kontak, dan statistik yang tampil pada Section Hero dan Section About Me di halaman publik.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {saved && (
                        <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 animate-pulse">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Tersimpan!</span>
                        </span>
                    )}
                </div>
            </div>

            {/* Section Categorization Filter Pills */}
            <div className="p-2 rounded-xl bg-[#13131b] border border-white/[0.06] flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-zinc-400 px-3 uppercase tracking-wider font-mono">
                    Filter Section:
                </span>
                <button
                    type="button"
                    onClick={() => setActiveSectionView("all")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        activeSectionView === "all"
                            ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                            : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                    }`}
                >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Semua Pengaturan</span>
                </button>
                <button
                    type="button"
                    onClick={() => setActiveSectionView("hero")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        activeSectionView === "hero"
                            ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                            : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                    }`}
                >
                    <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                    <span>Section Hero (Beranda Utama)</span>
                </button>
                <button
                    type="button"
                    onClick={() => setActiveSectionView("about")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        activeSectionView === "about"
                            ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                            : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                    }`}
                >
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Section About Me (Tentang Saya)</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 text-xs">
                {/* ========================================================================= */}
                {/* SECTION 1: HERO SECTION (BERANDA UTAMA) */}
                {/* ========================================================================= */}
                {(activeSectionView === "all" || activeSectionView === "hero") && (
                    <div className="rounded-2xl bg-[#14141c] border border-rose-500/30 shadow-xl p-5 sm:p-7 space-y-6 relative overflow-hidden">
                        {/* Section Header Banner */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                            <div>
                                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-rose-600/20 text-rose-400 font-mono text-[10px] font-bold uppercase tracking-wider mb-1">
                                    <Sparkles className="w-3 h-3" />
                                    <span>Kategori: Section Hero (Beranda Utama)</span>
                                </div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <span>Pengaturan Tampilan Hero Section</span>
                                </h3>
                                <p className="text-[11px] text-zinc-400 mt-0.5">
                                    Inputan di grup ini mengontrol tampilan halaman paling atas: Foto Avatar, Nama, Teks Typewriter, Bio Ringkas, Metrik Angka, dan Kontak.
                                </p>
                            </div>
                            <span className="text-[11px] font-mono text-rose-400 bg-rose-950/60 px-3 py-1 rounded-lg border border-rose-900/40 self-start sm:self-auto shrink-0">
                                📍 Tampil di: #home
                            </span>
                        </div>

                        {/* Avatar Hero Upload & URL */}
                        <div className="p-4 rounded-xl bg-[#1a1a24] border border-white/[0.06] space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-zinc-200 font-semibold flex items-center gap-1.5">
                                    <ImageIcon className="w-4 h-4 text-rose-400" />
                                    <span>Foto Profil / Avatar Hero</span>
                                </label>
                                <div className="flex items-center gap-1 bg-[#13131b] p-1 rounded-lg border border-white/[0.08]">
                                    <button
                                        type="button"
                                        onClick={() => setAvatarMode("file")}
                                        className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
                                            avatarMode === "file" ? "bg-rose-600 text-white" : "text-zinc-400 hover:text-white"
                                        }`}
                                    >
                                        <Upload className="w-3 h-3" />
                                        <span>File Upload</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAvatarMode("url")}
                                        className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
                                            avatarMode === "url" ? "bg-rose-600 text-white" : "text-zinc-400 hover:text-white"
                                        }`}
                                    >
                                        <Globe className="w-3 h-3" />
                                        <span>URL Link</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <img
                                    src={formData.avatarUrl}
                                    alt={formData.name}
                                    className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-500/40 shrink-0 bg-[#0d0d15] shadow-lg"
                                />

                                <div className="flex-1">
                                    {avatarMode === "file" ? (
                                        <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-rose-900/40 hover:border-rose-500/60 rounded-xl bg-[#13131b] hover:bg-[#200d14] cursor-pointer transition-all text-center">
                                            {uploadingAvatar ? (
                                                <div className="flex items-center gap-2 text-rose-400 font-semibold">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Mengunggah Foto Profil...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className="w-4 h-4 text-rose-400" />
                                                    <span className="text-xs font-semibold text-zinc-200">
                                                        Pilih Foto Profil dari Perangkat (Maks 5MB)
                                                    </span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarUpload}
                                                disabled={uploadingAvatar}
                                                className="hidden"
                                            />
                                        </label>
                                    ) : (
                                        <input
                                            type="text"
                                            value={formData.avatarUrl}
                                            onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                                            placeholder="Tempelkan URL link foto profil (https://...)"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131b] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500 text-xs"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Identitas Hero */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-zinc-300 font-medium mb-1">
                                    Nama Lengkap <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl bg-[#1a1a24] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500 text-xs"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-zinc-300 font-medium mb-1">Brand Name</label>
                                <input
                                    type="text"
                                    value={formData.brandName}
                                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl bg-[#1a1a24] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500 text-xs"
                                />
                            </div>
                            <div>
                                <label className="block text-zinc-300 font-medium mb-1">Tagline Hero</label>
                                <input
                                    type="text"
                                    value={formData.tagline || ""}
                                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                    placeholder="Contoh: Charlotte Edition"
                                    className="w-full px-3.5 py-2 rounded-xl bg-[#1a1a24] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500 text-xs"
                                />
                            </div>
                        </div>

                        {/* Multi-roles Typing Animation */}
                        <div className="p-4 rounded-xl bg-[#1a1a24] border border-white/[0.06] space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-zinc-200 font-semibold flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-rose-400" />
                                        <span>Role Display Teks Berjalan (Typing Animation)</span>
                                    </label>
                                    <p className="text-[11px] text-zinc-400">
                                        Teks ini akan diketik secara otomatis bergantian pada headline utama Hero.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const currentRoles = formData.roles || [formData.role || "<Developer />"];
                                        const updated = [...currentRoles, ""];
                                        setFormData({
                                            ...formData,
                                            roles: updated,
                                            role: updated[0] || formData.role,
                                        });
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-[11px] font-semibold flex items-center gap-1.5 transition-all"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Tambah Role</span>
                                </button>
                            </div>

                            <div className="space-y-2">
                                {(formData.roles && formData.roles.length > 0
                                    ? formData.roles
                                    : [formData.role || "<Frontend & Fullstack Developer />"]
                                ).map((roleText, index, arr) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={roleText}
                                            onChange={(e) => {
                                                const currentRoles = [...(formData.roles || arr)];
                                                currentRoles[index] = e.target.value;
                                                setFormData({
                                                    ...formData,
                                                    roles: currentRoles,
                                                    role: currentRoles[0] || "",
                                                });
                                            }}
                                            placeholder={`Role Display ${index + 1} (Contoh: <React & Next.js />)`}
                                            className="flex-1 px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.08] text-rose-300 font-mono text-xs focus:outline-none focus:border-rose-500"
                                        />
                                        {arr.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = arr.filter((_, i) => i !== index);
                                                    setFormData({
                                                        ...formData,
                                                        roles: updated,
                                                        role: updated[0] || "",
                                                    });
                                                }}
                                                title="Hapus Role Ini"
                                                className="p-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 transition-all shrink-0"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hero Short Bio */}
                        <div>
                            <label className="block text-zinc-300 font-medium mb-1">
                                Hero Short Bio (Ringkasan Paragraf di Bawah Headline)
                            </label>
                            <textarea
                                rows={2}
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1a24] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500 text-xs"
                            />
                        </div>

                        {/* Metrik Statistik Hero */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#1a1a24] border border-white/[0.06]">
                            <div>
                                <label className="block text-zinc-300 font-medium mb-1 flex items-center gap-1.5">
                                    <Award className="w-3.5 h-3.5 text-rose-400" />
                                    <span>Tahun Pengalaman</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.yearsExp}
                                    onChange={(e) => setFormData({ ...formData, yearsExp: e.target.value })}
                                    placeholder="2+"
                                    className="w-full px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.08] text-white font-mono focus:outline-none focus:border-rose-500 text-xs"
                                />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                                        <FolderGit2 className="w-3.5 h-3.5 text-rose-400" />
                                        <span>Total Proyek</span>
                                    </label>
                                    {typeof totalProjectsCount === "number" && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    projectsCount: `${totalProjectsCount}+`,
                                                })
                                            }
                                            className="text-[10px] text-rose-400 hover:text-rose-300 underline font-mono"
                                        >
                                            Auto: {totalProjectsCount}+
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={formData.projectsCount}
                                    onChange={(e) => setFormData({ ...formData, projectsCount: e.target.value })}
                                    placeholder="18+"
                                    className="w-full px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.08] text-white font-mono focus:outline-none focus:border-rose-500 text-xs"
                                />
                            </div>
                            <div>
                                <label className="block text-zinc-300 font-medium mb-1 flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5 text-rose-400" />
                                    <span>Klien Terlayani</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.clientsCount}
                                    onChange={(e) => setFormData({ ...formData, clientsCount: e.target.value })}
                                    placeholder="12+"
                                    className="w-full px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.08] text-white font-mono focus:outline-none focus:border-rose-500 text-xs"
                                />
                            </div>
                        </div>

                        {/* Kontak & Sosial Media */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider font-mono">
                                Tautan Media Sosial & Kontak Hero
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-zinc-300 font-medium mb-1 flex items-center gap-1.5">
                                        <Mail className="w-3.5 h-3.5 text-zinc-400" />
                                        <span>Email Utama</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#1a1a24] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500 text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-zinc-300 font-medium mb-1 flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5 text-zinc-400" />
                                        <span>No. Telepon / WhatsApp</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.phone || ""}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#1a1a24] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-zinc-300 font-medium mb-1">GitHub URL</label>
                                    <input
                                        type="text"
                                        value={formData.socials?.github || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                socials: { ...formData.socials, github: e.target.value },
                                            })
                                        }
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#1a1a24] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500 text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-zinc-300 font-medium mb-1">LinkedIn URL</label>
                                    <input
                                        type="text"
                                        value={formData.socials?.linkedin || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                socials: { ...formData.socials, linkedin: e.target.value },
                                            })
                                        }
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#1a1a24] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500 text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-zinc-300 font-medium mb-1">Instagram URL</label>
                                    <input
                                        type="text"
                                        value={formData.socials?.instagram || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                socials: { ...formData.socials, instagram: e.target.value },
                                            })
                                        }
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#1a1a24] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500 text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-zinc-300 font-medium mb-1">TikTok URL</label>
                                    <input
                                        type="text"
                                        value={formData.socials?.tiktok || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                socials: { ...formData.socials, tiktok: e.target.value },
                                            })
                                        }
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#1a1a24] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500 text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* SECTION 2: ABOUT ME SECTION (TENTANG SAYA) */}
                {/* ========================================================================= */}
                {(activeSectionView === "all" || activeSectionView === "about") && (
                    <div className="rounded-2xl bg-[#14141c] border border-cyan-500/30 shadow-xl p-5 sm:p-7 space-y-6 relative overflow-hidden">
                        {/* Section Header Banner */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                            <div>
                                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-cyan-600/20 text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-wider mb-1">
                                    <User className="w-3 h-3" />
                                    <span>Kategori: Section About Me (Tentang Saya)</span>
                                </div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <span>Pengaturan Tampilan About Me Section</span>
                                </h3>
                                <p className="text-[11px] text-zinc-400 mt-0.5">
                                    Inputan di grup ini mengontrol kartu persona dan biografi lengkap di Section About: Foto Persona/Identity, Cerita Lengkap, Lokasi Peta, dan Additional Tech Stack.
                                </p>
                            </div>
                            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-900/40 self-start sm:self-auto shrink-0">
                                📍 Tampil di: #about
                            </span>
                        </div>

                        {/* About Me Image Upload & Field */}
                        <div className="p-4 rounded-xl bg-[#1a1a24] border border-white/[0.06] space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-zinc-200 font-semibold flex items-center gap-1.5">
                                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                                    <span>Foto Seksi About Me (Identity Card Image)</span>
                                </label>
                                <div className="flex items-center gap-1 bg-[#13131b] p-1 rounded-lg border border-white/[0.08]">
                                    <button
                                        type="button"
                                        onClick={() => setAboutImageMode("file")}
                                        className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
                                            aboutImageMode === "file" ? "bg-cyan-600 text-white" : "text-zinc-400 hover:text-white"
                                        }`}
                                    >
                                        <Upload className="w-3 h-3" />
                                        <span>File Upload</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAboutImageMode("url")}
                                        className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
                                            aboutImageMode === "url" ? "bg-cyan-600 text-white" : "text-zinc-400 hover:text-white"
                                        }`}
                                    >
                                        <Globe className="w-3 h-3" />
                                        <span>URL Link</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <img
                                    src={formData.aboutImageUrl || formData.avatarUrl}
                                    alt="About Me Preview"
                                    className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-500/40 shrink-0 bg-[#0d0d15] shadow-lg"
                                />

                                <div className="flex-1 space-y-2">
                                    {aboutImageMode === "file" ? (
                                        <label className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-dashed border-cyan-900/40 hover:border-cyan-500/60 rounded-xl bg-[#13131b] hover:bg-[#0c1f28] cursor-pointer transition-all text-center">
                                            {uploadingAboutImg ? (
                                                <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Mengunggah Foto About...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className="w-4 h-4 text-cyan-400" />
                                                    <span className="text-xs font-semibold text-zinc-200">
                                                        Upload Foto About Me dari Perangkat (Maks 5MB)
                                                    </span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAboutImageUpload}
                                                disabled={uploadingAboutImg}
                                                className="hidden"
                                            />
                                        </label>
                                    ) : (
                                        <input
                                            type="text"
                                            value={formData.aboutImageUrl || ""}
                                            onChange={(e) => setFormData({ ...formData, aboutImageUrl: e.target.value })}
                                            placeholder="Tempelkan URL link foto About Me (https://...)"
                                            className="w-full px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-cyan-500"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Lokasi & Peta Leaflet */}
                        <div>
                            <label className="block text-zinc-300 font-medium mb-1 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Lokasi Domisili (Ditampilkan di Kartu About Me)</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Masukkan nama kota/lokasi..."
                                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#1a1a24] border border-white/[0.08] text-white focus:outline-none focus:border-cyan-500 text-xs"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsMapModalOpen(true)}
                                    title="Pilih Lokasi Presisi dari Peta Google Maps"
                                    className="px-4 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 font-semibold flex items-center gap-1.5 transition-all shrink-0"
                                >
                                    <Map className="w-4 h-4" />
                                    <span>Pilih di Peta</span>
                                </button>
                            </div>
                        </div>

                        {/* About Section Bio */}
                        <div>
                            <label className="block text-zinc-300 font-medium mb-1">
                                Narasi Biografi Lengkap (About Section Story Bio)
                            </label>
                            <textarea
                                rows={4}
                                value={formData.aboutBio}
                                onChange={(e) => setFormData({ ...formData, aboutBio: e.target.value })}
                                placeholder="Ceritakan latar belakang, fokus keahlian, filosofi kerja, dan pengalaman..."
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1a24] border border-white/[0.08] text-white focus:outline-none focus:border-cyan-500 text-xs leading-relaxed"
                            />
                        </div>

                        {/* Additional Tech Stack & Ecosystem */}
                        <div className="p-4 rounded-xl bg-[#1a1a24] border border-white/[0.06] space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="block text-cyan-400 font-mono text-xs uppercase tracking-wider font-bold">
                                        Additional Tech Stack & Ecosystem (Chips List)
                                    </label>
                                    <p className="text-[11px] text-zinc-400">
                                        Daftar badge keahlian tambahan yang ditampilkan di bagian bawah kartu About Me.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const currentStack = [...(formData.secondaryStack || [
                                            "Laravel 11 & Livewire",
                                            "Flutter & Dart",
                                            "Next.js 16 App Router",
                                            "TypeScript & React 19",
                                            "Tailwind CSS v4",
                                            "PostgreSQL / MySQL",
                                            "REST APIs & GraphQL",
                                            "Figma UI/UX & Tokens",
                                            "Docker & CI/CD",
                                            "Git & GitHub Actions"
                                        ])];
                                        currentStack.push("");
                                        setFormData({ ...formData, secondaryStack: currentStack });
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Tambah Item Tech</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {(formData.secondaryStack && formData.secondaryStack.length > 0
                                    ? formData.secondaryStack
                                    : [
                                        "Laravel 11 & Livewire",
                                        "Flutter & Dart",
                                        "Next.js 16 App Router",
                                        "TypeScript & React 19",
                                        "Tailwind CSS v4",
                                        "PostgreSQL / MySQL",
                                        "REST APIs & GraphQL",
                                        "Figma UI/UX & Tokens",
                                        "Docker & CI/CD",
                                        "Git & GitHub Actions"
                                    ]
                                ).map((techItem, index, arr) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={techItem}
                                            onChange={(e) => {
                                                const updatedStack = [...(formData.secondaryStack || arr)];
                                                updatedStack[index] = e.target.value;
                                                setFormData({ ...formData, secondaryStack: updatedStack });
                                            }}
                                            placeholder={`Tech Stack ${index + 1} (Contoh: Next.js 16 App Router)`}
                                            className="flex-1 px-3 py-1.5 rounded-xl bg-[#13131b] border border-white/[0.08] text-zinc-200 text-xs focus:outline-none focus:border-cyan-500"
                                        />
                                        {arr.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updatedStack = arr.filter((_, i) => i !== index);
                                                    setFormData({ ...formData, secondaryStack: updatedStack });
                                                }}
                                                title="Hapus item ini"
                                                className="p-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 transition-all shrink-0"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Bottom Save Action */}
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                    <span className="text-[11px] text-zinc-400">
                        Pastikan seluruh data sudah terisi dengan benar sebelum menyimpan.
                    </span>

                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all active:scale-95"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin text-white" />
                                <span>Menyimpan...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>Simpan Perubahan Bio & Profil</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Modal Peta Interaktif (Leaflet Google Maps Layer) */}
            <MapLocationModal
                isOpen={isMapModalOpen}
                onClose={() => setIsMapModalOpen(false)}
                currentAddress={formData.location}
                onSelectAddress={(selectedAddr) => {
                    setFormData((prev) => ({ ...prev, location: selectedAddr }));
                }}
            />
        </div>
    );
};
