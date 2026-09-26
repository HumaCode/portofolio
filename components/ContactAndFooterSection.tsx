"use client";

import React, { useState } from "react";
import {
    Mail,
    MapPin,
    Send,
    Heart,
    ArrowUp,
    MessageSquare,
    Phone,
    Check,
} from "lucide-react";
import { portfolioData } from "@/data/portfolio";
import { useSmoothScroll } from "@/components/useSmoothScroll";

export const ContactAndFooterSection: React.FC = () => {
    const [profile, setProfile] = useState(portfolioData.profile);
    const { scrollToTop } = useSmoothScroll();

    React.useEffect(() => {
        fetch("/api/profile")
            .then((res) => res.json())
            .then((data) => {
                if (data?.profile) setProfile(data.profile);
            })
            .catch(() => {});
    }, []);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: "", email: "", subject: "", message: "" });
        }, 4000);
    };

    return (
        <>
            {/* Contact Section */}
            <section
                id="contact"
                className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 sm:py-16 border-t border-rose-950/40 relative scroll-mt-20"
            >
                <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full my-auto">
                    <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/40 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Get in touch</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            Let&apos;s Build Something{" "}
                            <span className="bg-gradient-to-r from-rose-400 to-red-500 bg-clip-text text-transparent">
                                Together
                            </span>
                        </h2>
                        <p className="text-zinc-400 text-sm">
                            Have a project in mind or interested in collaboration? Feel free to reach out.
                        </p>
                    </div>

                    {/* Single unified card container */}
                    <div className="bg-[#14060a]/80 border border-rose-900/30 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                            {/* Contact Form — primary focus */}
                            <div className="lg:col-span-7 order-2 lg:order-1">
                                {isSubmitted ? (
                                    <div className="py-8 text-center space-y-2">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <h4 className="text-base font-bold text-white">Message Sent!</h4>
                                        <p className="text-zinc-400 text-xs max-w-xs mx-auto">
                                            Thank you for reaching out. I will get back to you as soon as possible.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-3">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-medium text-zinc-300">Your Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="John Doe"
                                                    className="w-full px-3 py-2 rounded-lg bg-[#0c0406] border border-rose-900/40 text-zinc-100 text-xs focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-medium text-zinc-300">Your Email</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="john@example.com"
                                                    className="w-full px-3 py-2 rounded-lg bg-[#0c0406] border border-rose-900/40 text-zinc-100 text-xs focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[11px] font-medium text-zinc-300">Subject</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                placeholder="Project Inquiry / Job Opportunity"
                                                className="w-full px-3 py-2 rounded-lg bg-[#0c0406] border border-rose-900/40 text-zinc-100 text-xs focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[11px] font-medium text-zinc-300">Message</label>
                                            <textarea
                                                required
                                                rows={3}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                placeholder="Tell me more about your project goals or role..."
                                                className="w-full px-3 py-2 rounded-lg bg-[#0c0406] border border-rose-900/40 text-zinc-100 text-xs focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors resize-none"
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            className="px-6 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 group"
                                        >
                                            <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            <span>Send Message</span>
                                        </button>
                                    </form>
                                )}
                            </div>

                            {/* Contact Info sidebar */}
                            <div className="lg:col-span-5 order-1 lg:order-2 space-y-5">
                                <div className="space-y-4">
                                    <h3 className="text-base font-bold text-white">Contact Details</h3>
                                    <p className="text-zinc-400 text-xs leading-relaxed">
                                        Available for freelance contracts, full-time positions, or open-source collaborations.
                                    </p>

                                    <div className="space-y-3 pt-1">
                                        <div className="flex items-center gap-3 text-zinc-300">
                                            <div className="w-9 h-9 rounded-lg bg-rose-950/90 border border-rose-700/40 flex items-center justify-center text-rose-400 shrink-0">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-zinc-500 font-medium">Email</p>
                                                <a
                                                    href={`mailto:${profile.email}`}
                                                    className="text-sm font-semibold text-white hover:text-rose-400 transition-colors"
                                                >
                                                    {profile.email}
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-zinc-300">
                                            <div className="w-9 h-9 rounded-lg bg-rose-950/90 border border-rose-700/40 flex items-center justify-center text-rose-400 shrink-0">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-zinc-500 font-medium">Location</p>
                                                <p className="text-sm font-semibold text-white">{profile.location}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-zinc-300">
                                            <div className="w-9 h-9 rounded-lg bg-rose-950/90 border border-rose-700/40 flex items-center justify-center text-rose-400 shrink-0">
                                                <Phone className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-zinc-500 font-medium">Availability</p>
                                                <p className="text-sm font-semibold text-emerald-400">Open to opportunities</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Social links */}
                                <div className="pt-4 border-t border-rose-950/60">
                                    <p className="text-[11px] uppercase font-mono tracking-wider text-rose-400 font-bold mb-2.5">
                                        Connect on Socials
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {Object.entries(profile.socials).map(([key, url]) => (
                                            <a
                                                key={key}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="capitalize px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-800/40 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-rose-900/40 hover:border-rose-500/50 transition-all"
                                            >
                                                {key}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-rose-950/40 bg-[#070204] py-8 relative">
                <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <span>© {new Date().getFullYear()} {profile.brandName} ({profile.name}). Crafted with</span>
                        <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    </div>

                    {/* Back to top */}
                    <button
                        onClick={scrollToTop}
                        className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-rose-400 transition-colors px-3 py-1.5 rounded-full bg-rose-950/40 border border-rose-900/30 hover:border-rose-600/50"
                    >
                        <span>Back to top</span>
                        <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                </div>
            </footer>
        </>
    );
};