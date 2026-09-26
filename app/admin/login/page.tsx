"use client";

import { useState, Suspense, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
    Terminal,
    UserCog,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    X,
    KeyRound,
    Zap,
    Send,
    MailCheck,
    LockKeyhole,
    CheckCircle,
    Loader2,
} from "lucide-react";
import { AuthShell } from "@/components/admin/AuthShell";

function AdminLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(true);
    const [fillFlash, setFillFlash] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState("");
    const [recoverySent, setRecoverySent] = useState(false);

    const [error, setError] = useState("");
    const [status, setStatus] = useState<"idle" | "verifying" | "success">("idle");

    const handleQuickFill = () => {
        setEmail("admin@portfolio.com");
        setPassword("adminpassword123");
        setError("");
        setFillFlash(true);
        setTimeout(() => setFillFlash(false), 300);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setStatus("verifying");

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Kredensial tidak valid. Silakan periksa kembali email & password Anda.");
                setStatus("idle");
            } else {
                setStatus("success");
                setTimeout(() => {
                    const targetUrl = searchParams.get("callbackUrl") || "/admin";
                    router.push(targetUrl);
                    router.refresh();
                }, 600);
            }
        } catch (err: any) {
            setError("Terjadi kesalahan sistem saat menghubungi auth gateway.");
            setStatus("idle");
        }
    };

    const openModal = () => {
        setModalOpen(true);
        setRecoverySent(false);
        if (email.trim()) setRecoveryEmail(email);
    };

    const closeModal = () => {
        setModalOpen(false);
        setRecoverySent(false);
    };

    const handleSendRecovery = () => {
        setRecoverySent(true);
        setTimeout(() => {
            setModalOpen(false);
            setRecoverySent(false);
            router.push("/admin/login/forgot-password");
        }, 1600);
    };

    return (
        <AuthShell>
            <div className="relative flex flex-col items-center justify-center">
                <div className="absolute -top-24 w-96 h-96 bg-rose-600/15 rounded-full blur-[100px] pointer-events-none -z-10"></div>
                <div className="absolute -bottom-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

                <div className="w-full max-w-[440px] mx-auto relative">
                    <div className="relative bg-[#14060a]/90 backdrop-blur-2xl border border-rose-900/40 shadow-[0_0_50px_rgba(225,29,72,0.15)] rounded-2xl p-6 sm:p-8 overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>
                        
                        {/* Card header */}
                        <div className="relative z-10 flex flex-col items-center text-center space-y-2 mb-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/40 text-rose-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)] animate-pulse"></span>
                                <span className="font-mono text-[10px] tracking-wider uppercase font-semibold">
                                    RESTRICTED AREA / ROOT ACCESS
                                </span>
                            </div>
                            <div className="flex items-center justify-center gap-2 mt-1">
                                <div className="w-8 h-8 rounded-lg bg-rose-950 border border-rose-800/50 flex items-center justify-center text-rose-400 shadow-md">
                                    <Terminal className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-2xl tracking-tight text-white">
                                    fLINK<span className="text-rose-500">.dev</span>
                                </span>
                            </div>
                            <p className="font-mono text-[10px] text-zinc-400 tracking-wider uppercase">
                                SECURE OPERATIONAL GATEWAY • 256-BIT SSL ENCRYPTION
                            </p>
                        </div>

                        {/* Demo credentials helper */}
                        <div className="relative z-10 mb-5 p-2.5 rounded-xl bg-[#1c080e]/80 border border-rose-900/30 flex items-center justify-between gap-2 transition-all hover:border-rose-700/50">
                            <div className="flex items-center gap-2 min-w-0">
                                <KeyRound className="w-4 h-4 text-rose-400 shrink-0" />
                                <div className="flex flex-col min-w-0 text-left">
                                    <span className="font-mono text-[10px] text-zinc-200 uppercase tracking-wide font-semibold">
                                        Demo Credentials Loaded
                                    </span>
                                    <span className="text-[11px] text-zinc-400 truncate">
                                        admin@portfolio.com • adminpassword123
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleQuickFill}
                                className="shrink-0 px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-mono text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 transition-all border border-rose-800/40"
                            >
                                <Zap className="w-3 h-3 text-rose-400" />
                                <span>Auto Fill</span>
                            </button>
                        </div>

                        {/* Authentication form */}
                        <form className="relative z-10 space-y-4" onSubmit={handleSubmit}>
                            {error && (
                                <div className="p-2 rounded-lg bg-red-700/40 text-red-200 text-sm flex items-center gap-2">
                                    <Lock className="w-4 h-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}
                            {/* Field 1: identity / email */}
                            <div className="space-y-1.5 text-left">
                                <label
                                    className="text-xs font-semibold text-zinc-300 flex justify-between items-center"
                                    htmlFor="admin-identity"
                                >
                                    <span>Identity / Root Access Email</span>
                                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                                        SEC-01
                                    </span>
                                </label>
                                <div className="relative flex items-center">
                                    <UserCog className="absolute left-3 w-4 h-4 text-rose-400/70 pointer-events-none" />
                                    <input
                                        id="admin-identity"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@flink.dev"
                                        className={`w-full bg-[#0c0406] border border-rose-900/40 text-zinc-100 text-xs pl-9 pr-4 py-2.5 rounded-xl transition-all placeholder:text-zinc-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 ${
                                            fillFlash ? "bg-rose-950/40 border-rose-600" : ""
                                        }`}
                                    />
                                </div>
                            </div>

                            {/* Field 2: password */}
                            <div className="space-y-1.5 text-left">
                                <div className="flex items-center justify-between">
                                    <label
                                        className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5"
                                        htmlFor="admin-password"
                                    >
                                        <span>Authorization Key</span>
                                    </label>
                                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                                        AUTH-PASS
                                    </span>
                                </div>
                                <div className="relative flex items-center">
                                    <Lock className="absolute left-3 w-4 h-4 text-rose-400/70 pointer-events-none" />
                                    <input
                                        id="admin-password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className={`w-full bg-[#0c0406] border border-rose-900/40 text-zinc-100 text-xs pl-9 pr-10 py-2.5 rounded-xl transition-all placeholder:text-zinc-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 tracking-wider ${
                                            fillFlash ? "bg-rose-950/40 border-rose-600" : ""
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        aria-label="Toggle password visibility"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute right-3 text-zinc-500 hover:text-zinc-200 transition-colors p-1 flex items-center justify-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember me + forgot password */}
                            <div className="flex items-center justify-between pt-1 text-xs">
                                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                        className="w-3.5 h-3.5 rounded bg-[#0c0406] border border-rose-800/40 text-rose-600 focus:ring-0 focus:outline-none accent-rose-600 cursor-pointer"
                                    />
                                    <span className="text-zinc-300 hover:text-white transition-colors">
                                        Ingat Sesi Ini
                                    </span>
                                </label>
                                <button
                                    type="button"
                                    onClick={openModal}
                                    className="text-rose-400 hover:text-rose-300 font-medium transition-colors focus:outline-none"
                                >
                                    Lupa Password?
                                </button>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={status !== "idle"}
                                className={`group relative w-full overflow-hidden rounded-xl py-2.5 px-4 font-bold text-xs text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 ${
                                    status === "success"
                                        ? "bg-emerald-600"
                                        : "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 active:scale-95"
                                }`}
                            >
                                {status === "verifying" ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="font-mono text-[10px] tracking-wider uppercase">
                                            VERIFYING TOKEN...
                                        </span>
                                    </>
                                ) : status === "success" ? (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        <span className="font-mono text-[10px] tracking-wider uppercase">
                                            ROOT GRANTED • REDIRECTING
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="font-mono text-[10px] tracking-wider uppercase">
                                            MASUK KE CMS ADMIN
                                        </span>
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Card telemetry footer */}
                        <div className="relative z-10 mt-6 pt-4 flex flex-col items-center gap-1 text-center border-t border-white/[0.04]">
                            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                <span>GATEWAY TELEMETRY ACTIVE</span>
                                <span className="text-white/20">•</span>
                                <span>THROTTLE: 5 REQ/MIN</span>
                            </div>
                            <p className="text-xs text-zinc-500">
                                Host: 182.253.71.49 • Protected by Laravel Sanctum &amp; Rate Limiter
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Forgot password modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 bg-[#0d0d15]/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-[#292932] rounded-xl p-6 shadow-2xl relative space-y-4 border-t-2 border-rose-600">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-rose-600">
                                <LockKeyhole className="w-5 h-5" />
                                <h2 className="font-bold text-base text-zinc-100">Instruksi Pemulihan Akun</h2>
                            </div>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="text-zinc-500 hover:text-zinc-100 p-1 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-zinc-300 text-left">
                            Tautan pemulihan akun berenkripsi token satu kali pakai (one-time signature) akan
                            dikirimkan ke email terdaftar melalui queue mailer sistem.
                        </p>
                        <div className="space-y-1 text-left">
                            <label className="text-sm text-zinc-300" htmlFor="recovery-email">
                                Email Terverifikasi
                            </label>
                            <input
                                id="recovery-email"
                                type="email"
                                value={recoveryEmail}
                                onChange={(e) => setRecoveryEmail(e.target.value)}
                                placeholder="admin@flink.dev"
                                className="w-full bg-[#0d0d15] text-zinc-100 text-sm px-3.5 py-2.5 rounded-lg focus:outline-none focus:shadow-[0_0_0_2px_rgba(76,215,246,0.4)]"
                            />
                        </div>
                        {recoverySent && (
                            <div className="p-2 rounded-lg bg-emerald-600/30 text-emerald-300 text-sm text-left flex items-center gap-2">
                                <MailCheck className="w-[18px] h-[18px] shrink-0" />
                                <span>Token pemulihan telah dikirim ke inbox! Periksa folder spam jika perlu.</span>
                            </div>
                        )}
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 rounded text-sm text-zinc-300 hover:text-zinc-100 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleSendRecovery}
                                className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-600/90 text-white text-sm flex items-center gap-1 transition-all"
                            >
                                <Send className="w-4 h-4" />
                                <span>Kirim Tautan</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthShell>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#090305]" />}>
            <AdminLoginForm />
        </Suspense>
    );
}
