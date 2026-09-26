import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { portfolioData, Profile } from "@/data/portfolio";

// GET /api/profile - Fetch Profile from Database with fallback to static portfolioData
export async function GET() {
  try {
    const profile = await db.profile.findUnique({
      where: { id: "default" },
    });

    if (!profile) {
      return NextResponse.json({ profile: portfolioData.profile });
    }

    // Cast database JSON roles and socials to Profile shape
    const formattedProfile: Profile = {
      name: profile.name,
      brandName: profile.brandName,
      tagline: profile.tagline || "",
      role: profile.role,
      roles: Array.isArray(profile.roles) ? (profile.roles as string[]) : [profile.role],
      bio: profile.bio,
      aboutBio: profile.aboutBio,
      yearsExp: profile.yearsExp,
      projectsCount: profile.projectsCount,
      clientsCount: profile.clientsCount,
      isAvailable: profile.isAvailable,
      avatarUrl: profile.avatarUrl,
      aboutImageUrl: profile.aboutImageUrl || "",
      certImageUrl: profile.certImageUrl || "",
      contactImageUrl: profile.contactImageUrl || "",
      location: profile.location,
      email: profile.email,
      phone: profile.phone || "",
      socials: (profile.socials as Profile["socials"]) || {},
    };

    return NextResponse.json({ profile: formattedProfile });
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json({ profile: portfolioData.profile });
  }
}

// PUT /api/profile - Save/Upsert Profile to Database
export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized: Akses ditolak." }, { status: 401 });
    }

    const body: Profile = await req.json();

    if (!body || !body.name || !body.email) {
      return NextResponse.json({ error: "Field nama dan email wajib diisi." }, { status: 400 });
    }

    const rolesList = body.roles && body.roles.length > 0 ? body.roles : [body.role || "<Developer />"];
    const primaryRole = rolesList[0] || body.role || "<Developer />";

    const updatedProfile = await db.profile.upsert({
      where: { id: "default" },
      update: {
        name: (body.name || "").trim(),
        brandName: (body.brandName || body.name || "").trim(),
        tagline: (body.tagline || "").trim() || null,
        role: primaryRole.trim(),
        roles: rolesList,
        bio: (body.bio || "").trim(),
        aboutBio: (body.aboutBio || "").trim(),
        yearsExp: (body.yearsExp || "0").trim(),
        projectsCount: (body.projectsCount || "0").trim(),
        clientsCount: (body.clientsCount || "0").trim(),
        isAvailable: body.isAvailable ?? true,
        avatarUrl: (body.avatarUrl || "").trim(),
        aboutImageUrl: (body.aboutImageUrl || "").trim() || null,
        certImageUrl: (body.certImageUrl || "").trim() || null,
        contactImageUrl: (body.contactImageUrl || "").trim() || null,
        location: (body.location || "").trim(),
        email: (body.email || "").trim(),
        phone: (body.phone || "").trim() || null,
        socials: body.socials || {},
      },
      create: {
        id: "default",
        name: (body.name || "").trim(),
        brandName: (body.brandName || body.name || "").trim(),
        tagline: (body.tagline || "").trim() || null,
        role: primaryRole.trim(),
        roles: rolesList,
        bio: (body.bio || "").trim(),
        aboutBio: (body.aboutBio || "").trim(),
        yearsExp: (body.yearsExp || "0").trim(),
        projectsCount: (body.projectsCount || "0").trim(),
        clientsCount: (body.clientsCount || "0").trim(),
        isAvailable: body.isAvailable ?? true,
        avatarUrl: (body.avatarUrl || "").trim(),
        aboutImageUrl: (body.aboutImageUrl || "").trim() || null,
        certImageUrl: (body.certImageUrl || "").trim() || null,
        contactImageUrl: (body.contactImageUrl || "").trim() || null,
        location: (body.location || "").trim(),
        email: (body.email || "").trim(),
        phone: (body.phone || "").trim() || null,
        socials: body.socials || {},
      },
    });

    const formattedProfile: Profile = {
      name: updatedProfile.name,
      brandName: updatedProfile.brandName,
      tagline: updatedProfile.tagline || "",
      role: updatedProfile.role,
      roles: Array.isArray(updatedProfile.roles) ? (updatedProfile.roles as string[]) : [updatedProfile.role],
      bio: updatedProfile.bio,
      aboutBio: updatedProfile.aboutBio,
      yearsExp: updatedProfile.yearsExp,
      projectsCount: updatedProfile.projectsCount,
      clientsCount: updatedProfile.clientsCount,
      isAvailable: updatedProfile.isAvailable,
      avatarUrl: updatedProfile.avatarUrl,
      aboutImageUrl: updatedProfile.aboutImageUrl || "",
      certImageUrl: updatedProfile.certImageUrl || "",
      contactImageUrl: updatedProfile.contactImageUrl || "",
      location: updatedProfile.location,
      email: updatedProfile.email,
      phone: updatedProfile.phone || "",
      socials: (updatedProfile.socials as Profile["socials"]) || {},
    };

    return NextResponse.json({
      success: true,
      message: "Profil & bio berhasil disimpan ke database.",
      profile: formattedProfile,
    });
  } catch (error: any) {
    console.error("PUT /api/profile error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal menyimpan data profil ke database." },
      { status: 500 }
    );
  }
}
