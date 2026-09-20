"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Terminal } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

export const Header: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { profile } = portfolioData;

    const navLinks = [
        { label: "Home", href: "#home" },
        { label: "About", href: "#about" },
        { label: "Skills", href: "#skills" },
        { label: "Certificates", href: "#certificates" },
        { label: "Projects", href: "#projects" },
        { label: "Contact", href: "#contact" },
    ];

    return (
        <header className="sticky top-0 z-40 w-full border-b border-rose-950/40 bg-[#0b0406]/85 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Brand */}
                <Link
                    href="#home"
                    className="flex items-center gap-2 group font-bold tracking-tight text-white hover:text-rose-400 transition-colors"
                >
                    <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-700/40 flex items-center justify-center text-rose-400 group-hover:scale-105 group-hover:border-rose-500 transition-all">
                        <Terminal className="w-4 h-4" />
                    </div>
                    <span className="text-lg">
                        {profile.brandName}{" "}
                        <span className="text-rose-500 text-xs uppercase tracking-widest font-normal">
                            .{profile.name.toLowerCase()}
                        </span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-300">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="hover:text-rose-400 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Action Button */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        href="/admin"
                        className="px-3 py-1.5 rounded-full bg-[#18080c] hover:bg-[#260c13] text-rose-300 hover:text-white text-xs font-medium border border-rose-800/40 transition-all flex items-center gap-1.5"
                    >
                        <Terminal className="w-3.5 h-3.5 text-rose-400" />
                        <span>Admin CMS</span>
                    </Link>
                    <Link
                        href="#contact"
                        className="px-4 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition-all active:scale-95"
                    >
                        Hire Me
                    </Link>
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 text-zinc-400 hover:text-white"
                    aria-label="Toggle Navigation Menu"
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden border-b border-rose-950/50 bg-[#120508] px-6 py-4 space-y-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-1.5 text-zinc-300 hover:text-rose-400 text-sm font-medium"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-2 space-y-2">
                        <Link
                            href="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block w-full text-center px-4 py-2 rounded-xl bg-[#1f0a10] border border-rose-800/40 text-rose-300 text-xs font-semibold"
                        >
                            Admin CMS Panel
                        </Link>
                        <Link
                            href="#contact"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block w-full text-center px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                        >
                            Hire Me
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};