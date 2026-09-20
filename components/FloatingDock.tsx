"use client";

import React from "react";
import {
    Home,
    User,
    Cpu,
    Award,
    Briefcase,
    Mail,
    Send,
    Sparkles,
} from "lucide-react";
import { portfolioData } from "@/data/portfolio";
import { useSmoothScroll } from "@/components/useSmoothScroll";

export const FloatingDock: React.FC = () => {
    const { profile } = portfolioData;
    const { scrollToSection } = useSmoothScroll();
    const [isAtHome, setIsAtHome] = React.useState(true);

    React.useEffect(() => {
        const handleScroll = () => {
            const homeSection = document.getElementById("home");
            if (homeSection) {
                const rect = homeSection.getBoundingClientRect();
                // Dock tersembunyi (hide) jika seksi home masih aktif/terlihat di layar
                setIsAtHome(rect.bottom > 200);
            } else {
                setIsAtHome(window.scrollY < 300);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const dockItems = [
        { label: "Home", icon: Home, href: "#home" },
        { label: "About", icon: User, href: "#about" },
        { label: "Skills", icon: Cpu, href: "#skills" },
        { label: "Certificates", icon: Award, href: "#certificates" },
        { label: "Projects", icon: Briefcase, href: "#projects" },
        { label: "Contact", icon: Mail, href: "#contact" },
    ];

    return (
        <aside
            aria-label="Quick navigation dock"
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
                isAtHome
                    ? "opacity-0 translate-y-12 pointer-events-none"
                    : "opacity-100 translate-y-0 pointer-events-auto"
            }`}
        >
            <nav aria-label="Floating dock menu" className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-[#14060a]/85 backdrop-blur-xl border border-rose-800/40 shadow-2xl shadow-rose-950/60 ring-1 ring-rose-500/20">
                {dockItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={(e) => scrollToSection(e, item.href)}
                            className="relative p-2.5 sm:p-3 rounded-xl text-zinc-400 hover:text-white hover:bg-rose-900/40 transition-all group flex items-center justify-center hover:-translate-y-1.5"
                            aria-label={item.label}
                        >
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-300 group-hover:text-rose-400 transition-colors" />
                            {/* Tooltip */}
                            <span className="absolute -top-9 scale-0 group-hover:scale-100 transition-transform bg-[#0b0406] text-rose-300 text-[10px] font-semibold tracking-wide py-1 px-2.5 rounded-lg border border-rose-800/50 shadow-md whitespace-nowrap pointer-events-none">
                                {item.label}
                            </span>
                        </a>
                    );
                })}

                <div className="w-[1px] h-6 bg-rose-900/50 mx-1 hidden sm:block"></div>

                {/* Quick Email trigger */}
                <a
                    href={`mailto:${profile.email}`}
                    className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-500 hover:to-red-500 transition-all flex items-center justify-center hover:-translate-y-1.5 shadow-lg shadow-rose-600/30 group relative"
                    aria-label="Send direct email"
                >
                    <Send className="w-4 h-4 sm:w-4 sm:h-4 text-white" />
                    <span className="absolute -top-9 scale-0 group-hover:scale-100 transition-transform bg-[#0b0406] text-rose-300 text-[10px] font-semibold tracking-wide py-1 px-2.5 rounded-lg border border-rose-800/50 shadow-md whitespace-nowrap pointer-events-none">
                        Direct Mail
                    </span>
                </a>
            </nav>
        </aside>
    );
};