"use client";

import Sidebar from "@/components/lgu/Sidebar";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Clock, MapPin, Calendar, Menu, AlertCircle } from "lucide-react";

interface PendingWorker {
  id: string; fullName: string; specialization: string; municipality: string;
  barangay: string; phone: string; email: string; joinedAt: string;
  daysWaiting: number;
}

export default function ApprovalsPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [workers, setWorkers] = useState<PendingWorker[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMap, setActionMap] = useState<Record<string, "approving" | "rejecting" | "approved" | "rejected">>({});

  useEffect(() => {
    fetch("/api/lgu/workers?status=pending")
      .then((r) => { if (r.status === 401 || r.status === 403) { router.push("/login"); return null; } return r.json(); })
      .then((d) => {
        if (d && d.workers) {
          setWorkers(d.workers.map((w: {id:string;fullName:string;specialization:string;municipality:string;barangay:string;phone:string;email:string;joinedAt:string;createdAt?:string}) => ({
            ...w,
            phone: w.phone || "",
            email: w.email || "",
            daysWaiting: Math.floor((Date.now() - new Date(w.joinedAt).getTime()) / (1000 * 60 * 60 * 24)),
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionMap((prev) => ({ ...prev, [id]: action === "approve" ? "approving" : "rejecting" }));
    try {
      const res = await fetch(`/api/workers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action === "approve" ? "active" : "inactive" }),
      });
      if (res.ok) {
        setActionMap((prev) => ({ ...prev, [id]: action === "approve" ? "approved" : "rejected" }));
        setTimeout(() => {
          setWorkers((prev) => prev.filter((w) => w.id !== id));
          setActionMap((prev) => { const n = { ...prev }; delete n[id]; return n; });
        }, 800);
      } else {
        setActionMap((prev) => { const n = { ...prev }; delete n[id]; return n; });
      }
    } catch {
      setActionMap((prev) => { const n = { ...prev }; delete n[id]; return n; });
    }
  };

  return (
    <div className="flex h-screen bg-[#f7f9f5] overflow-hidden font-body">
      <div className="hidden lg:flex flex-col w-64 shrink-0 shadow-xl"><Sidebar/></div>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 shadow-2xl"><Sidebar mobile onClose={() => setMobileOpen(false)}/></div>
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)}/>
        </div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-3 shrink-0 shadow-sm">
          <button className="lg:hidden text-gray-500" onClick={() => setMobileOpen(true)}><Menu size={22}/></button>
          <div>
            <h1 className="font-display text-lg font-bold text-[#0a2e18]">Pending Approvals</h1>
            <p className="text-xs text-gray-400">{workers.length} worker{workers.length !== 1 ? "s" : ""} awaiting review</p>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5"/>
            <p className="text-xs text-amber-700 leading-relaxed">
              <span className="font-semibold">Auto-approval policy:</span> Worker profiles pending for more than 7 days without admin action will be automatically approved. You will receive an email notification when this occurs.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16"><span className="w-8 h-8 border-2 border-[#0f4d2b]/20 border-t-[#0f4d2b] rounded-full animate-spin"/></div>
          ) : workers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
              <CheckCircle2 size={48} className="text-[#d4edda] mx-auto mb-4"/>
              <p className="font-display text-lg font-bold text-[#0a2e18] mb-1">All caught up!</p>
              <p className="text-sm text-gray-400">All worker profiles are up to date. No pending approvals.</p>
            </div>
          ) : (
            workers.map((worker) => {
              const state = actionMap[worker.id];
              const isLoading = state === "approving" || state === "rejecting";
              const isDone = state === "approved" || state === "rejected";
              return (
                <div key={worker.id} className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${isDone ? state==="approved" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50" : "border-gray-100"}`}>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0f4d2b] to-[#1a7a45] flex items-center justify-center text-white font-display font-bold text-lg shrink-0">
                        {worker.fullName.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display font-bold text-[#0a2e18]">{worker.fullName}</h3>
                          {worker.daysWaiting >= 7 && (
                            <span className="bg-red-100 text-red-600 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"><Clock size={9}/>Auto-approve soon</span>
                          )}
                        </div>
                        <p className="text-xs text-[#1a7a45] font-semibold mb-2">{worker.specialization}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><MapPin size={11} className="text-[#1a7a45]"/>{worker.barangay}, {worker.municipality}</span>
                          <span className="flex items-center gap-1"><Calendar size={11} className="text-[#1a7a45]"/>Submitted {worker.joinedAt}</span>
                          <span className="flex items-center gap-1"><Clock size={11} className="text-amber-500"/>Waiting {worker.daysWaiting} day{worker.daysWaiting !== 1 ? "s" : ""}</span>
                        </div>
                        <div className="flex gap-3 mt-2 text-xs text-gray-400">
                          <span>{worker.email}</span>
                          <span>{worker.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isDone ? (
                        <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold ${state==="approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                          {state==="approved" ? <><CheckCircle2 size={15}/>Approved</> : <><XCircle size={15}/>Rejected</>}
                        </div>
                      ) : (
                        <>
                          <Link href={`/lgu/workers/${worker.id}`} className="px-3 py-2 text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">View Profile</Link>
                          <button onClick={() => handleAction(worker.id, "reject")} disabled={isLoading}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50">
                            {state==="rejecting" ? <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"/> : <XCircle size={14}/>}Reject
                          </button>
                          <button onClick={() => handleAction(worker.id, "approve")} disabled={isLoading}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0f4d2b] rounded-xl hover:bg-[#1a7a45] transition-colors shadow-sm disabled:opacity-50">
                            {state==="approving" ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <CheckCircle2 size={14}/>}Approve
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </main>
      </div>
    </div>
  );
}
