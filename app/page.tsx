import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AboutAndSkillsSection } from "@/components/AboutAndSkillsSection";
import { CertificatesAndProjectsSection } from "@/components/CertificatesAndProjectsSection";
import { ContactAndFooterSection } from "@/components/ContactAndFooterSection";
import { FloatingDock } from "@/components/FloatingDock";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070204] text-zinc-100 font-sans selection:bg-rose-500 selection:text-white relative overflow-x-clip">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-600/10 rounded-full blur-[128px]"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-red-600/10 rounded-full blur-[128px]"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-rose-900/15 rounded-full blur-[140px]"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation Bar */}
        <Header />

        <main>
          {/* Hero Section */}
          <HeroSection />

          {/* About & Skills Section */}
          <AboutAndSkillsSection />

          {/* Certificates & Featured Projects */}
          <CertificatesAndProjectsSection />

          {/* Contact Section & Footer */}
          <ContactAndFooterSection />
        </main>

        {/* Floating Quick Dock */}
        <FloatingDock />
      </div>
    </div>
  );
}