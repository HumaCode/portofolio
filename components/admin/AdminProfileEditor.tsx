"use client";

import React, { useState } from "react";
import { User, Save, Image as ImageIcon, MapPin, Mail, Phone, Globe, Sparkles } from "lucide-react";
import { Profile } from "@/data/portfolio";

interface Props {
    profile: Profile;
    onSaveProfile: (profile: Profile) => void;
}

export const AdminProfileEditor: React.FC<Props> = ({ profile, onSaveProfile }) => {
    const [formData, setFormData] = useState<Profile>({ ...profile });
    const [saved, setSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveProfile(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

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
                {/* Avatar Preview & URL */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#13131b] border border-white/[0.06]">
                    <img
                        src={formData.avatarUrl}
                        alt={formData.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-500/40 shrink-0 bg-[#0d0d15]"
                    />
                    <div className="flex-1">
                        <label className="block text-zinc-300 font-medium mb-1">Avatar Image URL</label>
                        <input
                            type="text"
                            value={formData.avatarUrl}
                            onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#1b1b23] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500"
                        />
                    </div>
                </div>
                {/* Primary Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    <div>
                        <label className="block text-zinc-300 font-medium mb-1">Role Display</label>
                        <input
                            type="text"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500 font-mono text-rose-300"
                        />
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
                        <label className="block text-zinc-300 font-medium mb-1">Total Proyek</label>
                        <input
                            type="text"
                            value={formData.projectsCount}
                            onChange={(e) => setFormData({ ...formData, projectsCount: e.target.value })}
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
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#13131b] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500"
                        />
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
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all active:scale-95"
                    >
                        <Save className="w-4 h-4" />
                        <span>Simpan Perubahan Bio & Profil</span>
                    </button>
                </div>
            </form>
        </div>
    );
};


