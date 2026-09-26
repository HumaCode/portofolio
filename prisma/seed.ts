import { db } from "../lib/db";
import bcrypt from "bcryptjs";
import { ulid } from "ulid";
import { portfolioData } from "../data/portfolio";

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Seed Admin User
  const adminEmail = "admin@portfolio.com";
  const defaultPassword = "adminpassword123";

  const existingAdmin = await db.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    await db.user.create({
      data: {
        id: ulid(),
        email: adminEmail,
        name: "Super Admin",
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log("✅ Admin user seeded");
  } else {
    console.log("ℹ️ Admin user already exists");
  }

  // 2. Seed Categories & Projects
  for (const proj of portfolioData.projects) {
    const categoryName = proj.category || "Uncategorized";
    const categorySlug = categoryName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Find or create category
    let category = await db.projectCategory.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      category = await db.projectCategory.create({
        data: {
          id: ulid(),
          name: categoryName,
          slug: categorySlug,
          description: `Category for ${categoryName}`,
        },
      });
    }

    // Check project existing by title
    const existingProj = await db.project.findFirst({
      where: { title: proj.title },
    });

    if (!existingProj) {
      await db.project.create({
        data: {
          id: ulid(),
          title: proj.title,
          description: proj.description,
          tags: proj.tags,
          imageUrl: proj.imageUrl,
          codeUrl: proj.codeUrl || null,
          demoUrl: proj.demoUrl || null,
          isFeatured: proj.isFeatured ?? false,
          isInternal: proj.isInternal ?? false,
          categoryId: category.id,
        },
      });
    }
  }
  console.log("✅ Projects & Categories seeded");

  // 3. Seed Skills
  for (const skill of portfolioData.skillsGauges) {
    const existingSkill = await db.skill.findFirst({
      where: { name: skill.name },
    });

    if (!existingSkill) {
      await db.skill.create({
        data: {
          id: ulid(),
          name: skill.name,
          percentage: skill.percentage,
          category: skill.category || "General",
          color: skill.color,
          strokeColor: skill.strokeColor,
        },
      });
    }
  }
  console.log("✅ Skills seeded");

  // 4. Seed Certificates
  for (const cert of portfolioData.certificates) {
    const existingCert = await db.certificate.findFirst({
      where: { title: cert.title },
    });

    if (!existingCert) {
      await db.certificate.create({
        data: {
          id: ulid(),
          title: cert.title,
          issuer: cert.issuer,
          year: cert.year,
          verifyUrl: cert.verifyUrl || null,
          isVerified: cert.isVerified ?? true,
        },
      });
    }
  }
  console.log("✅ Certificates seeded");

  // 5. Seed Inbox Messages
  for (const msg of portfolioData.inboxMessages) {
    const existingMsg = await db.inboxMessage.findFirst({
      where: { email: msg.email, subject: msg.subject },
    });

    if (!existingMsg) {
      await db.inboxMessage.create({
        data: {
          id: ulid(),
          senderName: msg.senderName,
          senderCompany: msg.senderCompany || null,
          email: msg.email,
          subject: msg.subject,
          message: msg.message,
          timeAgo: msg.timeAgo,
          isRead: msg.isRead,
          initials: msg.initials,
          accentColor: msg.accentColor || "crimson",
        },
      });
    }
  }
  console.log("✅ Inbox Messages seeded");

  // 6. Seed Default Profile
  const existingProfile = await db.profile.findUnique({
    where: { id: "default" },
  });

  if (!existingProfile) {
    const p = portfolioData.profile;
    await db.profile.create({
      data: {
        id: "default",
        name: p.name,
        brandName: p.brandName,
        tagline: p.tagline || null,
        role: p.role,
        roles: p.roles || [p.role],
        bio: p.bio,
        aboutBio: p.aboutBio,
        yearsExp: p.yearsExp,
        projectsCount: p.projectsCount,
        clientsCount: p.clientsCount,
        isAvailable: p.isAvailable ?? true,
        avatarUrl: p.avatarUrl,
        aboutImageUrl: p.aboutImageUrl || null,
        certImageUrl: p.certImageUrl || null,
        contactImageUrl: p.contactImageUrl || null,
        location: p.location,
        email: p.email,
        phone: p.phone || null,
        socials: p.socials || {},
      },
    });
    console.log("✅ Profile seeded");
  }

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
