import React, { useState } from "react";
import { User, Save, Image as ImageIcon, MapPin, Mail, Phone, Globe, Sparkles, Upload, Loader2, Plus, Minus, Map } from "lucide-react";
import { Profile } from "@/data/portfolio";
import { MapLocationModal } from "@/components/admin/MapLocationModal";

interface Props {
    profile: Profile;
    onSaveProfile: (profile: Profile) => void;
    totalProjectsCount?: number;
}

export const AdminProfileEditor: React.FC<Props> = ({ profile, onSaveProfile, totalProjectsCount }) => {
    const [formData, setFormData] = useState<Profile>({ ...profile });
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [imageMode, setImageMode] = useState<"file" | "url">("file");
    const [uploading, setUploading] = useState(false);
    const [tempUploadedUrl, setTempUploadedUrl] = useState<string | null>(null);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Sync state when profile prop changes
    React.useEffect(() => {
        setMounted(true);
        setFormData({ ...profile });
    }, [profile]);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

        // If there was a temporary file uploaded previously in this session that hasn't been saved yet, delete it to prevent trash files
        if (tempUploadedUrl && tempUploadedUrl !== profile.avatarUrl) {
            fetch(`/api/upload?url=${encodeURIComponent(tempUploadedUrl)}`, { method: "DELETE" }).catch(() => {});
        }

        try {
            setUploading(true);
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
            setUploading(false);
            e.target.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // If profile avatar URL changed from original profile and original was a local private file, clean up old file
            if (profile.avatarUrl && profile.avatarUrl !== formData.avatarUrl && profile.avatarUrl.startsWith("/api/files/")) {
                await fetch(`/api/upload?url=${encodeURIComponent(profile.avatarUrl)}`, { method: "DELETE" }).catch(() => {});
            }

            // Small delay for smooth spinner feedback UX
            await new Promise((resolve) => setTimeout(resolve, 600));

            onSaveProfile(formData);
            setTempUploadedUrl(null);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } finally {
            setSaving(false);
        }
    };

    if (!mounted) {
        return (
            <div className="rounded-2xl bg-[#1b1b23] border border-white/[0.08] shadow-2xl p-8 text-center text-zinc-400">
                <Loader2 className="w-6 h-6 animate-spin text-rose-500 mx-auto mb-2" />
                <span>Memuat Editor Bio & Profil...</span>
            </div>
        );
    }

    return (
        <div className="rounded-2xl bg-[#1b1b23] border border-white/[0.08] shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-6 border-b border-white/[0.06] mb-6">
                <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-rose-500" />
                        <span>Pengaturan Bio & Profil Portofolio</span>
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                        Kelola informasi publik, role, ringkasan pengalaman, dan tautan sosial
                    </p>
                </div>

                {saved && (
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                        Tersimpan!
                    </span>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
                {/* Avatar Preview & Mode Toggle (File / URL) */}
                <div className="p-4 rounded-xl bg-[#13131b] border border-white/[0.06] space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-zinc-200 font-semibold flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4 text-rose-400" />
                            <span>Foto Profil / Avatar</span>
                        </label>
                        <div className="flex items-center gap-1 bg-[#1b1b23] p-1 rounded-lg border border-white/[0.08]">
                            <button
                                type="button"
                                onClick={() => setImageMode("file")}
                                title="Upload File Gambar dari Perangkat"
                                className={`p-1.5 rounded-md transition-all flex items-center justify-center ${
                                    imageMode === "file" ? "bg-rose-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
                                }`}
                            >
                                <Upload className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageMode("url")}
                                title="Gunakan URL Link Gambar"
                                className={`p-1.5 rounded-md transition-all flex items-center justify-center ${
                                    imageMode === "url" ? "bg-rose-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
                                }`}
                            >
                                <ImageIcon className="w-4 h-4" />
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
                            {imageMode === "file" ? (
                                <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-rose-900/40 hover:border-rose-500/60 rounded-xl bg-[#1b1b23] hover:bg-[#251017] cursor-pointer transition-all text-center">
                                    {uploading ? (
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
                                        disabled={uploading}
                                        className="hidden"
                                    />
                                </label>
                            ) : (
                                <div>
                                    <input
                                        type="text"
                                        value={formData.avatarUrl}
                                        onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                                        placeholder="Tempelkan URL link foto profil (https://...)"
                                        className="w-full px-3 py-2 rounded-xl bg-[#1b1b23] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Primary Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-zinc-300 font-medium mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500"
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-300 font-medium mb-1">Brand Name</label>
                        <input
                            type="text"
                            value={formData.brandName}
                            onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500"
                        />
                    </div>
                </div>

                {/* Dynamic Multiple Roles Display */}
                <div className="p-4 rounded-xl bg-[#13131b] border border-white/[0.06] space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-zinc-200 font-semibold flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-rose-400" />
                            <span>Role Display Teks Berjalan (Typing Animation)</span>
                        </label>
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
                                    className="flex-1 px-3 py-2 rounded-xl bg-[#1b1b23] border border-white/[0.08] text-rose-300 font-mono text-xs focus:outline-none focus:border-rose-500"
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

                {/* Bios */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-zinc-300 font-medium mb-1">Hero Short Bio</label>
                        <textarea
                            rows={2}
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500"
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-300 font-medium mb-1">About Section Bio</label>
                        <textarea
                            rows={3}
                            value={formData.aboutBio}
                            onChange={(e) => setFormData({ ...formData, aboutBio: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500"
                        />
                    </div>
                </div>

                {/* Numbers */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-zinc-300 font-medium mb-1">Tahun Pengalaman</label>
                        <input
                            type="text"
                            value={formData.yearsExp}
                            onChange={(e) => setFormData({ ...formData, yearsExp: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.08] text-white font-mono focus:outline-none focus:border-rose-500"
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-zinc-300 font-medium">Total Proyek</label>
                            {typeof totalProjectsCount === "number" && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            projectsCount: `${totalProjectsCount}+`,
                                        })
                                    }
                                    title="Auto-fill dari jumlah proyek di database"
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
                            placeholder="Contoh: 18+"
                            className="w-full px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.08] text-white font-mono focus:outline-none focus:border-rose-500"
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-300 font-medium mb-1">Klien Terlayani</label>
                        <input
                            type="text"
                            value={formData.clientsCount}
                            onChange={(e) => setFormData({ ...formData, clientsCount: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.08] text-white font-mono focus:outline-none focus:border-rose-500"
                        />
                    </div>
                </div>
                {/* Contact & Socials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-zinc-300 font-medium mb-1">Email Kontak</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500"
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-300 font-medium mb-1">Lokasi</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Masukkan nama kota/lokasi..."
                                className="flex-1 px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500"
                            />
                            <button
                                type="button"
                                onClick={() => setIsMapModalOpen(true)}
                                title="Pilih Lokasi Presisi dari Peta Google Maps"
                                className="px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 font-semibold flex items-center gap-1.5 transition-all shrink-0"
                            >
                                <Map className="w-4 h-4" />
                                <span className="text-xs">Pilih di Peta</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-zinc-300 font-medium mb-1">GitHub URL</label>
                        <input
                            type="text"
                            value={formData.socials.github || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    socials: { ...formData.socials, github: e.target.value },
                                })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500"
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-300 font-medium mb-1">LinkedIn URL</label>
                        <input
                            type="text"
                            value={formData.socials.linkedin || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    socials: { ...formData.socials, linkedin: e.target.value },
                                })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/[0.06]">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all active:scale-95"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin text-white" />
                                <span>Sedang diproses...</span>
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


