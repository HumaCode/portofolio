"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Terminal } from "lucide-react";
import { portfolioData } from "@/data/portfolio";
import { useSmoothScroll } from "@/components/useSmoothScroll";

export const Header: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAtHome, setIsAtHome] = useState(true);
    const [activeSection, setActiveSection] = useState<string>("home");
    const [profile, setProfile] = useState(portfolioData.profile);
    const { scrollToSection } = useSmoothScroll();

    React.useEffect(() => {
        fetch("/api/profile")
            .then((res) => res.json())
            .then((data) => {
                if (data?.profile) setProfile(data.profile);
            })
            .catch(() => {});
    }, []);

    React.useEffect(() => {
        const sections = ["home", "about", "skills", "certificates", "projects", "contact"];

        const handleScroll = () => {
            const homeSection = document.getElementById("home");
            if (homeSection) {
                const rect = homeSection.getBoundingClientRect();
                setIsAtHome(rect.bottom > 120);
            } else {
                setIsAtHome(window.scrollY < 400);
            }

            const scrollPosition = window.scrollY + window.innerHeight / 3;
            for (let i = sections.length - 1; i >= 0; i--) {
                const sectionId = sections[i];
                const element = document.getElementById(sectionId);
                if (element) {
                    if (scrollPosition >= element.offsetTop) {
                        setActiveSection(sectionId);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { id: "home", label: "Home", href: "#home" },
        { id: "about", label: "About", href: "#about" },
        { id: "skills", label: "Skills", href: "#skills" },
        { id: "certificates", label: "Certificates", href: "#certificates" },
        { id: "projects", label: "Projects", href: "#projects" },
        { id: "contact", label: "Contact", href: "#contact" },
    ];

    return (
        <header
            className={`sticky top-0 z-40 w-full border-b border-rose-950/40 bg-[#0b0406]/85 backdrop-blur-md transition-all duration-500 ${
                isAtHome
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-full pointer-events-none"
            }`}
        >
            <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-16 flex items-center justify-between">
                {/* Brand */}
                <a
                    href="#home"
                    onClick={(e) => scrollToSection(e, "#home")}
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
                </a>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-300">
                    {navLinks.map((link) => {
                        const isActive = activeSection === link.id;
                        return (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={(e) => scrollToSection(e, link.href)}
                                className={`transition-all relative py-1 ${
                                    isActive
                                        ? "text-rose-400 font-semibold"
                                        : "text-zinc-300 hover:text-rose-400"
                                }`}
                            >
                                {link.label}
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 to-red-500 rounded-full"></span>
                                )}
                            </a>
                        );
                    })}
                </nav>

                {/* Action Button */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        href="#contact"
                        onClick={(e) => scrollToSection(e, "#contact")}
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
                        <a
                            key={link.label}
                            href={link.href}
                            onClick={(e) => {
                                scrollToSection(e, link.href);
                                setMobileMenuOpen(false);
                            }}
                            className="block py-1.5 text-zinc-300 hover:text-rose-400 text-sm font-medium"
                        >
                            {link.label}
                        </a>
                    ))}
                    <div className="pt-2 space-y-2">
                        <a
                            href="#contact"
                            onClick={(e) => {
                                scrollToSection(e, "#contact");
                                setMobileMenuOpen(false);
                            }}
                            className="block w-full text-center px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                        >
                            Hire Me
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
};