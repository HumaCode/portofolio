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
            <div className="relative w-full max-w-2xl mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-600/20 via-cyan-500/10 to-rose-600/20 rounded-xl blur-xl opacity-70 pointer-events-none"></div>

                <div className="relative bg-[#1b1b23]/95 backdrop-blur-xl p-4 sm:p-10 rounded-xl shadow-2xl shadow-black/50">
                    <div className="absolute top-2 left-2 flex items-center gap-0.5 text-rose-600/60 pointer-events-none select-none">
                        <span className="font-mono text-[10px]">[</span>
                        <span className="w-1.5 h-1.5 bg-rose-600/40"></span>
                        <span className="font-mono text-[10px]">]</span>
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-0.5 text-rose-600/60 pointer-events-none select-none">
                        <span className="font-mono text-[10px]">[</span>
                        <span className="w-1.5 h-1.5 bg-rose-600/40"></span>
                        <span className="font-mono text-[10px]">]</span>
                    </div>
                    <div className="absolute bottom-2 left-2 flex items-center gap-0.5 text-cyan-400/40 pointer-events-none select-none">
                        <span className="font-mono text-[10px]">[</span>
                        <span className="w-1.5 h-1.5 bg-cyan-400/30"></span>
                        <span className="font-mono text-[10px]">]</span>
                    </div>
                    <div className="absolute bottom-2 right-2 flex items-center gap-0.5 text-cyan-400/40 pointer-events-none select-none">
                        <span className="font-mono text-[10px]">[</span>
                        <span className="w-1.5 h-1.5 bg-cyan-400/30"></span>
                        <span className="font-mono text-[10px]">]</span>
                    </div>
                    {/* Top nav */}
                    <div className="flex items-center justify-between gap-2 pb-4">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-600/10 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                            <span className="font-mono text-[11px] uppercase tracking-widest text-rose-300">
                                RECOVERY PROTOCOL / PASSWORD RESET
                            </span>
                        </div>
                        <Link
                            href="/admin/login"
                            className="inline-flex items-center gap-1 text-xs text-zinc-300 hover:text-cyan-400 transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            <span>Kembali ke Login</span>
                        </Link>
                    </div>

                    {/* Terminal header */}
                    <div className="flex flex-col items-center text-center space-y-1 mb-6">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1f1f27] rounded-lg shadow-inner">
                            <div className="w-6 h-6 rounded bg-rose-600 flex items-center justify-center text-white font-bold text-sm">
                                f
                            </div>
                            <span className="font-semibold text-lg tracking-tight text-zinc-100">
                                fLINK<span className="text-rose-600">.dev</span>
                            </span>
                            <span className="font-mono text-[10px] text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-600/30 uppercase tracking-tighter">
                                root:auth
                            </span>
                        </div>
                        <h1 className="font-bold text-2xl sm:text-[2rem] sm:leading-10 tracking-[-0.02em] text-zinc-100">
                            Verifikasi &amp; Reset Akses
                        </h1>
                        <p className="text-xs text-zinc-300 max-w-md">
                            SECURE CREDENTIAL RECOVERY GATEWAY • MULTI-FACTOR VERIFICATION
                        </p>
                    </div>

                    {/* Protocol flow steps */}
                    <div className="grid grid-cols-3 gap-1 mb-6">
                        <div className="flex flex-col gap-1 p-2 rounded bg-[#1f1f27]/60">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px] text-emerald-400">STEP 01</span>
                                <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                            <span className="text-xs text-zinc-100 truncate">Email Dispatched</span>
                        </div>
                        <div className="flex flex-col gap-1 p-2 rounded bg-rose-600/15 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px] text-rose-400">STEP 02 [ACTIVE]</span>
                                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                            </div>
                            <span className="text-xs text-rose-200 font-semibold truncate">Verifikasi 6-Digit</span>
                        </div>
                        <div className="flex flex-col gap-1 p-2 rounded bg-[#1f1f27]/40 opacity-70">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px] text-zinc-400">STEP 03</span>
                                <LockKeyhole className="w-3.5 h-3.5 text-zinc-400" />
                            </div>
                            <span className="text-xs text-zinc-400 truncate">Sandi Baru</span>
                        </div>
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Step 1: dispatched email capsule */}
                        <div className="p-3 sm:p-4 rounded-xl bg-[#0d0d15]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-emerald-600/20 flex items-center justify-center text-emerald-400 shrink-0">
                                    <BadgeCheck className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs text-zinc-300 uppercase tracking-wider">Email Terdaftar</span>
                                    <span className="font-bold text-sm text-zinc-100 truncate">admin@portfolio.com</span>
                                </div>
                            </div>
                            <div className="flex flex-col sm:items-end">
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 font-mono text-[10px] uppercase">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                    <span>Ref ID: #SEC-9842</span>
                                </div>
                                <span className="text-[11px] text-zinc-500 mt-0.5">Kode OTP Terkirim via Queue</span>
                            </div>
                        </div>
                        {/* Step 2: 6-digit OTP */}
                        <div className="space-y-1 p-3 sm:p-4 rounded-xl bg-[#1f1f27]/40">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-zinc-100 uppercase tracking-wide flex items-center gap-1.5">
                                    <ShieldCheck className="w-[18px] h-[18px] text-rose-600" />
                                    <span>Masukkan Kode OTP 6 Digit</span>
                                </label>
                                <span className="font-mono text-[11px] text-cyan-400 tracking-wider">TTL: 120 SEC</span>
                            </div>
                            <div className="grid grid-cols-6 gap-2 sm:gap-3 py-1">
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
                                        className={`w-full h-14 sm:h-16 text-center text-3xl font-extrabold bg-[#0d0d15] rounded-lg shadow-inner focus:outline-none focus:bg-[#292932] transition-all placeholder:text-zinc-600 selection:bg-rose-600 ${
                                            val ? "text-zinc-100" : "text-rose-300"
                                        }`}
                                    />
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                                <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                                    <Timer className="w-4 h-4 text-cyan-400" />
                                    <span>Kirim ulang kode dalam:</span>
                                    <span className="font-mono font-bold text-cyan-400 tracking-widest">
                                        {minutes}:{seconds}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={!resendEnabled}
                                    className={`inline-flex items-center gap-1 font-mono text-[11px] uppercase transition-colors self-start sm:self-auto ${
                                        resendEnabled
                                            ? "text-cyan-400 font-bold"
                                            : "text-zinc-400 opacity-50 pointer-events-none"
                                    }`}
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    <span>Kirim Ulang OTP</span>
                                </button>
                            </div>

                            <div className="flex items-center gap-2 p-2 bg-[#0d0d15]/60 rounded text-zinc-300 text-xs">
                                <Info className="w-4 h-4 text-zinc-500 shrink-0" />
                                <span className="text-[12px]">
                                    Cek folder inbox atau spam email{" "}
                                    <strong className="text-zinc-100 font-medium">admin@portfolio.com</strong> jika
                                    kode tidak muncul.
                                </span>
                            </div>
                        </div>
                        {/* Step 3: new password */}
                        <div className="space-y-1 p-3 sm:p-4 rounded-xl bg-[#1f1f27]/40">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-semibold text-zinc-100 uppercase tracking-wide flex items-center gap-1.5">
                                    <LockKeyhole className="w-[18px] h-[18px] text-rose-600" />
                                    <span>Tetapkan Kata Sandi Baru</span>
                                </span>
                                <span className="font-mono text-[10px] text-emerald-400">MIN. 12 KARAKTER</span>
                            </div>

                            <div className="space-y-1 text-left">
                                <label className="text-xs text-zinc-300 block">Kata Sandi Baru</label>
                                <div className="relative flex items-center">
                                    <input
                                        type={showNew ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Masukkan password kuat..."
                                        className="w-full h-11 bg-[#0d0d15] px-3.5 pr-10 rounded-lg text-zinc-100 text-sm focus:outline-none focus:bg-[#292932] transition-colors"
                                    />
                                    <button
                                        type="button"
                                        aria-label="Toggle password visibility"
                                        onClick={() => setShowNew((v) => !v)}
                                        className="absolute right-3 text-zinc-500 hover:text-zinc-100 transition-colors cursor-pointer"
                                    >
                                        {showNew ? (
                                            <EyeOff className="w-[18px] h-[18px]" />
                                        ) : (
                                            <Eye className="w-[18px] h-[18px]" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5 py-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-zinc-500 uppercase tracking-wider">
                                        Kekuatan Sandi:
                                    </span>
                                    <span className="font-mono text-[11px] text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                                        <CheckCircle className="w-3.5 h-3.5" />
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

                            <div className="space-y-1 pt-1 text-left">
                                <label className="text-xs text-zinc-300 block">Konfirmasi Kata Sandi Baru</label>
                                <div className="relative flex items-center">
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Ulangi kata sandi baru..."
                                        className="w-full h-11 bg-[#0d0d15] px-3.5 pr-10 rounded-lg text-zinc-100 text-sm focus:outline-none focus:bg-[#292932] transition-colors"
                                    />
                                    <button
                                        type="button"
                                        aria-label="Toggle confirm visibility"
                                        onClick={() => setShowConfirm((v) => !v)}
                                        className="absolute right-3 text-zinc-500 hover:text-zinc-100 transition-colors cursor-pointer"
                                    >
                                        {showConfirm ? (
                                            <EyeOff className="w-[18px] h-[18px]" />
                                        ) : (
                                            <Eye className="w-[18px] h-[18px]" />
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
                                className={`w-full py-3.5 px-4 text-sm uppercase tracking-wider font-bold rounded-lg shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2 active:scale-[0.99] ${
                                    status === "success"
                                        ? "bg-emerald-600 text-white"
                                        : "bg-rose-600 hover:bg-rose-700 text-white"
                                }`}
                            >
                                {status === "verifying" ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>VERIFYING OTP...</span>
                                    </>
                                ) : status === "success" ? (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        <span>CREDENTIALS UPDATED • REDIRECTING</span>
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="w-5 h-5" />
                                        <span>VERIFIKASI OTP &amp; SIMPAN PASSWORD BARU</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                            <div className="text-center">
                                <Link
                                    href="/admin/login"
                                    className="inline-flex items-center gap-1 text-xs text-zinc-300 hover:text-red-400 transition-colors"
                                >
                                    <X className="w-4 h-4" />
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
