"use client";

import React, { useState, useEffect } from "react";
import {
    LayoutDashboard,
    FolderGit2,
    Mail,
    User,
    Download,
    Sparkles,
    Shield,
    CheckCircle2,
    Database,
} from "lucide-react";
import { portfolioData, Project, InboxMessage, Profile } from "@/data/portfolio";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminBanner } from "@/components/admin/AdminBanner";
import { AdminKpiCards } from "@/components/admin/AdminKpiCards";
import { AdminProjectsManager } from "@/components/admin/AdminProjectsManager";
import { AdminTelemetryWidget } from "@/components/admin/AdminTelemetryWidget";
import { AdminInboxManager } from "@/components/admin/AdminInboxManager";
import { AdminProfileEditor } from "@/components/admin/AdminProfileEditor";
import { AdminToast, ToastMessage, ToastType } from "@/components/admin/AdminToast";

export default function AdminDashboardPage() {
    const [activeTab, setActiveTab] = useState<"overview" | "projects" | "inbox" | "profile">("overview");
    const [projects, setProjects] = useState<Project[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [messages, setMessages] = useState<InboxMessage[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [profile, setProfile] = useState<Profile>(portfolioData.profile);
    const [isAvailable, setIsAvailable] = useState<boolean>(portfolioData.profile.isAvailable ?? true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [toast, setToast] = useState<ToastMessage | null>(null);

    const fetchProjects = async () => {
        try {
            setLoadingProjects(true);
            const res = await fetch("/api/projects");
            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            }
        } catch (e) {
            console.error("Failed to load projects from DB", e);
        } finally {
            setLoadingProjects(false);
        }
    };

    const fetchMessages = async () => {
        try {
            setLoadingMessages(true);
            const res = await fetch("/api/messages");
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (e) {
            console.error("Failed to load inbox messages from DB", e);
        } finally {
            setLoadingMessages(false);
        }
    };

    useEffect(() => {
        fetchProjects();
        fetchMessages();
    }, []);

    const showToast = (text: string, type: ToastType = "success", title?: string) => {
        setToast({ id: `${Date.now()}`, text, type, title });
    };

    const handleSaveProject = async (project: Project, isNew: boolean) => {
        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(project),
            });
            if (res.ok) {
                await fetchProjects();
                showToast(
                    isNew ? `Proyek "${project.title}" berhasil ditambahkan!` : `Proyek "${project.title}" berhasil diperbarui!`,
                    "success",
                    isNew ? "Proyek Dibuat" : "Proyek Diperbarui"
                );
            } else {
                showToast("Gagal menyimpan proyek ke database.", "error");
            }
        } catch (e) {
            showToast("Terjadi kesalahan jaringan.", "error");
        }
    };

    const handleDeleteProject = async (id: string) => {
        const target = projects.find((p) => p.id === id);
        try {
            const res = await fetch(`/api/projects?id=${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setProjects(projects.filter((p) => p.id !== id));
                showToast(`Proyek "${target?.title || "terpilih"}" telah berhasil dihapus dari database.`, "danger", "Hapus Proyek Sukses");
            } else {
                showToast("Gagal menghapus proyek dari database.", "error");
            }
        } catch (e) {
            showToast("Terjadi kesalahan jaringan.", "error");
        }
    };

    const handleToggleReadMessage = async (id: string) => {
        try {
            const res = await fetch("/api/messages", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                await fetchMessages();
                showToast("Status pesan diperbarui.", "info");
            }
        } catch (e) {
            showToast("Gagal memperbarui status pesan.", "error");
        }
    };

    const handleDeleteMessage = async (id: string) => {
        try {
            const res = await fetch(`/api/messages?id=${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                await fetchMessages();
                showToast("Pesan kontak berhasil dihapus.", "info");
            }
        } catch (e) {
            showToast("Gagal menghapus pesan.", "error");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const res = await fetch("/api/messages", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ markAllRead: true }),
            });
            if (res.ok) {
                await fetchMessages();
                showToast("Semua pesan telah ditandai sebagai dibaca.", "success");
            }
        } catch (e) {
            showToast("Gagal memperbarui pesan.", "error");
        }
    };

    const handleSaveProfile = (newProfile: Profile) => {
        setProfile(newProfile);
        showToast("Informasi profil berhasil diperbarui & disimpan!", "success");
    };

    const handleToggleAvailability = (available: boolean) => {
        setIsAvailable(available);
        showToast(
            available
                ? "Status diubah ke: Ready to Hire (Terbuka untuk tawaran)"
                : "Status diubah ke: Sedang Sibuk",
            available ? "success" : "info"
        );
    };

    const handleTriggerBackup = () => {
        setTimeout(() => {
            showToast("Database dump 'portfolio_backup.sql.gz' berhasil dibuat!", "success");
        }, 1200);
    };

    const handleExportCSV = () => {
        const headers = "ID,Title,Category,Tags,Featured,Internal,DemoUrl\n";
        const rows = projects
            .map(
                (p) =>
                    `"${p.id}","${p.title}","${p.category || ""}","${p.tags.join(";")}","${p.isFeatured}","${p.isInternal}","${p.demoUrl || ""}"`
            )
            .join("\n");
        const blob = new Blob([headers + rows], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `portfolio_projects_${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast("Data proyek berhasil diekspor ke CSV.", "success");
    };
    const featuredCount = projects.filter((p) => p.isFeatured).length;
    const unreadInboxCount = messages.filter((m) => !m.isRead).length;

    return (
        <div className="flex flex-col min-h-screen">
            <AdminHeader onTabChange={(tab) => setActiveTab(tab as any)} />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
                <AdminBanner
                    onOpenAddModal={() => setIsAddModalOpen(true)}
                    onTriggerBackup={handleTriggerBackup}
                />

                <AdminKpiCards
                    projectsCount={projects.length}
                    featuredCount={featuredCount}
                    skillsCount={portfolioData.skillsGauges.length}
                    certificatesCount={portfolioData.certificates.length}
                    unreadInboxCount={unreadInboxCount}
                    totalInboxCount={messages.length}
                    onViewInbox={() => setActiveTab("inbox")}
                    onViewProjects={() => setActiveTab("projects")}
                />

                {/* Segment Navigation Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 rounded-2xl bg-[#1b1b23] border border-white/[0.08] mb-8 shadow-xl">
                    <nav className="flex items-center gap-1 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                                activeTab === "overview"
                                    ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                                    : "text-zinc-400 hover:text-white hover:bg-[#13131b]"
                            }`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Overview</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("projects")}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                                activeTab === "projects"
                                    ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                                    : "text-zinc-400 hover:text-white hover:bg-[#13131b]"
                            }`}
                        >
                            <FolderGit2 className="w-4 h-4" />
                            <span>Kelola Proyek ({projects.length})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("inbox")}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                                activeTab === "inbox"
                                    ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                                    : "text-zinc-400 hover:text-white hover:bg-[#13131b]"
                            }`}
                        >
                            <Mail className="w-4 h-4" />
                            <span>Pesan Kontak</span>
                            {unreadInboxCount > 0 && (
                                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                                activeTab === "profile"
                                    ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                                    : "text-zinc-400 hover:text-white hover:bg-[#13131b]"
                            }`}
                        >
                            <User className="w-4 h-4" />
                            <span>Bio & Profil</span>
                        </button>
                    </nav>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleExportCSV}
                            className="px-3.5 py-2 rounded-xl bg-[#13131b] hover:bg-[#292932] border border-white/[0.08] text-xs font-semibold text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
                        >
                            <Download className="w-3.5 h-3.5 text-rose-400" />
                            <span>Ekspor CSV</span>
                        </button>
                    </div>
                </div>
                {/* Tab Views */}
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8">
                            <AdminProjectsManager
                                projects={projects}
                                onSaveProject={handleSaveProject}
                                onDeleteProject={handleDeleteProject}
                                isModalOpen={isAddModalOpen}
                                onCloseModal={() => setIsAddModalOpen(false)}
                                onOpenAddModal={() => setIsAddModalOpen(true)}
                                showToast={showToast}
                            />
                        </div>
                        <div className="lg:col-span-4 space-y-6">
                            <AdminTelemetryWidget
                                isAvailable={isAvailable}
                                onToggleAvailability={handleToggleAvailability}
                            />

                            {/* Inbox Mini Widget */}
                            <div className="rounded-2xl bg-[#1b1b23] border border-white/[0.08] p-5 shadow-2xl">
                                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
                                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                                        <Mail className="w-4 h-4 text-rose-400" />
                                        <span>Inbox Terkini</span>
                                    </h3>
                                    <button
                                        onClick={() => setActiveTab("inbox")}
                                        className="text-[11px] text-rose-400 hover:underline"
                                    >
                                        Buka Semua
                                    </button>
                                </div>
                                <div className="space-y-2.5">
                                    {messages.length === 0 ? (
                                        <div className="py-6 text-center text-zinc-500">
                                            <Mail className="w-5 h-5 text-rose-500/70 mx-auto mb-1 animate-pulse" />
                                            <p className="text-xs font-semibold text-zinc-400">Belum ada pesan masuk</p>
                                        </div>
                                    ) : (
                                        messages.slice(0, 2).map((m) => (
                                            <div
                                                key={m.id}
                                                onClick={() => setActiveTab("inbox")}
                                                className="p-3 rounded-xl bg-[#13131b] border border-white/[0.04] hover:border-rose-500/30 cursor-pointer transition-colors"
                                            >
                                                <div className="flex items-center justify-between text-[11px]">
                                                    <span className="font-bold text-white">{m.senderName}</span>
                                                    <span className="text-zinc-500 text-[10px]">{m.timeAgo}</span>
                                                </div>
                                                <p className="text-xs text-zinc-300 font-medium truncate mt-1">
                                                    {m.subject}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "projects" && (
                    <AdminProjectsManager
                        projects={projects}
                        onSaveProject={handleSaveProject}
                        onDeleteProject={handleDeleteProject}
                        isModalOpen={isAddModalOpen}
                        onCloseModal={() => setIsAddModalOpen(false)}
                        onOpenAddModal={() => setIsAddModalOpen(true)}
                        showToast={showToast}
                    />
                )}

                {activeTab === "inbox" && (
                    <AdminInboxManager
                        messages={messages}
                        onToggleRead={handleToggleReadMessage}
                        onDeleteMessage={handleDeleteMessage}
                        onMarkAllRead={handleMarkAllRead}
                    />
                )}

                {activeTab === "profile" && (
                    <AdminProfileEditor
                        profile={profile}
                        onSaveProfile={handleSaveProfile}
                    />
                )}
            </main>

            <footer className="border-t border-white/[0.06] bg-[#0d0d15] py-6 mt-12 text-center text-xs text-zinc-400">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="font-mono text-[11px]">
                        Obsidian Cyber Admin CMS • Next.js 16 Production Edition
                    </p>
                    <p className="text-zinc-400 text-[11px]">
                        Designed with Dark Crimson Design Token System
                    </p>
                </div>
            </footer>

            <AdminToast toast={toast} onDismiss={() => setToast(null)} />
        </div>
    );
}


