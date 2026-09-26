export interface Profile {
    name: string;
    brandName: string;
    tagline: string;
    role: string;
    roles?: string[];
    bio: string;
    aboutBio: string;
    yearsExp: string;
    projectsCount: string;
    clientsCount: string;
    isAvailable?: boolean;
    avatarUrl: string;
    aboutImageUrl: string;
    certImageUrl: string;
    contactImageUrl: string;
    location: string;
    email: string;
    phone?: string;
    socials: {
        github?: string;
        instagram?: string;
        tiktok?: string;
        youtube?: string;
        linkedin?: string;
    };
    secondaryStack?: string[];
}

export interface SkillGauge {
    name: string;
    percentage: number;
    category?: string;
    color: string;
    strokeColor: string;
}

export interface Certificate {
    id: string;
    title: string;
    issuer: string;
    year: string;
    verifyUrl?: string;
    isVerified?: boolean;
}

export interface Project {
    id: string;
    title: string;
    category?: string;
    description: string;
    tags: string[];
    imageUrl: string;
    codeUrl?: string;
    demoUrl?: string;
    isFeatured?: boolean;
    isInternal?: boolean;
}

export interface InboxMessage {
    id: string;
    senderName: string;
    senderCompany?: string;
    email: string;
    subject: string;
    message: string;
    timeAgo: string;
    isRead: boolean;
    initials: string;
    accentColor?: "crimson" | "cyan" | "emerald" | "neutral";
}

export interface SystemTelemetry {
    version: string;
    apiGatewayStatus: "Online" | "Degraded" | "Offline";
    databaseLatency: string;
    memoryUsagePercent: number;
    cpuLoadPercent: number;
    uptime: string;
    totalProjectsCount: number;
    totalSkillsCount: number;
    totalCertificatesCount: number;
    totalInboxCount: number;
    unreadInboxCount: number;
}

