"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { CheckCircle2, XCircle, Clock, MapPin, Calendar, Star, Phone, Mail, ArrowLeft, Menu, Shield, AlertTriangle } from "lucide-react";
import Sidebar from "@/components/lgu/Sidebar";

interface WorkerDetail {
  id: string; fullName: string; specialization: string; municipality: string;
  barangay: string; province: string; phone: string; email: string;
  status: "active" | "pending" | "inactive"; rating: number; totalReviews: number;
  joinedAt: string; lguName: string; about: string;
  ratingBreakdown: { stars: number; count: number }[];
  reviews: { id: string; rating: number; comment: string; serviceDate: string; maskedPhone: string; createdAt: string }[];
}

export default function WorkerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const workerId = params.id as string;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [worker, setWorker] = useState<WorkerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<"approving" | "rejecting" | "deactivating" | null>(null);
  const [confirmAction, setConfirmAction] = useState<"reject" | "deactivate" | null>(null);

  const fetchWorker = () => {
    fetch(`/api/lgu/workers/${workerId}`)
      .then((r) => { if (r.status === 401 || r.status === 403) { router.push("/login"); return null; } return r.json(); })
      .then((d) => { if (d && !d.error) setWorker(d); })
      .catch(() => router.push("/lgu/workers"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchWorker(); }, [workerId]);

  const handleStatusChange = async (action: "approve" | "reject" | "deactivate") => {
    const loadingKey = action === "approve" ? "approving" : action === "reject" ? "rejecting" : "deactivating";
    setActionLoading(loadingKey);
    setConfirmAction(null);
    try {
      const newStatus = action === "approve" ? "active" : "inactive";
      const res = await fetch(`/api/workers/${workerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setWorker((w) => w ? { ...w, status: newStatus as WorkerDetail["status"] } : w);
      }
    } catch { /* ignore */ }
    finally { setActionLoading(null); }
  };

  if (loading) return <div className="min-h-screen bg-[#f7f9f5] flex items-center justify-center"><span className="w-8 h-8 border-2 border-[#0f4d2b]/20 border-t-[#0f4d2b] rounded-full animate-spin"/></div>;
  if (!worker) return null;

  const initials = worker.fullName.split(" ").map((n) => n[0]).join("").toUpperCase();

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
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-gray-500" onClick={() => setMobileOpen(true)}><Menu size={22}/></button>
            <Link href="/lgu/workers" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#0f4d2b] transition-colors">
              <ArrowLeft size={16}/>Back to Workers
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {worker.status === "pending" && (
              <>
                <button onClick={() => setConfirmAction("reject")} disabled={!!actionLoading}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50">
                  <XCircle size={14}/>Reject
                </button>
                <button onClick={() => handleStatusChange("approve")} disabled={!!actionLoading}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0f4d2b] rounded-xl hover:bg-[#1a7a45] transition-colors shadow-sm disabled:opacity-50">
                  {actionLoading === "approving" ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <CheckCircle2 size={14}/>}
                  Approve
                </button>
              </>
            )}
            {worker.status === "active" && (
              <button onClick={() => setConfirmAction("deactivate")} disabled={!!actionLoading}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-amber-600 border border-amber-200 rounded-xl hover:bg-amber-50 transition-colors disabled:opacity-50">
                <AlertTriangle size={14}/>Deactivate Worker
              </button>
            )}
            {worker.status === "inactive" && (
              <button onClick={() => handleStatusChange("approve")} disabled={!!actionLoading}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0f4d2b] rounded-xl hover:bg-[#1a7a45] transition-colors shadow-sm disabled:opacity-50">
                <CheckCircle2 size={14}/>Reactivate Worker
              </button>
            )}
          </div>
        </header>

        {/* Confirm dialog */}
        {confirmAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 ${confirmAction === "reject" ? "bg-red-100" : "bg-amber-100"}`}>
                {confirmAction === "reject" ? <XCircle size={24} className="text-red-500"/> : <AlertTriangle size={24} className="text-amber-500"/>}
              </div>
              <h3 className="font-display text-lg font-bold text-[#0a2e18] text-center mb-2">
                {confirmAction === "reject" ? "Reject Worker?" : "Deactivate Worker?"}
              </h3>
              <p className="text-xs text-gray-500 text-center mb-5 leading-relaxed">
                {confirmAction === "reject"
                  ? `Are you sure you want to reject ${worker.fullName}'s profile? This will prevent them from being issued a QR code.`
                  : `Are you sure you want to deactivate ${worker.fullName}? Their QR code will be disabled and they cannot receive new reviews.`}
              </p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmAction(null)} className="flex-1 border border-gray-200 text-gray-500 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => handleStatusChange(confirmAction === "reject" ? "reject" : "deactivate")}
                  className={`flex-1 font-semibold py-2.5 rounded-xl text-sm text-white transition-colors ${confirmAction === "reject" ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"}`}>
                  {confirmAction === "reject" ? "Yes, Reject" : "Yes, Deactivate"}
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Profile card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-[#0f4d2b] h-24 relative">
              <div className="absolute inset-0 opacity-10" style={{backgroundImage:"linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",backgroundSize:"20px 20px"}}/>
            </div>
            <div className="px-6 pb-6 -mt-10 relative">
              <div className="flex items-end justify-between mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0f4d2b] to-[#1a7a45] flex items-center justify-center text-white font-display font-bold text-2xl shadow-lg border-4 border-white">{initials}</div>
                <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-1 ${worker.status==="active"?"bg-green-100 text-green-700":worker.status==="pending"?"bg-amber-100 text-amber-700":"bg-gray-100 text-gray-500"}`}>
                  {worker.status==="active"?<CheckCircle2 size={12}/>:worker.status==="pending"?<Clock size={12}/>:<XCircle size={12}/>}
                  {worker.status.charAt(0).toUpperCase()+worker.status.slice(1)}
                </div>
              </div>
              <h1 className="font-display text-2xl font-bold text-[#0a2e18] mb-1">{worker.fullName}</h1>
              <p className="text-sm font-semibold text-[#1a7a45] mb-4">{worker.specialization}</p>
              {worker.about && <p className="text-xs text-gray-500 mb-4 italic">"{worker.about}"</p>}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-500"><MapPin size={13} className="text-[#1a7a45] shrink-0"/><span>{worker.barangay}, {worker.municipality}</span></div>
                <div className="flex items-center gap-2 text-xs text-gray-500"><Calendar size={13} className="text-[#1a7a45] shrink-0"/><span>Joined {worker.joinedAt}</span></div>
                <div className="flex items-center gap-2 text-xs text-gray-500"><Phone size={13} className="text-[#1a7a45] shrink-0"/><span>{worker.phone}</span></div>
                <div className="flex items-center gap-2 text-xs text-gray-500"><Mail size={13} className="text-[#1a7a45] shrink-0"/><span className="truncate">{worker.email}</span></div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {/* Rating summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-display text-base font-bold text-[#0a2e18] mb-4">Rating Summary</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                  <p className="font-display text-4xl font-bold text-[#0f4d2b]">{worker.rating || "—"}</p>
                  <div className="flex gap-0.5 my-1">
                    {[1,2,3,4,5].map((s) => (<Star key={s} size={12} className={s<=Math.round(worker.rating)?"fill-yellow-400 text-yellow-400":"fill-gray-200 text-gray-200"}/>))}
                  </div>
                  <p className="text-[10px] text-gray-400">{worker.totalReviews} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {worker.ratingBreakdown.map(({stars,count}) => (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 w-3">{stars}</span>
                      <Star size={9} className="fill-yellow-400 text-yellow-400 shrink-0"/>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{width:worker.totalReviews>0?`${(count/worker.totalReviews)*100}%`:"0%"}}/>
                      </div>
                      <span className="text-[10px] text-gray-400 w-4">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-[#f0faf4] border border-[#0f4d2b]/15 rounded-xl p-3">
                <Shield size={13} className="text-[#0f4d2b]"/>
                <p className="text-[11px] text-[#3d6b4f]">All reviews are OTP-verified</p>
              </div>
            </div>

            {/* Reviews */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-display text-base font-bold text-[#0a2e18] mb-4">
                Verified Reviews <span className="text-sm font-normal text-gray-400 ml-2">({worker.reviews.length})</span>
              </h2>
              {worker.reviews.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {worker.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-0.5">{[1,2,3,4,5].map((s) => (<Star key={s} size={13} className={s<=review.rating?"fill-yellow-400 text-yellow-400":"fill-gray-200 text-gray-200"}/>))}</div>
                        <div className="flex items-center gap-3 text-[10px] text-gray-400">
                          <span>{review.maskedPhone}</span>
                          <span>{review.serviceDate}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
