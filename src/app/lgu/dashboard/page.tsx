"use client";

import Sidebar from "@/components/lgu/Sidebar";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard, Users, ClipboardCheck, BarChart3,
  Bell, Search, Star, MapPin, TrendingUp, TrendingDown,
  CheckCircle2, Clock, XCircle, ChevronRight, LogOut,
  Menu, X, Download, Filter
} from "lucide-react";

// Mock data — replace with API calls
const STATS = {
  registeredWorkers: 18,
  activeWorkers: 12,
  pendingApprovals: 3,
  averageRating: 4.8,
};

const AREAS = [
  { name: "Quiapo", workers: 4, rating: 4.9 },
  { name: "Tondo", workers: 3, rating: 4.6 },
  { name: "Binondo", workers: 2, rating: 4.8 },
  { name: "Malate", workers: 2, rating: 4.5 },
  { name: "Ermita", workers: 1, rating: 5.0 },
];

const COMMUNITY_METRICS = {
  totalReviews: 142,
  uniqueReviewers: 138,
  reviewsThisMonth: 24,
  mostReviewed: { name: "Jane Doe", rating: 4.9, reviews: 31 },
  highestRated: { name: "John Smith", rating: 5.0, reviews: 12 },
  lowestRated: { name: "Maria Cruz", rating: 3.1, reviews: 8 },
};

const RECENT_ACTIVITY = [
  { reviewer: "Community member", worker: "Jane Doe", area: "Quiapo", time: "2 min ago" },
  { reviewer: "Community member", worker: "John Smith", area: "Tondo", time: "15 min ago" },
  { reviewer: "Community member", worker: "Ana Reyes", area: "Binondo", time: "1 hr ago" },
  { reviewer: "Community member", worker: "Carlo Santos", area: "Malate", time: "2 hr ago" },
  { reviewer: "Community member", worker: "Jane Doe", area: "Quiapo", time: "3 hr ago" },
];

const WORKER_STATUS = { active: 12, pending: 3, inactive: 3 };

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/lgu/dashboard", active: true },
  { icon: BarChart3, label: "Analytics & Reports", href: "/lgu/analytics", active: false },
  { icon: Users, label: "Manage Workers", href: "/lgu/workers", active: false },
  { icon: ClipboardCheck, label: "Pending Approvals", href: "/lgu/approvals", active: false, badge: 3 },
];

