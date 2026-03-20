/**
 * Seed script — run once via: node scripts/seed.mjs
 * Creates demo LGU admin, workers, and sample reviews.
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "../data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function write(name, data) {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, `${name}.json`), JSON.stringify(data, null, 2));
  console.log(`✅ Written ${data.length} record(s) to ${name}.json`);
}

function uuid() {
  return crypto.randomUUID();
}

async function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.pbkdf2(password, salt, 100000, 64, "sha256", (err, key) => {
      if (err) reject(err);
      else resolve(`${salt}:${key.toString("hex")}`);
    });
  });
}

function hashPhone(phone) {
  return crypto.createHash("sha256").update(phone.replace(/\s/g, "")).digest("hex");
}

function maskPhone(phone) {
  const clean = phone.replace(/\s/g, "");
  const match = clean.match(/^(\+63|0)(\d{3})(\d{3,4})(\d{3,4})$/);
  if (!match) return phone.slice(0, 4) + "****" + phone.slice(-3);
  return `${match[1]} ${match[2]} **** ${match[4]}`;
}

async function seed() {
  console.log("\n🌱 Seeding Serbisyo360 demo data...\n");

  // ── Users ──────────────────────────────────────────────────────────────────
  const adminPw = await hashPassword("Admin@123");
  const workerPw = await hashPassword("Worker@123");

  const lguUserId = uuid();
  const w1UserId = uuid();
  const w2UserId = uuid();
  const w3UserId = uuid();
  const w4UserId = uuid();

  const users = [
    { id: lguUserId, email: "admin@manila.gov.ph", passwordHash: adminPw, role: "lgu_admin", createdAt: "2026-01-01T00:00:00.000Z" },
    { id: w1UserId,  email: "jane.doe@email.com",   passwordHash: workerPw, role: "worker", createdAt: "2026-01-12T08:00:00.000Z" },
    { id: w2UserId,  email: "john.smith@email.com",  passwordHash: workerPw, role: "worker", createdAt: "2026-02-03T08:00:00.000Z" },
    { id: w3UserId,  email: "maria.cruz@email.com",  passwordHash: workerPw, role: "worker", createdAt: "2026-02-20T08:00:00.000Z" },
    { id: w4UserId,  email: "carlo.santos@email.com",passwordHash: workerPw, role: "worker", createdAt: "2026-03-10T08:00:00.000Z" },
  ];
  write("users", users);

  // ── LGU Admin ──────────────────────────────────────────────────────────────
  const lguAdminId = uuid();
  const lguAdmins = [
    {
      id: lguAdminId, userId: lguUserId,
      lguName: "City of Manila", province: "Metro Manila", region: "NCR",
      adminName: "Francis Carabasa", email: "admin@manila.gov.ph",
      officeContact: "+63 2 8527 0111", address: "City Hall, Padre Burgos Ave, Manila",
      status: "active", createdAt: "2026-01-01T00:00:00.000Z",
    }
  ];
  write("lgu_admins", lguAdmins);

  // ── Workers ────────────────────────────────────────────────────────────────
  const w1Id = uuid();
  const w2Id = uuid();
  const w3Id = uuid();
  const w4Id = uuid();

  const workers = [
    { id: w1Id, userId: w1UserId, lguAdminId, fullName: "Jane Doe",      email: "jane.doe@email.com",    phone: "+639123456789", specialization: "Crop Production",  municipality: "Quiapo",  barangay: "Barangay 176", about: "Agricultural extension worker specializing in crop production techniques.", status: "active",   createdAt: "2026-01-12T08:00:00.000Z" },
    { id: w2Id, userId: w2UserId, lguAdminId, fullName: "John Smith",     email: "john.smith@email.com",  phone: "+639171234567", specialization: "Livestock",        municipality: "Tondo",   barangay: "Barangay 105", about: "Livestock specialist with 5 years of extension work.", status: "active",   createdAt: "2026-02-03T08:00:00.000Z" },
    { id: w3Id, userId: w3UserId, lguAdminId, fullName: "Maria Cruz",     email: "maria.cruz@email.com",  phone: "+639209876543", specialization: "Fisheries",        municipality: "Binondo", barangay: "Barangay 289", about: "Fisheries extension worker focused on sustainable aquaculture.", status: "active",   createdAt: "2026-02-20T08:00:00.000Z" },
    { id: w4Id, userId: w4UserId, lguAdminId, fullName: "Carlo Santos",   email: "carlo.santos@email.com",phone: "+639123456790", specialization: "Rural Development",municipality: "Malate",  barangay: "Barangay 701", about: "",         status: "pending",  createdAt: "2026-03-10T08:00:00.000Z" },
  ];
  write("workers", workers);

  // ── Reviews ────────────────────────────────────────────────────────────────
  const reviewsData = [
    // Jane Doe — Crop Production (w1Id)
    { workerId: w1Id, phone: "+639111111111", rating: 5, comment: "Very helpful and knowledgeable about crop techniques. Highly recommended!", serviceDate: "2026-03-15" },
    { workerId: w1Id, phone: "+639222222222", rating: 5, comment: "Excellent advice on irrigation methods. Came on time and was very professional.", serviceDate: "2026-03-10" },
    { workerId: w1Id, phone: "+639333333333", rating: 4, comment: "Good service overall. Could explain things more clearly but very helpful.", serviceDate: "2026-03-05" },
    { workerId: w1Id, phone: "+639444444444", rating: 5, comment: "Outstanding work! My harvest improved significantly after following her advice.", serviceDate: "2026-02-28" },
    { workerId: w1Id, phone: "+639555555555", rating: 5, comment: "She was patient and very thorough. Answered all my questions clearly.", serviceDate: "2026-02-20" },
    // John Smith — Livestock (w2Id)
    { workerId: w2Id, phone: "+639666666666", rating: 5, comment: "John helped me solve my goat's health issue. Very professional and knowledgeable.", serviceDate: "2026-03-12" },
    { workerId: w2Id, phone: "+639777777777", rating: 5, comment: "Best livestock officer I've ever worked with. Saved my entire poultry.", serviceDate: "2026-03-08" },
    { workerId: w2Id, phone: "+639888888888", rating: 4, comment: "Very responsive and helpful. Gave good practical advice.", serviceDate: "2026-02-25" },
    // Maria Cruz — Fisheries (w3Id)
    { workerId: w3Id, phone: "+639991111111", rating: 3, comment: "She was helpful but arrived late. The advice was useful though.", serviceDate: "2026-03-14" },
    { workerId: w3Id, phone: "+639992222222", rating: 4, comment: "Good knowledge on fish pond management. Will recommend to neighbors.", serviceDate: "2026-03-09" },
    { workerId: w3Id, phone: "+639993333333", rating: 2, comment: "Needed more follow-up but she only visited once.", serviceDate: "2026-03-01" },
  ];

  const reviews = reviewsData.map((r, i) => ({
    id: uuid(),
    workerId: r.workerId,
    rating: r.rating,
    comment: r.comment,
    serviceDate: r.serviceDate,
    phoneHash: hashPhone(r.phone),
    maskedPhone: maskPhone(r.phone),
    createdAt: new Date(Date.now() - (reviewsData.length - i) * 60 * 60 * 1000 * 24).toISOString(),
  }));
  write("reviews", reviews);

  // ── Empty OTP sessions ─────────────────────────────────────────────────────
  write("otp_sessions", []);

  console.log("\n🎉 Seed complete! Demo credentials:\n");
  console.log("  LGU Admin:  admin@manila.gov.ph  /  Admin@123");
  console.log("  Workers:    jane.doe@email.com   /  Worker@123");
  console.log("              john.smith@email.com  /  Worker@123");
  console.log("              maria.cruz@email.com  /  Worker@123");
  console.log("              carlo.santos@email.com/ Worker@123 (pending)\n");
  console.log(`  Worker public profile (Jane): /worker/${w1Id}\n`);
}

seed().catch(console.error);
