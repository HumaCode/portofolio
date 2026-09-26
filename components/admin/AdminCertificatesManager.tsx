"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Award,
    Plus,
    Search,
    Edit2,
    Trash2,
    Save,
    X,
    ExternalLink,
    CheckCircle2,
    Building2,
    Link as LinkIcon,
} from "lucide-react";
import { Certificate } from "@/data/portfolio";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

interface AdminCertificatesManagerProps {
    onShowToast: (text: string, type?: "success" | "error" | "info", title?: string) => void;
}

export const AdminCertificatesManager: React.FC<AdminCertificatesManagerProps> = ({ onShowToast }) => {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCert, setEditingCert] = useState<Certificate | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Confirm delete state
    const [deletingCert, setDeletingCert] = useState<{ id: string; title: string } | null>(null);
    const [isDeletingLoading, setIsDeletingLoading] = useState(false);

    // Form state
    const [formTitle, setFormTitle] = useState("");
    const [formIssuer, setFormIssuer] = useState("");
    const [formYear, setFormYear] = useState(new Date().getFullYear().toString());
    const [formVerifyUrl, setFormVerifyUrl] = useState("");
    const [formIsVerified, setFormIsVerified] = useState(true);

    const fetchCertificates = useCallback(async () => {
        try {
            const res = await fetch("/api/certificates");
            if (res.ok) {
                const data = await res.json();
                setCertificates(data);
            }
        } catch (err) {
            console.error("Failed to load certificates", err);
            onShowToast("Gagal memuat data sertifikat dari database.", "error");
        } finally {
            setLoading(false);
        }
    }, [onShowToast]);

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            try {
                const res = await fetch("/api/certificates");
                if (res.ok && isMounted) {
                    const data = await res.json();
                    setCertificates(data);
                }
            } catch (err) {
                console.error("Failed to load certificates", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        load();
        return () => {
            isMounted = false;
        };
    }, []);

    const filteredCertificates = certificates.filter((cert) => {
        const query = searchQuery.toLowerCase();
        return (
            cert.title.toLowerCase().includes(query) ||
            cert.issuer.toLowerCase().includes(query) ||
            cert.year.toLowerCase().includes(query)
        );
    });

    const openCreateModal = () => {
        setEditingCert(null);
        setFormTitle("");
        setFormIssuer("");
        setFormYear(new Date().getFullYear().toString());
        setFormVerifyUrl("");
        setFormIsVerified(true);
        setIsModalOpen(true);
    };

    const openEditModal = (cert: Certificate) => {
        setEditingCert(cert);
        setFormTitle(cert.title);
        setFormIssuer(cert.issuer);
        setFormYear(cert.year);
        setFormVerifyUrl(cert.verifyUrl || "");
        setFormIsVerified(cert.isVerified ?? true);
        setIsModalOpen(true);
    };

    const handleSaveCertificate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formTitle.trim()) {
            onShowToast("Judul sertifikat wajib diisi!", "error");
            return;
        }
        if (!formIssuer.trim()) {
            onShowToast("Penerbit sertifikat wajib diisi!", "error");
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                id: editingCert ? editingCert.id : undefined,
                title: formTitle.trim(),
                issuer: formIssuer.trim(),
                year: formYear.trim() || new Date().getFullYear().toString(),
                verifyUrl: formVerifyUrl.trim() || null,
                isVerified: formIsVerified,
            };

            const res = await fetch("/api/certificates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                await fetchCertificates();
                setIsModalOpen(false);
                onShowToast(
                    editingCert
                        ? `Sertifikat "${payload.title}" berhasil diperbarui!`
                        : `Sertifikat "${payload.title}" berhasil ditambahkan!`,
                    "success"
                );
            } else {
                const data = await res.json();
                onShowToast(data.error || "Gagal menyimpan sertifikat.", "error");
            }
        } catch (err) {
            console.error("Save certificate error:", err);
            onShowToast("Terjadi kesalahan saat menyimpan sertifikat.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const executeDeleteCertificate = async () => {
        if (!deletingCert) return;
        setIsDeletingLoading(true);
        try {
            const res = await fetch(`/api/certificates?id=${encodeURIComponent(deletingCert.id)}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setCertificates((prev) => prev.filter((c) => c.id !== deletingCert.id));
                onShowToast(`Sertifikat "${deletingCert.title}" berhasil dihapus.`, "success");
                setDeletingCert(null);
            } else {
                onShowToast("Gagal menghapus sertifikat.", "error");
            }
        } catch (err) {
            console.error("Delete certificate error:", err);
            onShowToast("Terjadi kesalahan saat menghapus sertifikat.", "error");
        } finally {
            setIsDeletingLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="rounded-2xl bg-[#1b1b23] border border-white/[0.08] shadow-2xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-2">
                            <Award className="w-3.5 h-3.5" />
                            <span>Section Certificates Management</span>
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
                            <span>Kelola Lisensi & Sertifikasi</span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-600/20 text-rose-300 border border-rose-500/30">
                                {certificates.length} Sertifikat
                            </span>
                        </h2>
                        <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                            Kelola kredensial profesional, sertifikat keahlian, dan tautan verifikasi resmi yang tampil di section Certificates.
                        </p>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold text-xs transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Sertifikat Baru</span>
                    </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="pt-6">
                    <div className="relative max-w-md">
                        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Cari judul sertifikat, penerbit, atau tahun..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#13131b] border border-white/[0.08] text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                        />
                    </div>
                </div>
            </div>

            {/* Certificates Grid */}
            {loading ? (
                <div className="p-12 text-center text-zinc-400 bg-[#1b1b23] border border-white/[0.08] rounded-2xl">
                    <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin mx-auto mb-3"></div>
                    <p className="text-xs">Memuat data sertifikat dari database...</p>
                </div>
            ) : filteredCertificates.length === 0 ? (
                <div className="p-12 text-center text-zinc-400 bg-[#1b1b23] border border-white/[0.08] rounded-2xl space-y-3">
                    <Award className="w-12 h-12 text-rose-500/40 mx-auto" />
                    <h3 className="text-sm font-semibold text-white">Tidak ada sertifikat yang ditemukan</h3>
                    <p className="text-xs max-w-sm mx-auto">
                        {searchQuery
                            ? `Tidak ada sertifikat yang cocok dengan "${searchQuery}".`
                            : "Belum ada data sertifikat yang tersimpan di database."}
                    </p>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all inline-flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Sertifikat Pertama</span>
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {filteredCertificates.map((cert) => (
                        <div
                            key={cert.id}
                            className="p-5 rounded-2xl bg-[#1b1b23] border border-white/[0.08] hover:border-rose-500/40 transition-all shadow-xl flex items-start justify-between gap-4 group"
                        >
                            <div className="flex items-start gap-4 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 group-hover:scale-105 group-hover:bg-rose-600/30 transition-all">
                                    <Award className="w-5 h-5" />
                                </div>

                                <div className="min-w-0 space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 border border-rose-900/40 text-rose-300 font-semibold">
                                            {cert.year}
                                        </span>
                                        {cert.isVerified && (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                                                <CheckCircle2 className="w-3 h-3" />
                                                <span>Verified</span>
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                                        {cert.title}
                                    </h3>

                                    <p className="text-xs text-zinc-400 flex items-center gap-1.5 truncate">
                                        <Building2 className="w-3 h-3 text-zinc-500 shrink-0" />
                                        <span>{cert.issuer}</span>
                                    </p>

                                    {cert.verifyUrl && (
                                        <a
                                            href={cert.verifyUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 hover:underline pt-1"
                                        >
                                            <LinkIcon className="w-3 h-3" />
                                            <span>Lihat Kredensial Resmi</span>
                                            <ExternalLink className="w-2.5 h-2.5" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                    onClick={() => openEditModal(cert)}
                                    title="Edit Sertifikat"
                                    className="p-2 rounded-xl bg-[#13131b] hover:bg-rose-600/20 text-zinc-400 hover:text-rose-400 border border-white/[0.06] hover:border-rose-500/30 transition-all"
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setDeletingCert({ id: cert.id, title: cert.title })}
                                    title="Hapus Sertifikat"
                                    className="p-2 rounded-xl bg-[#13131b] hover:bg-red-600/20 text-zinc-400 hover:text-red-400 border border-white/[0.06] hover:border-red-500/30 transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Tambah / Edit Sertifikat */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-lg rounded-2xl bg-[#1b1b23] border border-white/[0.1] shadow-2xl p-6 sm:p-8 space-y-6 relative">
                        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                                    <Award className="w-4 h-4" />
                                </div>
                                <h3 className="text-base font-bold text-white">
                                    {editingCert ? "Edit Data Sertifikat" : "Tambah Sertifikat Baru"}
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveCertificate} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-zinc-300 font-semibold mb-1.5">
                                    Nama / Judul Sertifikat <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    placeholder="Contoh: Frontend Development Specialist"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131b] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500 text-xs"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-zinc-300 font-semibold mb-1.5">
                                        Penerbit / Institusi <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formIssuer}
                                        onChange={(e) => setFormIssuer(e.target.value)}
                                        placeholder="Contoh: Meta, Google, Dicoding, BNSP"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131b] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500 text-xs"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-zinc-300 font-semibold mb-1.5">
                                        Tahun Perolehan
                                    </label>
                                    <input
                                        type="text"
                                        value={formYear}
                                        onChange={(e) => setFormYear(e.target.value)}
                                        placeholder="Contoh: 2024"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131b] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500 text-xs"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-zinc-300 font-semibold mb-1.5">
                                    URL Verifikasi / Kredensial (Opsional)
                                </label>
                                <input
                                    type="url"
                                    value={formVerifyUrl}
                                    onChange={(e) => setFormVerifyUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131b] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500 text-xs"
                                />
                            </div>

                            <div className="p-3.5 rounded-xl bg-[#13131b] border border-white/[0.06] flex items-center justify-between">
                                <div>
                                    <span className="text-zinc-200 font-semibold block">Status Terverifikasi (Verified)</span>
                                    <span className="text-[11px] text-zinc-400 block mt-0.5">
                                        Tampilkan badge hijau &quot;Verified&quot; pada kartu sertifikat
                                    </span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formIsVerified}
                                        onChange={(e) => setFormIsVerified(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                                </label>
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
                                            <span>{editingCert ? "Perbarui Sertifikat" : "Simpan Sertifikat"}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus Sertifikat */}
            <ConfirmDeleteModal
                isOpen={Boolean(deletingCert)}
                title="Konfirmasi Hapus Sertifikat"
                itemName={deletingCert?.title}
                itemType="sertifikat"
                message={
                    <>
                        Apakah Anda yakin ingin menghapus sertifikat{" "}
                        <span className="font-semibold text-rose-400">"{deletingCert?.title}"</span> secara permanen dari portofolio? Tindakan ini tidak dapat dibatalkan.
                    </>
                }
                isLoading={isDeletingLoading}
                onConfirm={executeDeleteCertificate}
                onCancel={() => setDeletingCert(null)}
            />
        </div>
    );
};
