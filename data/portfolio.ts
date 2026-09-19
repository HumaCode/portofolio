export interface Profile {
    name: string;
    brandName: string;
    tagline: string;
    role: string;
    bio: string;
    aboutBio: string;
    yearsExp: string;
    projectsCount: string;
    clientsCount: string;
    avatarUrl: string;
    aboutImageUrl: string;
    certImageUrl: string;
    contactImageUrl: string;
    location: string;
    email: string;
    socials: {
        github?: string;
        instagram?: string;
        tiktok?: string;
        youtube?: string;
        linkedin?: string;
    };
}

export interface SkillGauge {
    name: string;
    percentage: number;
    color: string;
    strokeColor: string;
}

export interface Certificate {
    id: string;
    title: string;
    issuer: string;
    year: string;
    verifyUrl?: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    imageUrl: string;
    codeUrl?: string;
    demoUrl?: string;
}

export const portfolioData: {
    profile: Profile;
    skillsGauges: SkillGauge[];
    secondaryStack: string[];
    certificates: Certificate[];
    projects: Project[];
} = {
    profile: {
        name: "Charlotte",
        brandName: "fLINK",
        tagline: "Charlotte Edition",
        role: "<Frontend Developer />",
        bio: "I craft beautiful and responsive web experiences with modern technologies. Turning complex technical challenges into pixel-perfect, highly scalable interfaces.",
        aboutBio: "I'm a passionate Frontend Developer dedicated to creating exceptional digital experiences. With a keen eye for design and a love for clean code, I transform complex problems into elegant, user-friendly solutions.",
        yearsExp: "2+",
        projectsCount: "15+",
        clientsCount: "10+",
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
            name: "React JS",
            percentage: 90,
            color: "from-cyan-400 to-blue-500",
            strokeColor: "#00d8ff",
        },
        {
            name: "Tailwind CSS",
            percentage: 85,
            color: "from-sky-400 to-cyan-500",
            strokeColor: "#38bdf8",
        },
        {
            name: "Vue JS",
            percentage: 75,
            color: "from-emerald-400 to-green-500",
            strokeColor: "#10b981",
        },
        {
            name: "JavaScript",
            percentage: 88,
            color: "from-amber-400 to-yellow-500",
            strokeColor: "#facc15",
        },
    ],
    secondaryStack: [
        "Laravel & PHP",
        "Flutter & Dart",
        "Next.js & App Router",
        "TypeScript",
        "MySQL / PostgreSQL",
        "RESTful APIs",
        "Figma UI/UX",
        "Git & GitHub Actions",
    ],
    certificates: [
        {
            id: "cert-1",
            title: "Frontend Development",
            issuer: "Meta Professional Program",
            year: "2024",
            verifyUrl: "#",
        },
        {
            id: "cert-2",
            title: "React Advanced & Architecture",
            issuer: "Google Developer Certification",
            year: "2023",
            verifyUrl: "#",
        },
        {
            id: "cert-3",
            title: "UI/UX Design Specialist",
            issuer: "Adobe Creative Suite",
            year: "2023",
            verifyUrl: "#",
        },
        {
            id: "cert-4",
            title: "JavaScript Mastery",
            issuer: "Microsoft Academy",
            year: "2022",
            verifyUrl: "#",
        },
    ],
    projects: [
        {
            id: "proj-1",
            title: "3D Portfolio Website",
            description:
                "Modern developer portfolio featuring interactive 3D aesthetics, responsive dark crimson theme, and smooth UI animations.",
            tags: ["React", "Tailwind CSS", "Framer Motion"],
            imageUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCpNQO6-9JwaXPggIP-hXRJFKc15qhn8FfVqKjn2Vb1QLEcPuNxmC5YaFjGOyTupTdts6a0KWmbGcT3i_Jq_WN11ngEwk6Q5nQ5KltO6DZ7rywW7UWj4nvczWSwpFIt4kOn-2HML-tTIiis1SME5Si6QfhCtKRFod0W_01FuwmCN29hzzEgmtWSm2U_SPfA1gqvpBs-3JDXzs_4U84SdGFh7r27nCd_x1k5PfIrfYTdLfnN8fC1sk3l_g",
            codeUrl: "#",
            demoUrl: "#",
        },
        {
            id: "proj-2",
            title: "Dark/Light Mode Hub",
            description:
                "Responsive dashboard system with adaptive theme switching, modular component library, and dynamic user configurations.",
            tags: ["Vue JS", "Tailwind CSS", "Pinia"],
            imageUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDCnmtFzmB8D_UOzXlZKGFhCKJ28-TJgv2pLigxE-iVUfltOQUbXgj5a7bHxWN3vECGCE_wGiNAXA6b57egQP7_fSE0xfCvoHxBI09J4JiycDaD9uU90S8T7VXTLYrkxfCDf1Da96qoOFxEyVGRAN4Z9aJBNNnQ_Q3N2KqK3BuZY_hygsXJTToNeZFROnLV3-9Hii_zHjl40rzTNy5TcUx1OY_fwLi1zRinJBepMVHTaJtVR5hIXfCp7Q",
            codeUrl: "#",
            demoUrl: "#",
        },
        {
            id: "proj-3",
            title: "Enterprise Portal Suite",
            description:
                "Scalable cloud platform for enterprise document verification, high-concurrency role management, and administrative workflow.",
            tags: ["React", "REST APIs", "PostgreSQL"],
            imageUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAbSzg-H6ZsEBT9vWAljM-SVYfO6cT93Vm10V59xdneEtrT9q-19oPoLZpS1LOGpkjGBg5985IksehvkTYgx1_zUXkz-ixcuvmYOrzFv1wFLy3_eL3g5pELDHy7BNqeo4zASJFBKNakT3LSckYt6l_JxoWB9k0eInu0XX8PdMPqqjgpNdk90IEgv43iOkO53VGOdTcIvrVJPVn8xnle9Z-fGBNvU3FUDvTpItU99COCaTVzP380kZXk9A",
            codeUrl: "#",
            demoUrl: "#",
        },
    ],
};