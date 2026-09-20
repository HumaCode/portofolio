import { db } from "../lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const adminEmail = "admin@portfolio.com";
  const defaultPassword = "adminpassword123";

  // Check if admin already exists
  const existingAdmin = await db.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    const admin = await db.user.create({
      data: {
        email: adminEmail,
        name: "Super Admin",
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log("✅ Initial Admin user created successfully:");
    console.log("Email:", admin.email);
    console.log("Password:", defaultPassword);
  } else {
    console.log("ℹ️ Admin user already exists:", existingAdmin.email);
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
