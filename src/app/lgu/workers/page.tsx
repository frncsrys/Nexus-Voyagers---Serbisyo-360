"use client";

import Sidebar from "@/components/lgu/Sidebar";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  LayoutDashboard, Users, ClipboardCheck, BarChart3,
  Search, Star, MapPin, ChevronRight, LogOut,
  Menu, X, CheckCircle2, Clock, XCircle as XIcon,
  Filter, Download, Eye
} from "lucide-react";

const MOCK_WORKERS = [
  { id: "w-001", fullName: "Jane Doe", specialization: "Crop Production", municipality: "Quiapo", barangay: "Barangay 176", status: "active", rating: 4.9, totalReviews: 31, joinedAt: "Jan 12, 2026" },
  { id: "w-002", fullName: "John Smith", specialization: "Livestock", municipality: "Tondo", barangay: "Barangay 105", status: "active", rating: 5.0, totalReviews: 12, joinedAt: "Feb 3, 2026" },
  { id: "w-003", fullName: "Maria Cruz", specialization: "Fisheries", municipality: "Binondo", barangay: "Barangay 289", status: "active", rating: 3.1, totalReviews: 8, joinedAt: "Feb 20, 2026" },
  { id: "w-004", fullName: "Carlo Santos", specialization: "Rural Development", municipality: "Malate", barangay: "Barangay 701", status: "pending", rating: 0, totalReviews: 0, joinedAt: "Mar 10, 2026" },
  { id: "w-005", fullName: "Ana Reyes", specialization: "Soil and Water", municipality: "Ermita", barangay: "Barangay 659", status: "active", rating: 4.7, totalReviews: 19, joinedAt: "Dec 5, 2025" },
  { id: "w-006", fullName: "Ben Torres", specialization: "Crop Production", municipality: "Quiapo", barangay: "Barangay 180", status: "inactive", rating: 4.2, totalReviews: 6, joinedAt: "Nov 1, 2025" },
  { id: "w-007", fullName: "Luz Garcia", specialization: "Livestock", municipality: "Tondo", barangay: "Barangay 110", status: "pending", rating: 0, totalReviews: 0, joinedAt: "Mar 15, 2026" },
  { id: "w-008", fullName: "Rico Bautista", specialization: "Fisheries", municipality: "Paco", barangay: "Barangay 820", status: "inactive", rating: 3.8, totalReviews: 4, joinedAt: "Oct 10, 2025" },
];

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/lgu/dashboard", active: false },
  { icon: BarChart3, label: "Analytics & Reports", href: "/lgu/analytics", active: false },
  { icon: Users, label: "Manage Workers", href: "/lgu/workers", active: true },
  { icon: ClipboardCheck, label: "Pending Approvals", href: "/lgu/approvals", active: false, badge: 3 },
];

const SPECIALIZATIONS = ["All", "Crop Production", "Livestock", "Fisheries", "Soil and Water", "Rural Development", "Other"];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    inactive: "bg-gray-100 text-gray-500",
  };
  const icons: Record<string, React.ReactNode> = {
    active: <CheckCircle2 size={11} />,
    pending: <Clock size={11} />,
    inactive: <XIcon size={11} />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${map[status]}`}>
      {icons[status]}{status}
    </span>
  );
}

export default function WorkersPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [specFilter, setSpecFilter] = useState("All");
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = MOCK_WORKERS.filter((w) => {
    const matchSearch = w.fullName.toLowerCase().includes(search.toLowerCase()) ||
      w.specialization.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || w.status === statusFilter;
    const matchSpec = specFilter === "All" || w.specialization === specFilter;
    return matchSearch && matchStatus && matchSpec;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  return (
    <div className="flex h-screen bg-[#f7f9f5] overflow-hidden font-body">
      <div className="hidden lg:flex flex-col w-64 shrink-0 shadow-xl"><Sidebar /></div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 shadow-2xl"><Sidebar mobile onClose={() => setMobileOpen(false)} /></div>
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-gray-500" onClick={() => setMobileOpen(true)}><Menu size={22} /></button>
            <div>
              <h1 className="font-display text-lg font-bold text-[#0a2e18]">Manage Workers</h1>
              <p className="text-xs text-gray-400">{filtered.length} workers found</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-[#0f4d2b] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#1a7a45] transition-colors shadow-sm">
            <Download size={14} />Export Data
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6">

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 focus:bg-white focus:border-[#0f4d2b] transition-all"
              />
            </div>

            {/* Status filter */}
            <div className="flex gap-1.5">
              {["all", "active", "pending", "inactive"].map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                    statusFilter === s
                      ? "bg-[#0f4d2b] text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Specialization filter */}
            <div className="relative">
              <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={specFilter}
                onChange={(e) => { setSpecFilter(e.target.value); setPage(1); }}
                className="pl-8 pr-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none bg-gray-50 focus:bg-white focus:border-[#0f4d2b] appearance-none transition-all"
              >
                {SPECIALIZATIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {paginated.length === 0 ? (
              <div className="text-center py-16">
                <Users size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm font-medium">No workers found</p>
                <p className="text-gray-300 text-xs mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                {/* Table header */}
                <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50">
                  {["Worker", "Specialization", "Area", "Status", "Rating", "Reviews", "Joined", ""].map((h, i) => (
                    <div key={i} className={`text-[11px] font-semibold text-gray-400 uppercase tracking-wide ${
                      i === 0 ? "col-span-2" : i === 7 ? "col-span-1" : "col-span-1"
                    }`}>
                      {h}
                    </div>
                  ))}
                </div>

                {/* Table rows */}
                {paginated.map((worker) => (
                  <div
                    key={worker.id}
                    className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-[#f7f9f5] transition-colors items-center"
                  >
                    {/* Name */}
                    <div className="col-span-2 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0f4d2b] to-[#1a7a45] flex items-center justify-center text-white text-xs font-bold font-display shrink-0">
                        {worker.fullName.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="text-sm font-semibold text-[#0a2e18] truncate">{worker.fullName}</span>
                    </div>

                    {/* Specialization */}
                    <div className="col-span-2 text-xs text-gray-500 truncate">{worker.specialization}</div>

                    {/* Area */}
                    <div className="col-span-2 flex items-center gap-1 text-xs text-gray-500 truncate">
                      <MapPin size={11} className="text-[#1a7a45] shrink-0" />
                      {worker.municipality}
                    </div>

                    {/* Status */}
                    <div className="col-span-1"><StatusBadge status={worker.status} /></div>

                    {/* Rating */}
                    <div className="col-span-1">
                      {worker.rating > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star size={12} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-semibold text-[#0a2e18]">{worker.rating}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </div>

                    {/* Reviews */}
                    <div className="col-span-1 text-xs text-gray-500">{worker.totalReviews}</div>

                    {/* Joined */}
                    <div className="col-span-2 text-xs text-gray-400">{worker.joinedAt}</div>

                    {/* Action */}
                    <div className="col-span-1 flex justify-end">
                      <Link
                        href={`/lgu/workers/${worker.id}`}
                        className="flex items-center gap-1 text-xs font-semibold text-[#0f4d2b] hover:bg-[#f0faf4] px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        <Eye size={13} />View
                      </Link>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-gray-400">
                Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                      page === p ? "bg-[#0f4d2b] text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-[#0f4d2b] hover:text-[#0f4d2b]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}