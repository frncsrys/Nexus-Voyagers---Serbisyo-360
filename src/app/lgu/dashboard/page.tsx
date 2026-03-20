"use client";

import Sidebar from "@/components/lgu/Sidebar";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Star, MapPin, TrendingUp, TrendingDown, CheckCircle2, Clock, ChevronRight, Menu, Download } from "lucide-react";

interface DashData {
  lgu: { name: string; adminName: string; province: string };
  stats: { registeredWorkers: number; activeWorkers: number; pendingApprovals: number; averageRating: number };
  workerStatus: { active: number; pending: number; inactive: number };
  areas: { name: string; workers: number; rating: number }[];
  community: {
    totalReviews: number; uniqueReviewers: number; reviewsThisMonth: number;
    mostReviewed: { name: string; rating: number; reviews: number } | null;
    highestRated: { name: string; rating: number; reviews: number } | null;
    lowestRated: { name: string; rating: number; reviews: number } | null;
  };
  recentActivity: { worker: string; workerId: string; area: string; time: string }[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/lgu/dashboard")
      .then((r) => { if (r.status === 401 || r.status === 403) { router.push("/login"); return null; } return r.json(); })
      .then((d) => { if (d && !d.error) setData(d); })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="min-h-screen bg-[#f7f9f5] flex items-center justify-center"><span className="w-8 h-8 border-2 border-[#0f4d2b]/20 border-t-[#0f4d2b] rounded-full animate-spin"/></div>;
  if (!data) return null;

  const { stats, workerStatus, areas, community, recentActivity } = data;
  const total = workerStatus.active + workerStatus.pending + workerStatus.inactive || 1;

  return (
    <div className="flex h-screen bg-[#f7f9f5] overflow-hidden font-body">
      <div className="hidden lg:flex flex-col w-64 shrink-0 shadow-xl"><Sidebar /></div>
      {mobileOpen&&(
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 shadow-2xl"><Sidebar mobile onClose={()=>setMobileOpen(false)}/></div>
          <div className="flex-1 bg-black/40" onClick={()=>setMobileOpen(false)}/>
        </div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-gray-500 hover:text-[#0f4d2b]" onClick={()=>setMobileOpen(true)}><Menu size={22}/></button>
            <div>
              <h1 className="font-display text-lg font-bold text-[#0a2e18]">Dashboard</h1>
              <p className="text-xs text-gray-400">{data.lgu.name} · {new Date().toLocaleDateString("en-PH",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/lgu/approvals" className="relative p-2 text-gray-500 hover:text-[#0f4d2b] hover:bg-[#f0faf4] rounded-xl transition-colors">
              <Bell size={20}/>
              {stats.pendingApprovals>0&&<span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{stats.pendingApprovals}</span>}
            </Link>
            <div className="w-9 h-9 rounded-xl bg-[#0f4d2b] flex items-center justify-center text-white font-display font-bold text-sm">
              {data.lgu.adminName.split(" ").map((n)=>n[0]).join("").toUpperCase().slice(0,2)}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label:"Registered Workers", value:stats.registeredWorkers, icon:CheckCircle2, color:"bg-blue-50 text-blue-600", link:null, suffix:"" },
              { label:"Active Workers", value:stats.activeWorkers, icon:CheckCircle2, color:"bg-green-50 text-green-600", link:null, suffix:"" },
              { label:"Pending Approvals", value:stats.pendingApprovals, icon:Clock, color:"bg-amber-50 text-amber-600", link:"/lgu/approvals", suffix:"" },
              { label:"Average LGU Rating", value:stats.averageRating||"—", icon:Star, color:"bg-yellow-50 text-yellow-600", link:null, suffix:stats.averageRating?"★":"" },
            ].map(({label,value,icon:Icon,color,link,suffix})=>(
              <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon size={18}/></div>
                  {link&&<Link href={link} className="text-[10px] text-[#0f4d2b] font-semibold hover:underline flex items-center gap-0.5">View <ChevronRight size={10}/></Link>}
                </div>
                <p className="font-display text-3xl font-bold text-[#0a2e18]">{value}{suffix}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4"><h2 className="font-display text-base font-bold text-[#0a2e18]">Areas Covered</h2><span className="text-xs text-gray-400">{areas.length} areas</span></div>
              {areas.length===0?<p className="text-sm text-gray-400 text-center py-4">No areas with active workers yet.</p>:(
                <div className="space-y-3">
                  {areas.map((area)=>(
                    <div key={area.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-2"><MapPin size={14} className="text-[#1a7a45]"/><span className="text-sm font-medium text-[#0a2e18]">{area.name}</span></div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">{area.workers} workers</span>
                        {area.rating>0&&<div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full"><Star size={10} className="fill-yellow-400 text-yellow-400"/><span className="text-xs font-semibold text-yellow-700">{area.rating}</span></div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-display text-base font-bold text-[#0a2e18] mb-4">Community Reach</h2>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[{label:"Total Reviews",value:community.totalReviews},{label:"Unique Reviewers",value:community.uniqueReviewers},{label:"This Month",value:community.reviewsThisMonth}].map(({label,value})=>(
                  <div key={label} className="bg-[#f7f9f5] rounded-xl p-3 text-center"><p className="font-display text-xl font-bold text-[#0f4d2b]">{value}</p><p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{label}</p></div>
                ))}
              </div>
              <div className="space-y-2">
                {[
                  {label:"Most Reviewed",data:community.mostReviewed,icon:TrendingUp,color:"text-blue-600 bg-blue-50"},
                  {label:"Highest Rated",data:community.highestRated,icon:TrendingUp,color:"text-green-600 bg-green-50"},
                  {label:"Lowest Rated",data:community.lowestRated,icon:TrendingDown,color:"text-red-500 bg-red-50"},
                ].map(({label,data:d,icon:Icon,color})=>(
                  d&&<div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${color}`}><Icon size={12}/></div>
                      <div><p className="text-[10px] text-gray-400">{label}</p><p className="text-xs font-semibold text-[#0a2e18]">{d.name}</p></div>
                    </div>
                    <div className="flex items-center gap-1"><Star size={11} className="fill-yellow-400 text-yellow-400"/><span className="text-xs font-bold text-[#0a2e18]">{d.rating}</span><span className="text-[10px] text-gray-400">({d.reviews})</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4"><h2 className="font-display text-base font-bold text-[#0a2e18]">Recent Activity</h2><span className="text-xs text-gray-400">Last 5 reviews</span></div>
              {recentActivity.length===0?<p className="text-sm text-gray-400 text-center py-6">No reviews submitted yet.</p>:(
                <div className="space-y-3">
                  {recentActivity.map((item,i)=>(
                    <Link key={i} href={`/lgu/workers/${item.workerId}`} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#f7f9f5] transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#d4edda] flex items-center justify-center shrink-0"><Star size={13} className="fill-[#0f4d2b] text-[#0f4d2b]"/></div>
                        <p className="text-xs text-gray-600"><span className="font-semibold text-[#0a2e18]">Community member</span> submitted a review for{" "}<span className="font-semibold text-[#0f4d2b]">{item.worker}</span> in {item.area}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2"><span className="text-[10px] text-gray-400">{item.time}</span><ChevronRight size={13} className="text-gray-300 group-hover:text-[#0f4d2b] transition-colors"/></div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4"><h2 className="font-display text-base font-bold text-[#0a2e18]">Worker Status</h2><Link href="/lgu/workers" className="text-[10px] text-[#0f4d2b] font-semibold hover:underline">View all</Link></div>
              <div className="space-y-3 mb-5">
                {[
                  {label:"Active",count:workerStatus.active,color:"bg-green-500",bg:"bg-green-50 text-green-700",filter:"active"},
                  {label:"Pending",count:workerStatus.pending,color:"bg-amber-400",bg:"bg-amber-50 text-amber-700",filter:"pending"},
                  {label:"Inactive",count:workerStatus.inactive,color:"bg-gray-300",bg:"bg-gray-50 text-gray-600",filter:"inactive"},
                ].map(({label,count,color,bg,filter})=>(
                  <Link key={label} href={`/lgu/workers?status=${filter}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f7f9f5] transition-colors">
                    <div className="flex items-center gap-2"><div className={`w-2.5 h-2.5 rounded-full ${color}`}/><span className="text-sm text-gray-600">{label}</span></div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${bg}`}>{count}</span>
                  </Link>
                ))}
              </div>
              <div className="h-2.5 rounded-full overflow-hidden flex gap-0.5">
                <div className="bg-green-500 rounded-l-full" style={{width:`${(workerStatus.active/total)*100}%`}}/>
                <div className="bg-amber-400" style={{width:`${(workerStatus.pending/total)*100}%`}}/>
                <div className="bg-gray-200 rounded-r-full flex-1"/>
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-1.5"><span>0</span><span>{total} total</span></div>
              <button className="mt-4 w-full flex items-center justify-center gap-2 border border-[#0f4d2b]/20 text-[#0f4d2b] text-xs font-semibold py-2.5 rounded-xl hover:bg-[#f0faf4] transition-colors"><Download size={13}/>Export Worker Data</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
