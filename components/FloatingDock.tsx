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
    const [activeSection, setActiveSection] = React.useState<string>("home");

    React.useEffect(() => {
        const sections = ["home", "about", "skills", "certificates", "projects", "contact"];

        const handleScroll = () => {
            const homeSection = document.getElementById("home");
            if (homeSection) {
                const rect = homeSection.getBoundingClientRect();
                setIsAtHome(rect.bottom > 200);
            } else {
                setIsAtHome(window.scrollY < 300);
            }

            // Temukan section yang sedang aktif di viewport tengah layar
            const scrollPosition = window.scrollY + window.innerHeight / 3;

            for (let i = sections.length - 1; i >= 0; i--) {
                const sectionId = sections[i];
                const element = document.getElementById(sectionId);
                if (element) {
                    const top = element.offsetTop;
                    if (scrollPosition >= top) {
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

    const dockItems = [
        { id: "home", label: "Home", icon: Home, href: "#home" },
        { id: "about", label: "About", icon: User, href: "#about" },
        { id: "skills", label: "Skills", icon: Cpu, href: "#skills" },
        { id: "certificates", label: "Certificates", icon: Award, href: "#certificates" },
        { id: "projects", label: "Projects", icon: Briefcase, href: "#projects" },
        { id: "contact", label: "Contact", icon: Mail, href: "#contact" },
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
            <nav aria-label="Floating dock menu" className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-[#14060a]/90 backdrop-blur-xl border border-rose-800/40 shadow-2xl shadow-rose-950/80 ring-1 ring-rose-500/20">
                {dockItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;

                    return (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={(e) => scrollToSection(e, item.href)}
                            className={`relative p-2.5 sm:p-3 rounded-xl transition-all group flex items-center justify-center ${
                                isActive
                                    ? "bg-rose-600/20 text-rose-400 border border-rose-500/40 shadow-inner shadow-rose-500/20 -translate-y-1"
                                    : "text-zinc-400 hover:text-white hover:bg-rose-900/40 hover:-translate-y-1"
                            }`}
                            aria-label={item.label}
                        >
                            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                                isActive ? "text-rose-400" : "text-zinc-300 group-hover:text-rose-400"
                            }`} />

                            {/* Active subtle bottom dot indicator */}
                            {isActive && (
                                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-rose-400 shadow-sm shadow-rose-300 animate-pulse"></span>
                            )}

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