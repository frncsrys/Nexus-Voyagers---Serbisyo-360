"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard, Users, ClipboardCheck, BarChart3,
  Star, TrendingUp, TrendingDown, Download,
  Calendar, Menu, X, LogOut, Filter
} from "lucide-react";
import Sidebar from "@/components/lgu/Sidebar";

// Mock data — replace with GET /api/lgu/analytics
const MONTHLY_REVIEWS = [
  { month: "Oct", count: 8 },
  { month: "Nov", count: 14 },
  { month: "Dec", count: 11 },
  { month: "Jan", count: 19 },
  { month: "Feb", count: 22 },
  { month: "Mar", count: 24 },
];

const WORKER_PERFORMANCE = [
  { name: "Jane Doe", specialization: "Crop Production", rating: 4.9, reviews: 31, trend: "up" },
  { name: "John Smith", specialization: "Livestock", rating: 5.0, reviews: 12, trend: "up" },
  { name: "Ana Reyes", specialization: "Soil and Water", rating: 4.7, reviews: 19, trend: "up" },
  { name: "Ben Torres", specialization: "Crop Production", rating: 4.2, reviews: 6, trend: "down" },
  { name: "Rico Bautista", specialization: "Fisheries", rating: 3.8, reviews: 4, trend: "down" },
  { name: "Maria Cruz", specialization: "Fisheries", rating: 3.1, reviews: 8, trend: "down" },
];

const SPECIALIZATION_DATA = [
  { label: "Crop Production", count: 4, avgRating: 4.6 },
  { label: "Livestock", count: 2, avgRating: 4.8 },
  { label: "Fisheries", count: 3, avgRating: 3.5 },
  { label: "Soil and Water", count: 2, avgRating: 4.7 },
  { label: "Rural Development", count: 2, avgRating: 4.3 },
  { label: "Other", count: 1, avgRating: 4.0 },
];

const maxReviews = Math.max(...MONTHLY_REVIEWS.map((m) => m.count));

export default function AnalyticsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dateRange, setDateRange] = useState("6months");

  return (
    <div className="flex h-screen bg-[#f7f9f5] overflow-hidden font-body">
      <div className="hidden lg:flex flex-col w-64 shrink-0 shadow-xl">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 shadow-2xl">
            <Sidebar mobile onClose={() => setMobileOpen(false)} />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-gray-500" onClick={() => setMobileOpen(true)}>
              <Menu size={22} />
            </button>
            <div>
              <h1 className="font-display text-lg font-bold text-[#0a2e18]">Analytics & Reports</h1>
              <p className="text-xs text-gray-400">Quiapo, Manila · Overview</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Date range filter */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              {[
                { label: "30d", value: "30days" },
                { label: "3mo", value: "3months" },
                { label: "6mo", value: "6months" },
                { label: "1yr", value: "1year" },
              ].map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setDateRange(value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    dateRange === value
                      ? "bg-white text-[#0f4d2b] shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 bg-[#0f4d2b] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#1a7a45] transition-colors shadow-sm">
              <Download size={14} />Export Report
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Summary metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Reviews", value: "142", change: "+24 this month", up: true },
              { label: "Avg LGU Rating", value: "4.8★", change: "+0.2 vs last month", up: true },
              { label: "Active Workers", value: "12", change: "Same as last month", up: null },
              { label: "Community Reach", value: "138", change: "+18 unique reviewers", up: true },
            ].map(({ label, value, change, up }) => (
              <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="font-display text-3xl font-bold text-[#0a2e18] mb-1">{value}</p>
                <div className={`flex items-center gap-1 text-[11px] font-medium ${
                  up === true ? "text-green-600" : up === false ? "text-red-500" : "text-gray-400"
                }`}>
                  {up === true && <TrendingUp size={11} />}
                  {up === false && <TrendingDown size={11} />}
                  {change}
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Monthly reviews bar chart */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-base font-bold text-[#0a2e18]">Reviews per Month</h2>
                <span className="text-xs text-gray-400">Last 6 months</span>
              </div>
              <div className="flex items-end gap-3 h-36">
                {MONTHLY_REVIEWS.map(({ month, count }) => (
                  <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-[#0f4d2b]">{count}</span>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-[#0f4d2b] to-[#1a7a45] transition-all"
                      style={{ height: `${(count / maxReviews) * 100}%`, minHeight: "8px" }}
                    />
                    <span className="text-[10px] text-gray-400">{month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialization breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-display text-base font-bold text-[#0a2e18] mb-4">By Specialization</h2>
              <div className="space-y-3">
                {SPECIALIZATION_DATA.map(({ label, count, avgRating }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600">{label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400">{count} workers</span>
                        <div className="flex items-center gap-0.5">
                          <Star size={10} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-[10px] font-semibold text-[#0a2e18]">{avgRating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#0f4d2b] to-[#1a7a45] rounded-full"
                        style={{ width: `${(avgRating / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Worker performance table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-base font-bold text-[#0a2e18]">Worker Performance</h2>
              <Link href="/lgu/workers" className="text-xs text-[#0f4d2b] font-semibold hover:underline">
                View all workers
              </Link>
            </div>
            <div className="space-y-2">
              {WORKER_PERFORMANCE.map((worker, i) => (
                <div
                  key={worker.name}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#f7f9f5] transition-colors"
                >
                  <span className="text-sm font-bold text-gray-200 font-display w-5">{i + 1}</span>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0f4d2b] to-[#1a7a45] flex items-center justify-center text-white text-xs font-bold font-display shrink-0">
                    {worker.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0a2e18] truncate">{worker.name}</p>
                    <p className="text-[10px] text-gray-400">{worker.specialization}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-[#0a2e18]">{worker.rating}</span>
                  </div>
                  <span className="text-xs text-gray-400 w-16 text-right">{worker.reviews} reviews</span>
                  <div className={`flex items-center gap-1 text-xs font-semibold w-16 justify-end ${
                    worker.trend === "up" ? "text-green-600" : "text-red-500"
                  }`}>
                    {worker.trend === "up"
                      ? <TrendingUp size={13} />
                      : <TrendingDown size={13} />
                    }
                    {worker.trend === "up" ? "Good" : "Low"}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}