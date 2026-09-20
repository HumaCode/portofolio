"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
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

export default function AdminLoginPage() {
    const router = useRouter();

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
        setPassword("password123");
        setError("");
        setFillFlash(true);
        setTimeout(() => setFillFlash(false), 300);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setStatus("verifying");
        setTimeout(() => {
            const valid =
                (email.trim() === "admin@portfolio.com" && password === "password123") ||
                (email.trim() === "admin@flink.dev" && password.length >= 6);
            if (valid) {
                setStatus("success");
                setTimeout(() => router.push("/admin"), 800);
            } else {
                setError("Kredensial tidak cocok dengan database node. Gunakan fitur Auto Fill.");
                setStatus("idle");
            }
        }, 750);
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

                <div className="w-full max-w-[480px] mx-auto relative">
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-rose-600 pointer-events-none z-20"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-rose-600 pointer-events-none z-20"></div>
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-rose-600/40 pointer-events-none z-20"></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-rose-600/40 pointer-events-none z-20"></div>

                    <div className="relative bg-[#1b1b23]/85 backdrop-blur-xl shadow-2xl rounded-xl p-6 sm:p-10 overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-rose-600 to-transparent"></div>
                        <div
                            className="absolute inset-0 pointer-events-none opacity-[0.015]"
                            style={{
                                backgroundImage:
                                    "repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 4px)",
                            }}
                        ></div>
                        {/* Card header */}
                        <div className="relative z-10 flex flex-col items-center text-center space-y-2 mb-6">
                            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#34343d]/60 text-cyan-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(76,215,246,0.9)] animate-pulse"></span>
                                <span className="font-mono text-[11px] tracking-wider uppercase">
                                    RESTRICTED AREA / ROOT ACCESS
                                </span>
                            </div>
                            <div className="flex items-center justify-center gap-1 mt-1">
                                <div className="w-8 h-8 rounded-lg bg-rose-600/20 flex items-center justify-center text-rose-500 shadow-[0_0_12px_rgba(225,29,72,0.3)]">
                                    <Terminal className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-[2rem] leading-10 tracking-[-0.02em] text-zinc-100">
                                    fLINK<span className="text-rose-600">.dev</span>
                                </span>
                            </div>
                            <p className="font-mono text-[11px] text-zinc-500 tracking-wider uppercase">
                                SECURE OPERATIONAL GATEWAY • 256-BIT SSL ENCRYPTION
                            </p>
                        </div>

                        {/* Demo credentials helper */}
                        <div className="relative z-10 mb-6 p-2 rounded-lg bg-[#34343d]/40 flex items-center justify-between gap-2 transition-all hover:bg-[#34343d]/60">
                            <div className="flex items-center gap-2 min-w-0">
                                <KeyRound className="w-4 h-4 text-cyan-400 shrink-0" />
                                <div className="flex flex-col min-w-0 text-left">
                                    <span className="font-mono text-[11px] text-zinc-100 uppercase tracking-wide">
                                        Demo Credentials Loaded
                                    </span>
                                    <span className="text-xs text-zinc-500 truncate">
                                        admin@portfolio.com • password123
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleQuickFill}
                                className="shrink-0 px-2 py-1 rounded bg-cyan-400/15 hover:bg-cyan-400/25 text-cyan-400 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1 transition-all"
                            >
                                <Zap className="w-3.5 h-3.5" />
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
                            <div className="space-y-1 text-left">
                                <label
                                    className="text-sm text-zinc-300 flex justify-between items-center"
                                    htmlFor="admin-identity"
                                >
                                    <span>Identity / Root Access Email</span>
                                    <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
                                        SEC-01
                                    </span>
                                </label>
                                <div className="relative flex items-center">
                                    <UserCog className="absolute left-3 w-5 h-5 text-zinc-500 pointer-events-none" />
                                    <input
                                        id="admin-identity"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@flink.dev"
                                        className={`w-full bg-[#0d0d15]/80 text-zinc-100 text-sm pl-10 pr-4 py-2.5 rounded-lg transition-all placeholder:text-zinc-600 focus:outline-none focus:bg-[#0d0d15] focus:shadow-[0_0_0_2px_rgba(225,29,72,0.4)] ${
                                            fillFlash ? "bg-[#34343d]" : ""
                                        }`}
                                    />
                                </div>
                            </div>

                            {/* Field 2: password */}
                            <div className="space-y-1 text-left">
                                <div className="flex items-center justify-between">
                                    <label
                                        className="text-sm text-zinc-300 flex items-center gap-1.5"
                                        htmlFor="admin-password"
                                    >
                                        <span>Authorization Key</span>
                                    </label>
                                    <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
                                        AUTH-PASS
                                    </span>
                                </div>
                                <div className="relative flex items-center">
                                    <Lock className="absolute left-3 w-5 h-5 text-zinc-500 pointer-events-none" />
                                    <input
                                        id="admin-password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className={`w-full bg-[#0d0d15]/80 text-zinc-100 text-sm pl-10 pr-11 py-2.5 rounded-lg transition-all placeholder:text-zinc-600 focus:outline-none focus:bg-[#0d0d15] focus:shadow-[0_0_0_2px_rgba(225,29,72,0.4)] tracking-wider ${
                                            fillFlash ? "bg-[#34343d]" : ""
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        aria-label="Toggle password visibility"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute right-3 text-zinc-500 hover:text-zinc-100 transition-colors p-1 flex items-center justify-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-[18px] h-[18px]" />
                                        ) : (
                                            <Eye className="w-[18px] h-[18px]" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            {/* Remember me + forgot password */}
                            <div className="flex items-center justify-between pt-1">
                                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                        className="w-4 h-4 rounded bg-[#0d0d15] border-0 text-rose-600 focus:ring-0 focus:outline-none accent-rose-600 cursor-pointer"
                                    />
                                    <span className="text-sm text-zinc-300 hover:text-zinc-100 transition-colors">
                                        Ingat Sesi Ini
                                    </span>
                                </label>
                                <button
                                    type="button"
                                    onClick={openModal}
                                    className="text-sm text-rose-300 hover:text-rose-400 transition-colors focus:outline-none"
                                >
                                    Lupa Password?
                                </button>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={status !== "idle"}
                                className={`group relative w-full overflow-hidden rounded-lg py-3 px-4 font-bold text-sm text-white transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.35)] hover:shadow-[0_0_28px_rgba(225,29,72,0.5)] ${
                                    status === "success"
                                        ? "bg-emerald-600"
                                        : "bg-rose-600 hover:bg-rose-600/90 active:scale-[0.99]"
                                }`}
                            >
                                {status === "verifying" ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span className="font-mono text-[11px] tracking-wider uppercase">
                                            VERIFYING TOKEN...
                                        </span>
                                    </>
                                ) : status === "success" ? (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="font-mono text-[11px] tracking-wider uppercase">
                                            ROOT GRANTED • REDIRECTING
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="font-mono text-[11px] tracking-wider uppercase">
                                            MASUK KE CMS ADMIN
                                        </span>
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
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
