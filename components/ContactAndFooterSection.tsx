"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Mail,
    MapPin,
    Send,
    Heart,
    ArrowUp,
    MessageSquare,
    Sparkles,
    Phone,
    Check,
} from "lucide-react";
import { portfolioData } from "@/data/portfolio";

export const ContactAndFooterSection: React.FC = () => {
    const { profile } = portfolioData;
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

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            {/* Contact Section - Full Viewport */}
            <section
                id="contact"
                className="min-h-screen flex items-center justify-center pt-20 pb-16 relative scroll-mt-0"
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
                    <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/40 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Get in touch</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            Let's Build Something Incredible Together
                        </h2>
                        <p className="text-zinc-400 text-sm sm:text-base">
                            Have a project in mind or interested in collaboration? Feel free to reach out.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Contact Details / Info */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-[#14060a]/80 border border-rose-900/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                                <h3 className="text-xl font-bold text-white">Contact Details</h3>
                                <p className="text-zinc-300 text-sm leading-relaxed">
                                    I am available for freelance contracts, full-time positions, or open-source collaborations.
                                </p>

                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-4 text-zinc-300">
                                        <div className="w-10 h-10 rounded-xl bg-rose-950/90 border border-rose-700/40 flex items-center justify-center text-rose-400 shrink-0">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-400 font-medium">Email</p>
                                            <a
                                                href={`mailto:${profile.email}`}
                                                className="text-sm font-semibold text-white hover:text-rose-400 transition-colors"
                                            >
                                                {profile.email}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-zinc-300">
                                        <div className="w-10 h-10 rounded-xl bg-rose-950/90 border border-rose-700/40 flex items-center justify-center text-rose-400 shrink-0">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-400 font-medium">Location</p>
                                            <p className="text-sm font-semibold text-white">{profile.location}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-zinc-300">
                                        <div className="w-10 h-10 rounded-xl bg-rose-950/90 border border-rose-700/40 flex items-center justify-center text-rose-400 shrink-0">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-400 font-medium">Availability</p>
                                            <p className="text-sm font-semibold text-emerald-400">Open to opportunities</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Social links */}
                                <div className="pt-4 border-t border-rose-950/60">
                                    <p className="text-xs uppercase font-mono tracking-wider text-rose-400 font-bold mb-3">
                                        Connect on Socials
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2.5">
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

                        {/* Contact Form */}
                        <div className="lg:col-span-7">
                            <div className="bg-[#14060a]/80 border border-rose-900/30 rounded-2xl p-6 sm:p-8 shadow-xl">
                                {isSubmitted ? (
                                    <div className="py-12 text-center space-y-3">
                                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto">
                                            <Check className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-xl font-bold text-white">Message Sent Successfully!</h4>
                                        <p className="text-zinc-400 text-sm max-w-sm mx-auto">
                                            Thank you for reaching out. I will get back to you as soon as possible.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-zinc-300">Your Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="John Doe"
                                                    className="w-full px-4 py-2.5 rounded-xl bg-[#0e0407] border border-rose-900/40 text-zinc-100 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-zinc-300">Your Email</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="john@example.com"
                                                    className="w-full px-4 py-2.5 rounded-xl bg-[#0e0407] border border-rose-900/40 text-zinc-100 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-zinc-300">Subject</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                placeholder="Project Inquiry / Job Opportunity"
                                                className="w-full px-4 py-2.5 rounded-xl bg-[#0e0407] border border-rose-900/40 text-zinc-100 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-zinc-300">Message</label>
                                            <textarea
                                                required
                                                rows={4}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                placeholder="Tell me more about your project goals or role..."
                                                className="w-full px-4 py-2.5 rounded-xl bg-[#0e0407] border border-rose-900/40 text-zinc-100 text-sm focus:outline-none focus:border-rose-500 transition-colors resize-none"
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold text-sm shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
                                        >
                                            <span>Send Message</span>
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-rose-950/40 bg-[#070204] py-8 relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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