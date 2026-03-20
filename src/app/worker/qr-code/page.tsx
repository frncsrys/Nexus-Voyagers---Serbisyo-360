"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QrCode, Download, Printer, ArrowLeft, CheckCircle2, Clock, Shield, Info, LogOut } from "lucide-react";
import { logout } from "@/lib/logout";

interface WorkerData { id: string; fullName: string; specialization: string; lguName: string; status: string; }

export default function QRCodePage() {
  const router = useRouter();
  const [worker, setWorker] = useState<WorkerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/workers/me")
      .then((r) => { if (r.status === 401) { router.push("/login"); return null; } return r.json(); })
      .then((data) => { if (data) setWorker(data); })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="min-h-screen bg-[#f7f9f5] flex items-center justify-center"><span className="w-8 h-8 border-2 border-[#0f4d2b]/20 border-t-[#0f4d2b] rounded-full animate-spin"/></div>;
  if (!worker) return null;

  const isActive = worker.status === "active" || worker.status === "verified";
  const initials = worker.fullName.split(" ").map((n)=>n[0]).join("").toUpperCase();
  const profileUrl = typeof window !== "undefined" ? `${window.location.origin}/worker/${worker.id}` : `/worker/${worker.id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}`;

  const handleDownload = async () => {
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `serbisyo360-qr-${worker.fullName.replace(/\s/g,"-").toLowerCase()}.png`;
      a.click(); URL.revokeObjectURL(url);
    } catch { alert("Could not download QR code. Please try again."); }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f7f9f5] font-body">
      <header className="bg-[#0a2e18] text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <Link href="/worker/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <Image src="/serbisyo360-logo.png" alt="Serbisyo360" width={36} height={36}/>
          <span className="font-display font-bold text-base">Serbisyo<span className="text-[#a8e6bf]">360</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/worker/dashboard" className="text-white/60 hover:text-white text-sm font-medium transition-colors">Dashboard</Link>
          <Link href="/worker/qr-code" className="text-white text-sm font-medium border-b-2 border-[#a8e6bf] pb-0.5">My QR Code</Link>
        </div>
        <button onClick={logout} className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs transition-colors"><LogOut size={14}/>Log out</button>
      </header>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        <Link href="/worker/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#0f4d2b] transition-colors animate-fade-up"><ArrowLeft size={15}/>Back to Dashboard</Link>

        {!isActive ? (
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-8 text-center animate-fade-up">
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4"><Clock size={36} className="text-amber-400"/></div>
            <h2 className="font-display text-xl font-bold text-[#0a2e18] mb-2">QR Code Not Yet Available</h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">Your QR code will be generated and available here once your LGU administrator approves your profile.</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center animate-fade-up">
              <div className="flex items-center justify-center gap-1.5 bg-[#d4edda] text-[#0f4d2b] text-xs font-semibold px-3 py-1.5 rounded-full w-fit mx-auto mb-5">
                <CheckCircle2 size={12}/>Verified by {worker.lguName}
              </div>
              <div className="w-52 h-52 mx-auto mb-5 rounded-2xl overflow-hidden border-2 border-[#0f4d2b]/10">
                <Image src={qrUrl} alt="QR Code" width={208} height={208} className="w-full h-full object-cover" unoptimized/>
              </div>
              <h2 className="font-display text-xl font-bold text-[#0a2e18]">{worker.fullName}</h2>
              <p className="text-sm text-[#1a7a45] font-semibold mt-0.5">{worker.specialization}</p>
              <p className="text-xs text-gray-400 mt-1">{worker.lguName} · Serbisyo360</p>
            </div>
            <div className="grid grid-cols-2 gap-3 animate-fade-up delay-1">
              <button onClick={handleDownload} className="flex items-center justify-center gap-2 bg-[#0f4d2b] text-white font-semibold py-3 rounded-xl hover:bg-[#1a7a45] transition-colors shadow-lg text-sm"><Download size={16}/>Download PNG</button>
              <button onClick={()=>window.print()} className="flex items-center justify-center gap-2 border border-[#0f4d2b]/20 text-[#0f4d2b] font-semibold py-3 rounded-xl hover:bg-[#f0faf4] transition-colors text-sm"><Printer size={16}/>Print ID</button>
            </div>
            <button onClick={handleCopyLink} className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all animate-fade-up delay-2 ${copied?"bg-green-100 text-green-700 border border-green-200":"bg-white border border-gray-200 text-gray-500 hover:border-[#0f4d2b] hover:text-[#0f4d2b]"}`}>
              {copied?<><CheckCircle2 size={15}/>Link Copied!</>:<><Shield size={15}/>Copy Profile Link</>}
            </button>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-fade-up delay-3">
              <div className="flex items-center gap-2 mb-3"><Info size={15} className="text-[#0f4d2b]"/><h3 className="font-display text-sm font-bold text-[#0a2e18]">How to use your QR Code</h3></div>
              <ul className="space-y-2">
                {["Show this QR code to the community member after completing your field service.","They will scan it with their phone camera — no app download required.","Each scan opens a 30-minute review session for that community member.","Download and print it to display on your physical ID or lanyard."].map((instruction,i)=>(
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                    <span className="w-4 h-4 rounded-full bg-[#d4edda] text-[#0f4d2b] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>{instruction}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        <p className="text-center text-xs text-gray-400 pb-4">Powered by <span className="font-semibold text-[#0f4d2b]">Serbisyo360</span> · Data Privacy Act Compliant</p>
      </div>
    </div>
  );
}