export default function AdminDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f7f9f5] overflow-hidden font-body">

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-64 shrink-0 shadow-xl">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 shadow-2xl">
            <Sidebar mobile onClose={() => setMobileOpen(false)} />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-gray-500 hover:text-[#0f4d2b]"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="font-display text-lg font-bold text-[#0a2e18]">Dashboard</h1>
              <p className="text-xs text-gray-400">Quiapo, Manila · Friday, March 20, 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/lgu/approvals"
              className="relative p-2 text-gray-500 hover:text-[#0f4d2b] hover:bg-[#f0faf4] rounded-xl transition-colors"
            >
              <Bell size={20} />
              {STATS.pendingApprovals > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {STATS.pendingApprovals}
                </span>
              )}
            </Link>
            <div className="w-9 h-9 rounded-xl bg-[#0f4d2b] flex items-center justify-center text-white font-display font-bold text-sm">
              FC
            </div>
          </div>
        </header>

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Registered Workers",
                value: STATS.registeredWorkers,
                icon: Users,
                color: "bg-blue-50 text-blue-600",
                trend: null,
              },
              {
                label: "Active Workers",
                value: STATS.activeWorkers,
                icon: CheckCircle2,
                color: "bg-green-50 text-green-600",
                trend: null,
              },
              {
                label: "Pending Approvals",
                value: STATS.pendingApprovals,
                icon: Clock,
                color: "bg-amber-50 text-amber-600",
                trend: null,
                link: "/lgu/approvals",
              },
              {
                label: "Average LGU Rating",
                value: STATS.averageRating,
                icon: Star,
                color: "bg-yellow-50 text-yellow-600",
                trend: null,
                suffix: "★",
              },
            ].map(({ label, value, icon: Icon, color, link, suffix }) => (
              <div
                key={label}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon size={18} />
                  </div>
                  {link && (
                    <Link href={link} className="text-[10px] text-[#0f4d2b] font-semibold hover:underline flex items-center gap-0.5">
                      View <ChevronRight size={10} />
                    </Link>
                  )}
                </div>
                <p className="font-display text-3xl font-bold text-[#0a2e18]">
                  {value}{suffix}
                </p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Middle row */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Areas Covered */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-base font-bold text-[#0a2e18]">Areas Covered</h2>
                <span className="text-xs text-gray-400">{AREAS.length} areas</span>
              </div>
              <div className="space-y-3">
                {AREAS.map((area) => (
                  <div key={area.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#1a7a45]" />
                      <span className="text-sm font-medium text-[#0a2e18]">{area.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">{area.workers} workers</span>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full">
                        <Star size={10} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-semibold text-yellow-700">{area.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Reach */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-display text-base font-bold text-[#0a2e18] mb-4">Community Reach</h2>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Total Reviews", value: COMMUNITY_METRICS.totalReviews },
                  { label: "Unique Reviewers", value: COMMUNITY_METRICS.uniqueReviewers },
                  { label: "This Month", value: COMMUNITY_METRICS.reviewsThisMonth },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#f7f9f5] rounded-xl p-3 text-center">
                    <p className="font-display text-xl font-bold text-[#0f4d2b]">{value}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {[
                  { label: "Most Reviewed", data: COMMUNITY_METRICS.mostReviewed, icon: TrendingUp, color: "text-blue-600 bg-blue-50" },
                  { label: "Highest Rated", data: COMMUNITY_METRICS.highestRated, icon: TrendingUp, color: "text-green-600 bg-green-50" },
                  { label: "Lowest Rated", data: COMMUNITY_METRICS.lowestRated, icon: TrendingDown, color: "text-red-500 bg-red-50" },
                ].map(({ label, data, icon: Icon, color }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${color}`}>
                        <Icon size={12} />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">{label}</p>
                        <p className="text-xs font-semibold text-[#0a2e18]">{data.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={11} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-[#0a2e18]">{data.rating}</span>
                      <span className="text-[10px] text-gray-400">({data.reviews})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-base font-bold text-[#0a2e18]">Recent Activity</h2>
                <span className="text-xs text-gray-400">Last 5 reviews</span>
              </div>
              <div className="space-y-3">
                {RECENT_ACTIVITY.map((item, i) => (
                  <Link
                    key={i}
                    href="/lgu/workers"
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#f7f9f5] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#d4edda] flex items-center justify-center shrink-0">
                        <Star size={13} className="fill-[#0f4d2b] text-[#0f4d2b]" />
                      </div>
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold text-[#0a2e18]">{item.reviewer}</span> submitted a review for{" "}
                        <span className="font-semibold text-[#0f4d2b]">{item.worker}</span> in {item.area}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[10px] text-gray-400">{item.time}</span>
                      <ChevronRight size={13} className="text-gray-300 group-hover:text-[#0f4d2b] transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Worker Status Breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-base font-bold text-[#0a2e18]">Worker Status</h2>
                <Link href="/lgu/workers" className="text-[10px] text-[#0f4d2b] font-semibold hover:underline">
                  View all
                </Link>
              </div>

              <div className="space-y-3 mb-5">
                {[
                  { label: "Active", count: WORKER_STATUS.active, color: "bg-green-500", bg: "bg-green-50 text-green-700", filter: "active" },
                  { label: "Pending", count: WORKER_STATUS.pending, color: "bg-amber-400", bg: "bg-amber-50 text-amber-700", filter: "pending" },
                  { label: "Inactive", count: WORKER_STATUS.inactive, color: "bg-gray-300", bg: "bg-gray-50 text-gray-600", filter: "inactive" },
                ].map(({ label, count, color, bg, filter }) => (
                  <Link
                    key={label}
                    href={`/lgu/workers?status=${filter}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f7f9f5] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                      <span className="text-sm text-gray-600">{label}</span>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${bg}`}>{count}</span>
                  </Link>
                ))}
              </div>

              {/* Visual bar */}
              <div className="h-2.5 rounded-full overflow-hidden flex gap-0.5">
                <div className="bg-green-500 rounded-l-full" style={{ width: `${(WORKER_STATUS.active / 18) * 100}%` }} />
                <div className="bg-amber-400" style={{ width: `${(WORKER_STATUS.pending / 18) * 100}%` }} />
                <div className="bg-gray-200 rounded-r-full" style={{ width: `${(WORKER_STATUS.inactive / 18) * 100}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
                <span>0</span>
                <span>18 total</span>
              </div>

              {/* Export button */}
              <button className="mt-4 w-full flex items-center justify-center gap-2 border border-[#0f4d2b]/20 text-[#0f4d2b] text-xs font-semibold py-2.5 rounded-xl hover:bg-[#f0faf4] transition-colors">
                <Download size={13} />
                Export Worker Data
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}