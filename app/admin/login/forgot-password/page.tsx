"use client";

import {
    useEffect,
    useRef,
    useState,
    type ClipboardEvent,
    type FormEvent,
    type KeyboardEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    X,
    BadgeCheck,
    ShieldCheck,
    LockKeyhole,
    Eye,
    EyeOff,
    Timer,
    RefreshCw,
    Info,
    CheckCircle,
    Loader2,
} from "lucide-react";
import { AuthShell } from "@/components/admin/AuthShell";

const OTP_LENGTH = 6;

export default function AdminForgotPasswordPage() {
    const router = useRouter();
    const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

    const [otp, setOtp] = useState<string[]>(["8", "4", "2", "9", "1", ""]);
    const [timeLeft, setTimeLeft] = useState(105);
    const [resendEnabled, setResendEnabled] = useState(false);

    const [newPassword, setNewPassword] = useState("CyberAdmin#2025!Secure");
    const [confirmPassword, setConfirmPassword] = useState("CyberAdmin#2025!Secure");
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [status, setStatus] = useState<"idle" | "verifying" | "success">("idle");

    useEffect(() => {
        const id = setInterval(() => {
            setTimeLeft((t) => (t > 0 ? t - 1 : 0));
        }, 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        setResendEnabled(timeLeft === 0);
    }, [timeLeft]);

    const handleOtpChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        setOtp((prev) => {
            const next = [...prev];
            next[index] = digit;
            return next;
        });
        if (digit && index < OTP_LENGTH - 1) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
        const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!text) return;
        e.preventDefault();
        const next = Array(OTP_LENGTH).fill("");
        text.split("").forEach((ch, i) => {
            next[i] = ch;
        });
        setOtp(next);
        otpRefs.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
    };

    const handleResend = () => {
        setResendEnabled(false);
        setTimeLeft(105);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("verifying");
        setTimeout(() => {
            setStatus("success");
            setTimeout(() => router.push("/admin/login"), 900);
        }, 900);
    };

    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");

    return (
        <AuthShell>
            <div className="relative w-full max-w-xl mx-auto">
                <div className="relative bg-[#14060a]/90 backdrop-blur-2xl border border-rose-900/40 shadow-[0_0_50px_rgba(225,29,72,0.15)] rounded-2xl p-5 sm:p-8 overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>

                    {/* Top nav */}
                    <div className="flex items-center justify-between gap-2 pb-4 border-b border-rose-950/60 mb-5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-950/60 border border-rose-800/40 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-rose-300">
                                RECOVERY PROTOCOL / PASSWORD RESET
                            </span>
                        </div>
                        <Link
                            href="/admin/login"
                            className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-rose-400 transition-colors group"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                            <span>Kembali ke Login</span>
                        </Link>
                    </div>

                    {/* Terminal header */}
                    <div className="flex flex-col items-center text-center space-y-1.5 mb-5">
                        <div className="flex items-center gap-2 px-3 py-1 bg-[#1c080e] border border-rose-900/40 rounded-xl">
                            <div className="w-6 h-6 rounded-lg bg-rose-950 border border-rose-800/50 flex items-center justify-center text-rose-400 font-bold text-xs">
                                f
                            </div>
                            <span className="font-semibold text-base tracking-tight text-white">
                                fLINK<span className="text-rose-500">.dev</span>
                            </span>
                            <span className="font-mono text-[10px] text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 font-semibold uppercase">
                                root:auth
                            </span>
                        </div>
                        <h1 className="font-bold text-xl sm:text-2xl text-white tracking-tight">
                            Verifikasi &amp; Reset Akses
                        </h1>
                        <p className="text-xs text-zinc-400">
                            SECURE CREDENTIAL RECOVERY GATEWAY • MULTI-FACTOR VERIFICATION
                        </p>
                    </div>

                    {/* Protocol flow steps */}
                    <div className="grid grid-cols-3 gap-2 mb-5 text-left">
                        <div className="flex flex-col gap-0.5 p-2 rounded-xl bg-[#1c080e] border border-rose-900/30">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-[9px] text-emerald-400 font-semibold">STEP 01</span>
                                <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                            <span className="text-xs text-zinc-200 font-medium truncate">Email Dispatched</span>
                        </div>
                        <div className="flex flex-col gap-0.5 p-2 rounded-xl bg-rose-950/70 border border-rose-600/50 shadow-md">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-[9px] text-rose-300 font-semibold">STEP 02 [ACTIVE]</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                            </div>
                            <span className="text-xs text-rose-200 font-bold truncate">Verifikasi 6-Digit</span>
                        </div>
                        <div className="flex flex-col gap-0.5 p-2 rounded-xl bg-[#14060a] border border-rose-950/40 opacity-70">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-[9px] text-zinc-500">STEP 03</span>
                                <LockKeyhole className="w-3.5 h-3.5 text-zinc-500" />
                            </div>
                            <span className="text-xs text-zinc-400 truncate">Sandi Baru</span>
                        </div>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Step 1: dispatched email capsule */}
                        <div className="p-3 sm:p-3.5 rounded-xl bg-[#0c0406] border border-rose-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-700/40 flex items-center justify-center text-emerald-400 shrink-0">
                                    <BadgeCheck className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Email Terdaftar</span>
                                    <span className="font-bold text-xs text-zinc-100 truncate">admin@portfolio.com</span>
                                </div>
                            </div>
                            <div className="flex flex-col sm:items-end">
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/40 text-emerald-400 font-mono text-[9px] uppercase font-semibold">
                                    <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                                    <span>Ref ID: #SEC-9842</span>
                                </div>
                                <span className="text-[10px] text-zinc-400 mt-0.5">Kode OTP Terkirim via Queue</span>
                            </div>
                        </div>

                        {/* Step 2: 6-digit OTP */}
                        <div className="space-y-2 p-3.5 rounded-xl bg-[#1c080e]/60 border border-rose-900/30 text-left">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                                    <ShieldCheck className="w-4 h-4 text-rose-500" />
                                    <span>Masukkan Kode OTP 6 Digit</span>
                                </label>
                                <span className="font-mono text-[10px] text-rose-400 font-semibold tracking-wider">TTL: 120 SEC</span>
                            </div>
                            <div className="grid grid-cols-6 gap-2 sm:gap-2.5 py-1">
                                {otp.map((val, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => {
                                            otpRefs.current[i] = el;
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        maxLength={1}
                                        value={val}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                        onPaste={handleOtpPaste}
                                        autoFocus={i === OTP_LENGTH - 1}
                                        placeholder="•"
                                        aria-label={`OTP digit ${i + 1}`}
                                        className={`w-full h-11 sm:h-12 text-center text-xl sm:text-2xl font-black bg-[#0c0406] border border-rose-900/40 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all placeholder:text-zinc-700 selection:bg-rose-600 ${
                                            val ? "text-white" : "text-rose-300"
                                        }`}
                                    />
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
                                <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                                    <Timer className="w-3.5 h-3.5 text-rose-400" />
                                    <span>Kirim ulang kode dalam:</span>
                                    <span className="font-mono font-bold text-rose-400 tracking-widest">
                                        {minutes}:{seconds}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={!resendEnabled}
                                    className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase transition-colors self-start sm:self-auto ${
                                        resendEnabled
                                            ? "text-rose-400 font-bold hover:text-rose-300 cursor-pointer"
                                            : "text-zinc-500 opacity-50 pointer-events-none"
                                    }`}
                                >
                                    <RefreshCw className="w-3 h-3" />
                                    <span>Kirim Ulang OTP</span>
                                </button>
                            </div>

                            <div className="flex items-center gap-2 p-2 bg-[#0c0406] border border-rose-950/50 rounded-lg text-zinc-400 text-xs">
                                <Info className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                <span className="text-[11px]">
                                    Cek folder inbox atau spam email{" "}
                                    <strong className="text-zinc-200 font-medium">admin@portfolio.com</strong> jika
                                    kode tidak muncul.
                                </span>
                            </div>
                        </div>

                        {/* Step 3: new password */}
                        <div className="space-y-2 p-3.5 rounded-xl bg-[#1c080e]/60 border border-rose-900/30 text-left">
                            <div className="flex items-center justify-between mb-0.5">
                                <span className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                                    <LockKeyhole className="w-4 h-4 text-rose-500" />
                                    <span>Tetapkan Kata Sandi Baru</span>
                                </span>
                                <span className="font-mono text-[10px] text-emerald-400 font-semibold">MIN. 12 KARAKTER</span>
                            </div>

                            <div className="space-y-1 text-left">
                                <label className="text-[11px] font-semibold text-zinc-300 block">Kata Sandi Baru</label>
                                <div className="relative flex items-center">
                                    <input
                                        type={showNew ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Masukkan password kuat..."
                                        className="w-full bg-[#0c0406] border border-rose-900/40 text-zinc-100 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors pr-10"
                                    />
                                    <button
                                        type="button"
                                        aria-label="Toggle password visibility"
                                        onClick={() => setShowNew((v) => !v)}
                                        className="absolute right-3 text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer"
                                    >
                                        {showNew ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1 py-0.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                                        Kekuatan Sandi:
                                    </span>
                                    <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider flex items-center gap-1 font-semibold">
                                        <CheckCircle className="w-3 h-3" />
                                        <span>Sangat Kuat (100%)</span>
                                    </span>
                                </div>
                                <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                                    <div className="rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/40"></div>
                                    <div className="rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/40"></div>
                                    <div className="rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/40"></div>
                                    <div className="rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/40"></div>
                                </div>
                            </div>

                            <div className="space-y-1 pt-0.5 text-left">
                                <label className="text-[11px] font-semibold text-zinc-300 block">Konfirmasi Kata Sandi Baru</label>
                                <div className="relative flex items-center">
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Ulangi kata sandi baru..."
                                        className="w-full bg-[#0c0406] border border-rose-900/40 text-zinc-100 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors pr-10"
                                    />
                                    <button
                                        type="button"
                                        aria-label="Toggle confirm visibility"
                                        onClick={() => setShowConfirm((v) => !v)}
                                        className="absolute right-3 text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer"
                                    >
                                        {showConfirm ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-1 space-y-2">
                            <button
                                type="submit"
                                disabled={status !== "idle"}
                                className={`w-full py-2.5 px-4 text-xs uppercase tracking-wider font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 ${
                                    status === "success"
                                        ? "bg-emerald-600 text-white"
                                        : "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white"
                                }`}
                            >
                                {status === "verifying" ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>VERIFYING OTP...</span>
                                    </>
                                ) : status === "success" ? (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        <span>CREDENTIALS UPDATED • REDIRECTING</span>
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="w-4 h-4" />
                                        <span>VERIFIKASI OTP &amp; SIMPAN PASSWORD BARU</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                            <div className="text-center">
                                <Link
                                    href="/admin/login"
                                    className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-rose-400 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Batalkan &amp; Kembali ke Login Admin</span>
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Telemetry & security footer */}
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-1 px-2 py-2.5 bg-[#0d0d15]/60 backdrop-blur rounded-lg text-zinc-500">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-300">
                            GATEWAY TELEMETRY ACTIVE
                        </span>
                        <span className="text-[#34343d]">/</span>
                        <span className="font-mono text-[11px] uppercase">THROTTLE: 3 ATTEMPTS / 5 MIN</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-tight">HOST: 182.253.71.49</span>
                        <span className="text-[#34343d]">•</span>
                        <span className="font-mono text-[10px] text-emerald-400 uppercase">
                            Sanctum &amp; MailQueue Guarded
                        </span>
                    </div>
                </div>
            </div>
        </AuthShell>
    );
}
