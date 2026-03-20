export type UserRole = "lgu_admin" | "worker" | "public";

export type WorkerStatus = "pending" | "verified" | "rejected";

export interface Worker {
  id: string;
  fullName: string;
  specialization: string;
  location: string;
  municipality: string;
  status: WorkerStatus;
  rating: number;
  totalReviews: number;
  activeAssignments: number;
  qrCode?: string;
  avatarUrl?: string;
  joinedAt: string;
}

export interface Review {
  id: string;
  workerId: string;
  rating: number;
  comment: string;
  reviewerPhone: string;
  createdAt: string;
}

export interface LGUAdmin {
  id: string;
  fullName: string;
  email: string;
  office: string;
  municipality: string;
}

export interface OTPSession {
  phone: string;
  workerId: string;
  expiresAt: string;
  verified: boolean;
}

export interface DashboardStats {
  registeredWorkers: number;
  activeWorkers: number;
  averageRating: number;
  pendingApprovals: number;
}