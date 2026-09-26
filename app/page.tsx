import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AboutAndSkillsSection } from "@/components/AboutAndSkillsSection";
import { CertificatesAndProjectsSection } from "@/components/CertificatesAndProjectsSection";
import { ContactAndFooterSection } from "@/components/ContactAndFooterSection";
import { FloatingDock } from "@/components/FloatingDock";
import { db } from "@/lib/db";
import { portfolioData, Profile, SkillGauge, Certificate } from "@/data/portfolio";

export const dynamic = "force-dynamic";

async function getProfile(): Promise<Profile> {
  try {
    const p = await db.profile.findUnique({
      where: { id: "default" },
    });
    if (!p) return portfolioData.profile;

    return {
      name: p.name,
      brandName: p.brandName,
      tagline: p.tagline || "",
      role: p.role,
      roles: Array.isArray(p.roles) ? (p.roles as string[]) : [p.role],
      bio: p.bio,
      aboutBio: p.aboutBio,
      yearsExp: p.yearsExp,
      projectsCount: p.projectsCount,
      clientsCount: p.clientsCount,
      isAvailable: p.isAvailable,
      avatarUrl: p.avatarUrl,
      aboutImageUrl: p.aboutImageUrl || "",
      certImageUrl: p.certImageUrl || "",
      contactImageUrl: p.contactImageUrl || "",
      location: p.location,
      email: p.email,
      phone: p.phone || "",
      socials: (p.socials as Profile["socials"]) || {},
      secondaryStack: Array.isArray(p.secondaryStack)
        ? (p.secondaryStack as string[])
        : portfolioData.secondaryStack,
    };
  } catch (e) {
    console.error("Error fetching profile in page.tsx:", e);
    return portfolioData.profile;
  }
}

async function getSkills(): Promise<SkillGauge[]> {
  try {
    const skills = await db.skill.findMany({
      orderBy: [{ percentage: "desc" }, { createdAt: "asc" }],
    });
    if (skills.length > 0) {
      return skills.map((s) => ({
        name: s.name,
        percentage: s.percentage,
        category: s.category || "General",
        color: s.color,
        strokeColor: s.strokeColor,
      }));
    }
    return portfolioData.skillsGauges;
  } catch {
    return portfolioData.skillsGauges;
  }
}

async function getCertificates(): Promise<Certificate[]> {
  try {
    const certs = await db.certificate.findMany({
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    });
    if (certs.length > 0) {
      return certs.map((c) => ({
        id: c.id,
        title: c.title,
        issuer: c.issuer,
        year: c.year,
        verifyUrl: c.verifyUrl || undefined,
        isVerified: c.isVerified,
      }));
    }
    return portfolioData.certificates;
  } catch {
    return portfolioData.certificates;
  }
}

export default async function Home() {
  const [profile, skills, certificates] = await Promise.all([
    getProfile(),
    getSkills(),
    getCertificates(),
  ]);

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
        <Header initialProfile={profile} />

        <main>
          {/* Hero Section */}
          <HeroSection initialProfile={profile} />

          {/* About & Skills Section */}
          <AboutAndSkillsSection initialProfile={profile} initialSkills={skills} />

          {/* Certificates & Featured Projects */}
          <CertificatesAndProjectsSection initialCertificates={certificates} />

          {/* Contact Section & Footer */}
          <ContactAndFooterSection initialProfile={profile} />
        </main>

        {/* Floating Quick Dock */}
        <FloatingDock />
      </div>
    </div>
  );
}