import { PrismaClient } from "@prisma/client";

// ─── Prisma singleton (prevents too many connections in dev) ────────────────
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ─── Re-export Prisma types ──────────────────────────────────────────────────
export type {
  User as UserRecord,
  LGUAdmin as LGUAdminRecord,
  Worker as WorkerRecord,
  Review as ReviewRecord,
  OTPSession as OTPRecord,
} from "@prisma/client";

// ─── Users ───────────────────────────────────────────────────────────────────
export const Users = {
  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email: email.toLowerCase() } }),

  findById: (id: string) =>
    prisma.user.findUnique({ where: { id } }),

  create: (data: { email: string; passwordHash: string; role: "lgu_admin" | "worker" }) =>
    prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        role: data.role,
      },
    }),
};

// ─── LGU Admins ──────────────────────────────────────────────────────────────
export const LGUAdmins = {
  all: () => prisma.lGUAdmin.findMany(),

  findByUserId: (userId: string) =>
    prisma.lGUAdmin.findUnique({ where: { userId } }),

  findById: (id: string) =>
    prisma.lGUAdmin.findUnique({ where: { id } }),

  create: (data: {
    userId: string; lguName: string; province: string; region: string;
    adminName: string; email: string; officeContact: string; address: string;
  }) =>
    prisma.lGUAdmin.create({ data: { ...data, status: "active" } }),

  update: (id: string, data: Partial<{
    lguName: string; province: string; region: string;
    adminName: string; officeContact: string; address: string;
    status: "pending" | "active";
  }>) =>
    prisma.lGUAdmin.update({ where: { id }, data }),
};

// ─── Workers ─────────────────────────────────────────────────────────────────
export const Workers = {
  all: () => prisma.worker.findMany(),

  findByUserId: (userId: string) =>
    prisma.worker.findUnique({ where: { userId } }),

  findById: (id: string) =>
    prisma.worker.findUnique({ where: { id } }),

  findByLGU: (lguAdminId: string) =>
    prisma.worker.findMany({ where: { lguAdminId } }),

  create: (data: {
    userId: string; lguAdminId: string; fullName: string; email: string;
    phone: string; specialization: string; municipality: string;
    barangay: string; about: string;
  }) =>
    prisma.worker.create({ data: { ...data, status: "pending" } }),

  update: (id: string, data: Partial<{
    fullName: string; phone: string; specialization: string;
    municipality: string; barangay: string; about: string;
    status: "pending" | "active" | "inactive";
  }>) =>
    prisma.worker.update({ where: { id }, data }),
};

// ─── Reviews ─────────────────────────────────────────────────────────────────
export const Reviews = {
  findByWorker: (workerId: string) =>
    prisma.review.findMany({
      where: { workerId },
      orderBy: { createdAt: "desc" },
    }),

  findByPhoneAndWorker: (phoneHash: string, workerId: string) =>
    prisma.review.findUnique({
      where: { phoneHash_workerId: { phoneHash, workerId } },
    }),

  create: (data: {
    workerId: string; rating: number; comment: string;
    serviceDate: string; phoneHash: string; maskedPhone: string;
  }) =>
    prisma.review.create({ data }),

  avgRating: async (workerId: string): Promise<{ avg: number; count: number }> => {
    const result = await prisma.review.aggregate({
      where: { workerId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    return {
      avg: result._avg.rating ? Math.round(result._avg.rating * 10) / 10 : 0,
      count: result._count.rating,
    };
  },
};

// ─── OTP Sessions ─────────────────────────────────────────────────────────────
export const OTPSessions = {
  findActive: (workerId: string, phoneHash: string) =>
    prisma.oTPSession.findFirst({
      where: {
        workerId,
        phoneHash,
        used: false,
        otpExpiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    }),

  findLatestByWorkerAndPhone: (workerId: string, phoneHash: string) =>
    prisma.oTPSession.findFirst({
      where: { workerId, phoneHash },
      orderBy: { createdAt: "desc" },
    }),

  create: (data: {
    workerId: string; phone: string; phoneHash: string; code: string;
    reviewRating: number; reviewComment: string; reviewServiceDate: string;
    sessionExpiresAt: Date; otpExpiresAt: Date;
  }) =>
    prisma.oTPSession.create({ data }),

  markUsed: (id: string) =>
    prisma.oTPSession.update({ where: { id }, data: { used: true } }),
};
