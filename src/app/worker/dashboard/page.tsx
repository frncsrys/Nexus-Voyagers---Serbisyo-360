"use client";

import { logout } from "@/lib/logout";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star, QrCode, MapPin, Calendar, Phone,
  Mail, CheckCircle2, Clock, Edit2,
  LogOut, Menu, X, Shield, TrendingUp
} from "lucide-react";

// TODO: replace with real session + API call GET /api/workers/me
const MOCK_WORKER = {
  id: "worker-001",
  fullName: "Jane Doe",
  specialization: "Crop Production",
  municipality: "Quiapo",
  barangay: "Barangay 176",
  province: "Metro Manila",
  phone: "+63 912 345 6789",
  email: "jane.doe@email.com",
  status: "verified" as "verified" | "pending" | "inactive",
  rating: 4.7,
  totalReviews: 24,
  joinedAt: "March 19, 2026",
  lguName: "City of Manila",
  ratingBreakdown: [
    { stars: 5, count: 16 },
    { stars: 4, count: 5 },
    { stars: 3, count: 2 },
    { stars: 2, count: 0 },
    { stars: 1, count: 1 },
  ],
  recentReviews: [
    { id: "r1", rating: 5, comment: "Very helpful and knowledgeable!", serviceDate: "Mar 15, 2026" },
    { id: "r2", rating: 5, comment: "Excellent advice on irrigation methods.", serviceDate: "Mar 10, 2026" },
    { id: "r3", rating: 4, comment: "Good service, very professional.", serviceDate: "Mar 5, 2026" },
  ],
};

const logoHref = "/worker/dashboard"; // TODO: replace with auth-aware redirect

export default function WorkerDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const worker = MOCK_WORKER;
  const initials = worker.fullName.split(" ").map((n) => n[0]).join("").toUpperCase();

  const statusConfig = {
    verified: { label: "LGU Verified", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
    pending: { label: "Pending Verification", color: "bg-amber-100 text-amber-700", icon: Clock },
    inactive: { label: "Inactive", color: "bg-gray-100 text-gray-500", icon: Clock },
  };
  const status = statusConfig[worker.status];

  return (
    <div className="min-h-screen bg-[#f7f9f5] font-body">
      {/* Top nav */}
      <header className="bg-[#0a2e18] text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <Link href={logoHref} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <Image src="/serbisyo360-logo.png" alt="Serbisyo360" width={36} height={36} />
          <span className="font-display font-bold text-base">
            Serbisyo<span className="text-[#a8e6bf]">360</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/worker/dashboard" className="text-white text-sm font-medium border-b-2 border-[#a8e6bf] pb-0.5">
            Dashboard
          </Link>
          <Link href="/worker/qr-code" className="text-white/60 hover:text-white text-sm font-medium transition-colors">
            My QR Code
          </Link>
        </div>

        <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1a7a45] flex items-center justify-center text-white font-display font-bold text-sm">
                {initials}
            </div>
            <button className="md:hidden text-white/60 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <button
                onClick={logout}
                className="hidden md:flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs transition-colors"
                >
                <LogOut size={14} />Log out
            </button>
        </div>
      </header>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="bg-[#0f4d2b] border-t border-white/10 px-6 py-4 flex flex-col gap-3 md:hidden animate-fade-in">
            <Link href="/worker/dashboard" className="text-white text-sm font-medium">Dashboard</Link>
            <Link href="/worker/qr-code" className="text-white/60 text-sm font-medium">My QR Code</Link>
            <button
                onClick={logout}
                className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mt-1 transition-colors"
                >
                <LogOut size={14} />Log out
            </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-up">
          <div className="bg-[#0f4d2b] h-24 relative">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }} />
          </div>
          <div className="px-6 pb-6 -mt-10 relative">
            <div className="flex items-end justify-between mb-3">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0f4d2b] to-[#1a7a45] flex items-center justify-center text-white font-display font-bold text-2xl shadow-lg border-4 border-white">
                {initials}
              </div>
                <Link
                href="/worker/edit-profile"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#0f4d2b] border border-[#0f4d2b]/20 px-3 py-1.5 rounded-xl hover:bg-[#f0faf4] transition-colors mb-1"
                >
                <Edit2 size={12} />Edit Profile
                </Link>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-display text-2xl font-bold text-[#0a2e18]">{worker.fullName}</h1>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${status.color}`}>
                <status.icon size={11} />{status.label}
              </span>
            </div>
            <p className="text-sm font-semibold text-[#1a7a45] mb-4">{worker.specialization}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1.5"><MapPin size={12} className="text-[#1a7a45]" />{worker.municipality}, {worker.province}</div>
              <div className="flex items-center gap-1.5"><Calendar size={12} className="text-[#1a7a45]" />Joined {worker.joinedAt}</div>
              <div className="flex items-center gap-1.5"><Phone size={12} className="text-[#1a7a45]" />{worker.phone}</div>
              <div className="flex items-center gap-1.5"><Mail size={12} className="text-[#1a7a45]" />{worker.email}</div>
            </div>
          </div>
        </div>

        {/* QR Code CTA */}
        {worker.status === "verified" ? (
          <Link
            href="/worker/qr-code"
            className="block bg-[#0f4d2b] rounded-2xl p-5 hover:bg-[#1a7a45] transition-colors shadow-lg shadow-[#0f4d2b]/20 animate-fade-up delay-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                  <QrCode size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-display font-bold text-white text-base">View & Download My QR Code</p>
                  <p className="text-white/60 text-xs mt-0.5">Show this to community members after your field service</p>
                </div>
              </div>
              <div className="text-white/40 text-xs font-semibold hidden md:block">Tap to open →</div>
            </div>
          </Link>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 animate-fade-up delay-1">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-amber-500 shrink-0" />
              <div>
                <p className="font-semibold text-amber-800 text-sm">QR Code Not Yet Available</p>
                <p className="text-amber-600 text-xs mt-0.5">Your QR code will be issued once your LGU administrator approves your profile.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">

          {/* Rating section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-fade-up delay-2">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-[#0f4d2b]" />
              <h2 className="font-display text-base font-bold text-[#0a2e18]">My Rating</h2>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <p className="font-display text-4xl font-bold text-[#0f4d2b]">{worker.rating}</p>
                <div className="flex gap-0.5 my-1 justify-center">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={12} className={s <= Math.round(worker.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} />
                  ))}
                </div>
                <p className="text-[10px] text-gray-400">{worker.totalReviews} reviews</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {worker.ratingBreakdown.map(({ stars, count }) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 w-3">{stars}</span>
                    <Star size={9} className="fill-yellow-400 text-yellow-400 shrink-0" />
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all"
                        style={{ width: worker.totalReviews > 0 ? `${(count / worker.totalReviews) * 100}%` : "0%" }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 w-4">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-[#f0faf4] border border-[#0f4d2b]/15 rounded-xl p-3">
              <Shield size={12} className="text-[#0f4d2b] shrink-0" />
              <p className="text-[11px] text-[#3d6b4f]">All reviews are OTP-verified and spam-free</p>
            </div>
          </div>

          {/* Recent reviews */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-fade-up delay-3">
            <h2 className="font-display text-base font-bold text-[#0a2e18] mb-4">Recent Reviews</h2>
            <div className="space-y-4">
              {worker.recentReviews.map((review) => (
                <div key={review.id} className="border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={12} className={s <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400">{review.serviceDate}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}