/**
 * Prisma seed script
 * Run: npx prisma db seed
 * Or:  node --loader ts-node/esm prisma/seed.ts
 */

import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.pbkdf2(password, salt, 100000, 64, "sha256", (err, key) => {
      if (err) reject(err);
      else resolve(`${salt}:${key.toString("hex")}`);
    });
  });
}

function hashPhone(phone: string): string {
  return crypto.createHash("sha256").update(phone.replace(/\s/g, "")).digest("hex");
}

function maskPhone(phone: string): string {
  const clean = phone.replace(/\s/g, "");
  const match = clean.match(/^(\+63|0)(\d{3})(\d{3,4})(\d{3,4})$/);
  if (!match) return phone.slice(0, 4) + "****" + phone.slice(-3);
  return `${match[1]} ${match[2]} **** ${match[4]}`;
}

async function main() {
  console.log("\n🌱 Seeding Serbisyo360...\n");

  // Clean existing data
  await prisma.oTPSession.deleteMany();
  await prisma.review.deleteMany();
  await prisma.worker.deleteMany();
  await prisma.lGUAdmin.deleteMany();
  await prisma.user.deleteMany();

  const adminPw  = await hashPassword("Admin@123");
  const workerPw = await hashPassword("Worker@123");

  // ── LGU Admin ──────────────────────────────────────────────────────────────
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@manila.gov.ph",
      passwordHash: adminPw,
      role: "lgu_admin",
      lguAdmin: {
        create: {
          lguName: "City of Manila",
          province: "Metro Manila",
          region: "NCR",
          adminName: "Francis Carabasa",
          email: "admin@manila.gov.ph",
          officeContact: "+63 2 8527 0111",
          address: "City Hall, Padre Burgos Ave, Manila",
          status: "active",
        },
      },
    },
    include: { lguAdmin: true },
  });

  const lguAdminId = adminUser.lguAdmin!.id;
  console.log("✅ LGU Admin created");

  // ── Workers ────────────────────────────────────────────────────────────────
  const workersData = [
    { email: "jane.doe@email.com",    fullName: "Jane Doe",    phone: "+639123456789", specialization: "Crop Production",   municipality: "Quiapo",  barangay: "Barangay 176", about: "Agricultural extension worker specializing in crop production techniques.", status: "active"  as const },
    { email: "john.smith@email.com",  fullName: "John Smith",  phone: "+639171234567", specialization: "Livestock",         municipality: "Tondo",   barangay: "Barangay 105", about: "Livestock specialist with 5 years of extension work.", status: "active"  as const },
    { email: "maria.cruz@email.com",  fullName: "Maria Cruz",  phone: "+639209876543", specialization: "Fisheries",         municipality: "Binondo", barangay: "Barangay 289", about: "Fisheries extension worker focused on sustainable aquaculture.", status: "active"  as const },
    { email: "carlo.santos@email.com",fullName: "Carlo Santos",phone: "+639123456790", specialization: "Rural Development", municipality: "Malate",  barangay: "Barangay 701", about: "", status: "pending" as const },
  ];

  const createdWorkers = [];
  for (const w of workersData) {
    const user = await prisma.user.create({
      data: {
        email: w.email,
        passwordHash: workerPw,
        role: "worker",
        worker: {
          create: {
            lguAdminId,
            fullName: w.fullName, email: w.email, phone: w.phone,
            specialization: w.specialization, municipality: w.municipality,
            barangay: w.barangay, about: w.about, status: w.status,
          },
        },
      },
      include: { worker: true },
    });
    createdWorkers.push(user.worker!);
  }
  console.log("✅ Workers created");

  // ── Reviews ────────────────────────────────────────────────────────────────
  const [jane, john, maria] = createdWorkers;

  const reviewsData = [
    { worker: jane,  phone: "+639111111111", rating: 5, comment: "Very helpful and knowledgeable about crop techniques. Highly recommended!", serviceDate: "2026-03-15" },
    { worker: jane,  phone: "+639222222222", rating: 5, comment: "Excellent advice on irrigation methods. Came on time and was very professional.", serviceDate: "2026-03-10" },
    { worker: jane,  phone: "+639333333333", rating: 4, comment: "Good service overall. Could explain things more clearly but very helpful.", serviceDate: "2026-03-05" },
    { worker: jane,  phone: "+639444444444", rating: 5, comment: "Outstanding work! My harvest improved significantly after following her advice.", serviceDate: "2026-02-28" },
    { worker: jane,  phone: "+639555555555", rating: 5, comment: "She was patient and very thorough. Answered all my questions clearly.", serviceDate: "2026-02-20" },
    { worker: john,  phone: "+639666666666", rating: 5, comment: "John helped me solve my goat's health issue. Very professional and knowledgeable.", serviceDate: "2026-03-12" },
    { worker: john,  phone: "+639777777777", rating: 5, comment: "Best livestock officer I've ever worked with. Saved my entire poultry.", serviceDate: "2026-03-08" },
    { worker: john,  phone: "+639888888888", rating: 4, comment: "Very responsive and helpful. Gave good practical advice.", serviceDate: "2026-02-25" },
    { worker: maria, phone: "+639991111111", rating: 3, comment: "She was helpful but arrived late. The advice was useful though.", serviceDate: "2026-03-14" },
    { worker: maria, phone: "+639992222222", rating: 4, comment: "Good knowledge on fish pond management. Will recommend to neighbors.", serviceDate: "2026-03-09" },
    { worker: maria, phone: "+639993333333", rating: 2, comment: "Needed more follow-up but she only visited once.", serviceDate: "2026-03-01" },
  ];

  for (const r of reviewsData) {
    await prisma.review.create({
      data: {
        workerId: r.worker.id,
        rating: r.rating,
        comment: r.comment,
        serviceDate: r.serviceDate,
        phoneHash: hashPhone(r.phone),
        maskedPhone: maskPhone(r.phone),
      },
    });
  }
  console.log("✅ Reviews created");

  console.log("\n🎉 Seed complete!\n");
  console.log("  LGU Admin:  admin@manila.gov.ph   / Admin@123");
  console.log("  Worker:     jane.doe@email.com    / Worker@123");
  console.log("  Worker:     john.smith@email.com  / Worker@123");
  console.log("  Worker:     maria.cruz@email.com  / Worker@123");
  console.log("  Worker:     carlo.santos@email.com/ Worker@123 (pending)\n");
  console.log(`  Jane's public profile: /worker/${jane.id}\n`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