export const portfolioData: {
    profile: Profile;
    skillsGauges: SkillGauge[];
    secondaryStack: string[];
    certificates: Certificate[];
    projects: Project[];
    inboxMessages: InboxMessage[];
    telemetry: SystemTelemetry;
} = {
    profile: {
        name: "Charlotte",
        brandName: "fLINK",
        tagline: "Charlotte Edition",
        role: "<Frontend & Fullstack Developer />",
        roles: [
            "<Frontend & Fullstack Developer />",
            "<React & Next.js />",
            "<UI/UX & Laravel Engineer />",
        ],
        bio: "I craft beautiful and responsive web experiences with modern technologies. Turning complex technical challenges into pixel-perfect, highly scalable interfaces.",
        aboutBio: "I'm a passionate Fullstack & Frontend Developer dedicated to creating exceptional digital experiences. With deep expertise in Laravel, Next.js, and Flutter, I engineer high-performance systems and enterprise web platforms.",
        yearsExp: "2+",
        projectsCount: "18+",
        clientsCount: "12+",
        isAvailable: true,
        avatarUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCK2zBBCXbK85Nz29lofSJ6Qvmbgcrga1igfxQ9lwGsZqgnIRuan7YNy_dereWT0PFYDyjUK6gB7MMSYUqPuaNTs8i_7aOf2kdEHDT-9Kj-2Dqs0MwMrV86bB6rTtxn2Z6mivFZKUAbt6hZcrIA64DHzJv0izvv0AH6yBoy2Av3uTVYfMIolj9I--OMkWnJu6ORuNAwZZK2iVVeDvfaB5L1A_ApBmaR49bMNflukwBZ-3Y31bmkQEBJnQ",
        aboutImageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDhmgsw9GTwXS4M6iE7VACyrhyC7x8CXipBeJFw0Vl-hlrhBrNlmwByT3Ija756zusR8eur7HQh1pq70cMkPA3848fpSBAyxZtqZzh8gGJUrc9EBSQ8rmW_JBSpi0wZXCnev8z6apZilXrdh6VFN6nZQnPXNbavGYmEMkj7Myv9ZOwPV5XlMkaP4wpFU4bSCsJrAzCNy-cDh5Qu6I291iXwToHww7RdOmXBMAYGTdt0FKusNkMIPllZSA",
        certImageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDs-HaO5R860iSqsj2siJdo__yn9FrPO_AsW0zH0bpk3ojVowiqpkELiTSHhQ_kn9wykxO7PbcFKzh81vhfV6gp_Y-hVpZIrErKyVqVpHt_3D7LJvx8TtgNhZlfPf55GFjW-bY2yjXDbbrvG_LQc-ON9B3pQGJ1a2A054mH83kjY-doiyDHaPynedDyCEyuYmMmVAknXrAMPBAM0fIVvH82o5_1a_Qw3a5AUuDOI2xc87itAMng5lIEnA",
        contactImageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBCPIZ-98_HCoCxjjhUt-ykiLi7EJAbsA7A7haSjlQNsNPRXHL9PfgbFj6Z1RUnppSO63PaAl05ZNwHqwv5UHLc4vGKUDZzHot4TIK7fVFz7s_pf8Wz0IbNeJR-542szpL1kEPPD1t95e8p7VEbNjZ3Xb68QP4fcpJK9BRqWIRwYVw8Dmz1RIiTQI_3xgM8f41Wvo8grmJU4t8V2SGr0jKSJsvYvqa6C93lh2Z0SptghJh2PZGdk1DP-w",
        location: "Pekalongan, Central Java, Indonesia",
        email: "charlotte.flink@example.com",
        phone: "+62 812-3456-7890",
        socials: {
            github: "https://github.com",
            instagram: "https://instagram.com",
            tiktok: "https://tiktok.com",
            youtube: "https://youtube.com",
            linkedin: "https://linkedin.com",
        },
    },
    skillsGauges: [
        {
            name: "React & Next.js",
            percentage: 95,
            category: "Frontend",
            color: "from-rose-500 to-red-600",
            strokeColor: "#f43f5e",
        },
        {
            name: "Tailwind CSS",
            percentage: 92,
            category: "Frontend",
            color: "from-cyan-400 to-blue-500",
            strokeColor: "#06b6d4",
        },
        {
            name: "Laravel & PHP",
            percentage: 90,
            category: "Backend",
            color: "from-red-500 to-rose-600",
            strokeColor: "#e11d48",
        },
        {
            name: "TypeScript",
            percentage: 88,
            category: "Frontend",
            color: "from-sky-400 to-indigo-500",
            strokeColor: "#38bdf8",
        },
        {
            name: "Flutter & Dart",
            percentage: 85,
            category: "Mobile",
            color: "from-emerald-400 to-green-500",
            strokeColor: "#10b981",
        },
        {
            name: "PostgreSQL & MySQL",
            percentage: 86,
            category: "Database",
            color: "from-amber-400 to-yellow-500",
            strokeColor: "#facc15",
        },
    ],
    secondaryStack: [
        "Laravel 11 & Livewire",
        "Flutter & Dart",
        "Next.js 16 App Router",
        "TypeScript & React 19",
        "Tailwind CSS v4",
        "PostgreSQL / MySQL",
        "REST APIs & GraphQL",
        "Figma UI/UX & Tokens",
        "Docker & CI/CD",
        "Git & GitHub Actions",
    ],
    certificates: [
        {
            id: "cert-1",
            title: "Frontend Development Specialist",
            issuer: "Meta Professional Program",
            year: "2024",
            verifyUrl: "https://example.com/verify/meta-1",
            isVerified: true,
        },
        {
            id: "cert-2",
            title: "React Advanced & Architecture",
            issuer: "Google Developer Certification",
            year: "2023",
            verifyUrl: "https://example.com/verify/google-2",
            isVerified: true,
        },
        {
            id: "cert-3",
            title: "UI/UX Design Specialist",
            issuer: "Adobe Creative Suite",
            year: "2023",
            verifyUrl: "https://example.com/verify/adobe-3",
            isVerified: true,
        },
        {
            id: "cert-4",
            title: "Fullstack Laravel & Microservices",
            issuer: "BNSP Indonesia IT Certification",
            year: "2023",
            verifyUrl: "https://example.com/verify/bnsp-4",
            isVerified: true,
        },
    ],
    projects: [
        {
            id: "proj-1",
            title: "SPBE Portal Terpadu",
            category: "GovTech • Architecture",
            description:
                "Sistem Pelayanan Berbasis Elektronik terintegrasi multi-tenant dengan enkripsi data ASN dan dashboard analitik real-time.",
            tags: ["Laravel 11", "Livewire 3", "MySQL"],
            imageUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDhmgsw9GTwXS4M6iE7VACyrhyC7x8CXipBeJFw0Vl-hlrhBrNlmwByT3Ija756zusR8eur7HQh1pq70cMkPA3848fpSBAyxZtqZzh8gGJUrc9EBSQ8rmW_JBSpi0wZXCnev8z6apZilXrdh6VFN6nZQnPXNbavGYmEMkj7Myv9ZOwPV5XlMkaP4wpFU4bSCsJrAzCNy-cDh5Qu6I291iXwToHww7RdOmXBMAYGTdt0FKusNkMIPllZSA",
            codeUrl: "https://github.com",
            demoUrl: "https://demo.spbe-terpadu.gov",
            isFeatured: true,
            isInternal: false,
        },
        {
            id: "proj-2",
            title: "DAMAI Mobile SPBE",
            category: "Public Sector • Cross Platform",
            description:
                "Aplikasi mobile pelaporan masyarakat dan administrasi kedaruratan terhubung gateway SPBE dengan offline caching.",
            tags: ["Flutter", "REST API", "Dart"],
            imageUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBtJ-WrYYkw5HMu9WNFw-1MpJVMxYh_mATVS0kXydljRmRuwYi_jfWwtMbT1AhPmbcYVgcksTbRV0ecRujrClatr5VyhjAeQYRblxU9xOLeI8MuxyRYE33xskzTlHwfPS3ZVxm024zSn0tddiYhJWruCg22CN9vQwmhUROHicCR_KGBr4wPzGbgn63EeuYgit4opzLzerIdYM7A-BWBjCGleq4QQlIJhUsEKjSb00N2",
            codeUrl: "https://github.com",
            demoUrl: "https://play.google.com",
            isFeatured: true,
            isInternal: false,
        },
        {
            id: "proj-3",
            title: "3D Portfolio Website",
            category: "Creative • Interactive WebGL",
            description:
                "Modern developer portfolio featuring interactive 3D aesthetics, responsive dark crimson theme, and smooth UI animations.",
            tags: ["React", "Tailwind CSS", "Framer Motion"],
            imageUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCpNQO6-9JwaXPggIP-hXRJFKc15qhn8FfVqKjn2Vb1QLEcPuNxmC5YaFjGOyTupTdts6a0KWmbGcT3i_Jq_WN11ngEwk6Q5nQ5KltO6DZ7rywW7UWj4nvczWSwpFIt4kOn-2HML-tTIiis1SME5Si6QfhCtKRFod0W_01FuwmCN29hzzEgmtWSm2U_SPfA1gqvpBs-3JDXzs_4U84SdGFh7r27nCd_x1k5PfIrfYTdLfnN8fC1sk3l_g",
            codeUrl: "https://github.com",
            demoUrl: "https://demo.portfolio.dev",
            isFeatured: true,
            isInternal: false,
        },
        {
            id: "proj-4",
            title: "SIGAP Kepegawaian ASN",
            category: "Enterprise • Human Capital",
            description:
                "Platform manajemen karir, mutasi, dan penilaian kinerja ASN dengan sistem RBAC ketat dan audit trail lengkap.",
            tags: ["Laravel 11", "PostgreSQL", "Tailwind"],
            imageUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAbSzg-H6ZsEBT9vWAljM-SVYfO6cT93Vm10V59xdneEtrT9q-19oPoLZpS1LOGpkjGBg5985IksehvkTYgx1_zUXkz-ixcuvmYOrzFv1wFLy3_eL3g5pELDHy7BNqeo4zASJFBKNakT3LSckYt6l_JxoWB9k0eInu0XX8PdMPqqjgpNdk90IEgv43iOkO53VGOdTcIvrVJPVn8xnle9Z-fGBNvU3FUDvTpItU99COCaTVzP380kZXk9A",
            codeUrl: "https://github.com",
            demoUrl: "#",
            isFeatured: false,
            isInternal: true,
        },
        {
            id: "proj-5",
            title: "Dark/Light Mode Hub",
            category: "Dashboard & Design System",
            description:
                "Responsive dashboard system with adaptive theme switching, modular component library, and dynamic user configurations.",
            tags: ["Vue JS", "Tailwind CSS", "Pinia"],
            imageUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDCnmtFzmB8D_UOzXlZKGFhCKJ28-TJgv2pLigxE-iVUfltOQUbXgj5a7bHxWN3vECGCE_wGiNAXA6b57egQP7_fSE0xfCvoHxBI09J4JiycDaD9uU90S8T7VXTLYrkxfCDf1Da96qoOFxEyVGRAN4Z9aJBNNnQ_Q3N2KqK3BuZY_hygsXJTToNeZFROnLV3-9Hii_zHjl40rzTNy5TcUx1OY_fwLi1zRinJBepMVHTaJtVR5hIXfCp7Q",
            codeUrl: "https://github.com",
            demoUrl: "https://demo.theming-hub.dev",
            isFeatured: false,
            isInternal: false,
        },
        {
            id: "proj-6",
            title: "Enterprise Portal Suite",
            category: "Cloud Services • Verification",
            description:
                "Scalable cloud platform for enterprise document verification, high-concurrency role management, and administrative workflow.",
            tags: ["React", "REST APIs", "PostgreSQL"],
            imageUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAbSzg-H6ZsEBT9vWAljM-SVYfO6cT93Vm10V59xdneEtrT9q-19oPoLZpS1LOGpkjGBg5985IksehvkTYgx1_zUXkz-ixcuvmYOrzFv1wFLy3_eL3g5pELDHy7BNqeo4zASJFBKNakT3LSckYt6l_JxoWB9k0eInu0XX8PdMPqqjgpNdk90IEgv43iOkO53VGOdTcIvrVJPVn8xnle9Z-fGBNvU3FUDvTpItU99COCaTVzP380kZXk9A",
            codeUrl: "https://github.com",
            demoUrl: "https://demo.enterprise-portal.dev",
            isFeatured: false,
            isInternal: false,
        },
    ],
    inboxMessages: [
        {
            id: "msg-1",
            senderName: "Budi Santoso",
            senderCompany: "PT Inovasi Digital",
            email: "budi@inovasidigital.id",
            subject: "Penawaran Kerjasama Pembuatan Sistem SPBE",
            message:
                "Halo Mas fLINK, kami melihat portofolio SPBE Portal Terpadu Anda dan sangat terkesan dengan arsitektur multi-tenant-nya. Kami berencana membangun sistem layanan serupa untuk dinas terkait bulan depan. Apakah Anda bersedia untuk diskusi teknis via Google Meet minggu ini?",
            timeAgo: "10 menit yang lalu",
            isRead: false,
            initials: "BS",
            accentColor: "crimson",
        },
        {
            id: "msg-2",
            senderName: "Sarah Jenkins",
            senderCompany: "Global Tech Recruiter",
            email: "sarah.j@globalhire.com",
            subject: "Full-time Senior Laravel & Frontend Developer Opportunity",
            message:
                "Hi fLINK, your profile stood out for an APAC remote position specializing in high-concurrency Laravel and Flutter microservices. Would you be open to a 20-min introductory sync regarding this full-time role?",
            timeAgo: "2 jam yang lalu",
            isRead: false,
            initials: "SJ",
            accentColor: "cyan",
        },
        {
            id: "msg-3",
            senderName: "Ahmad Fauzi",
            senderCompany: "Dinas Kominfo",
            email: "ahmad.f@kominfo.go.id",
            subject: "Konsultasi Maintenance Aplikasi SIGAP Kepegawaian",
            message:
                "Terima kasih atas penyelesaian audit security kemarin. Dokumentasi arsitektur telah kami terima dengan baik. Mohon konfirmasi jadwal workshop handover bersama tim internal kami.",
            timeAgo: "Kemarin, 14:15 WIB",
            isRead: true,
            initials: "AF",
            accentColor: "neutral",
        },
    ],
    telemetry: {
        version: "PRD v1.0 • BAB 7 PRODUCTION",
        apiGatewayStatus: "Online",
        databaseLatency: "24ms",
        memoryUsagePercent: 42,
        cpuLoadPercent: 18,
        uptime: "99.98%",
        totalProjectsCount: 18,
        totalSkillsCount: 14,
        totalCertificatesCount: 8,
        totalInboxCount: 24,
        unreadInboxCount: 3,
    },
};