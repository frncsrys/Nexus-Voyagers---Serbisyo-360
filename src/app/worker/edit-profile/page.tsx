"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, XCircle, ChevronDown, Save, AlertTriangle, LogOut } from "lucide-react";
import { logout } from "@/lib/logout";

const SPECIALIZATIONS = ["Crop Production","Livestock","Fisheries","Soil and Water","Rural Development","Other"];
const MUNICIPALITIES = ["Quiapo","Tondo","Binondo","Malate","Ermita","Paco","Santa Ana","San Miguel"];
const BARANGAYS = ["Barangay 1","Barangay 2","Barangay 176","Bagong Silang","Commonwealth","Payatas","Batasan Hills"];

interface FormData { fullName:string; email:string; phone:string; specialization:string; municipality:string; barangay:string; about:string; }
interface Errors { [key:string]:string; }

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState<FormData>({ fullName:"", email:"", phone:"", specialization:"", municipality:"", barangay:"", about:"" });

  useEffect(() => {
    fetch("/api/workers/me")
      .then((r) => { if (r.status === 401) { router.push("/login"); return null; } return r.json(); })
      .then((d) => { if (d) setForm({ fullName:d.fullName||"", email:d.email||"", phone:d.phone||"", specialization:d.specialization||"", municipality:d.municipality||"", barangay:d.barangay||"", about:d.about||"" }); })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const set = (k: keyof FormData, v: string) => { setForm((f) => ({...f,[k]:v})); setErrors((e) => ({...e,[k]:""})); };

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^(\+63|0)[0-9]{9,10}$/.test(form.phone.replace(/\s/g,""))) e.phone = "Enter a valid Philippine mobile number";
    if (!form.specialization) e.specialization = "Please select a specialization";
    if (!form.municipality) e.municipality = "Please select a municipality";
    if (!form.barangay) e.barangay = "Please select a barangay";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true); setServerError("");
    try {
      const res = await fetch("/api/workers/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setServerError(data.error || "Failed to save."); return; }
      setSaved(true);
      setTimeout(() => { setSaved(false); router.push("/worker/dashboard"); }, 1500);
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#f7f9f5] flex items-center justify-center"><span className="w-8 h-8 border-2 border-[#0f4d2b]/20 border-t-[#0f4d2b] rounded-full animate-spin"/></div>;

  return (
    <div className="min-h-screen bg-[#f7f9f5] font-body">
      <header className="bg-[#0a2e18] text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <Link href="/worker/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <Image src="/serbisyo360-logo.png" alt="Serbisyo360" width={36} height={36}/>
          <span className="font-display font-bold text-base">Serbisyo<span className="text-[#a8e6bf]">360</span></span>
        </Link>
        <button onClick={logout} className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs transition-colors"><LogOut size={14}/>Log out</button>
      </header>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        <Link href="/worker/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#0f4d2b] transition-colors animate-fade-up"><ArrowLeft size={15}/>Back to Dashboard</Link>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 animate-fade-up">
          <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5"/>
          <p className="text-xs text-amber-700 leading-relaxed"><span className="font-semibold">Heads up:</span> Saving changes will set your profile back to pending until your LGU administrator re-approves it. Your QR code will be temporarily disabled.</p>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5 animate-fade-up delay-1">
          <div><h2 className="font-display text-xl font-bold text-[#0a2e18]">Edit Profile</h2><p className="text-xs text-gray-500 mt-0.5">Update your personal and work details</p></div>

          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
              <XCircle size={14} className="text-red-500 shrink-0"/>
              <p className="text-red-600 text-xs">{serverError}</p>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Full Name</label>
            <input className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] ${errors.fullName?"border-red-400":"border-gray-200"}`} value={form.fullName} onChange={(e)=>set("fullName",e.target.value)}/>
            {errors.fullName&&<p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><XCircle size={11}/>{errors.fullName}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email Address <span className="text-gray-400 font-normal">(cannot be changed)</span></label>
            <input type="email" disabled value={form.email} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-100 text-gray-400 cursor-not-allowed"/>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Phone Number</label>
            <input className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] ${errors.phone?"border-red-400":"border-gray-200"}`} placeholder="+63 9XX XXX XXXX" value={form.phone} onChange={(e)=>set("phone",e.target.value)}/>
            {errors.phone&&<p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><XCircle size={11}/>{errors.phone}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Specialization</label>
            <div className="relative">
              <select className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] appearance-none ${errors.specialization?"border-red-400":"border-gray-200"}`} value={form.specialization} onChange={(e)=>set("specialization",e.target.value)}>
                <option value="">Select specialization</option>{SPECIALIZATIONS.map((s)=><option key={s}>{s}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
            </div>
            {errors.specialization&&<p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><XCircle size={11}/>{errors.specialization}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Municipality</label>
              <div className="relative">
                <select className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] appearance-none ${errors.municipality?"border-red-400":"border-gray-200"}`} value={form.municipality} onChange={(e)=>set("municipality",e.target.value)}>
                  <option value="">Select area</option>{MUNICIPALITIES.map((m)=><option key={m}>{m}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
              </div>
              {errors.municipality&&<p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><XCircle size={11}/>{errors.municipality}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Barangay</label>
              <div className="relative">
                <select className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] appearance-none ${errors.barangay?"border-red-400":"border-gray-200"}`} value={form.barangay} onChange={(e)=>set("barangay",e.target.value)}>
                  <option value="">Select barangay</option>{BARANGAYS.map((b)=><option key={b}>{b}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
              </div>
              {errors.barangay&&<p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><XCircle size={11}/>{errors.barangay}</p>}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">About / Designation <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] resize-none" rows={3} placeholder="Brief description of your role or experience" value={form.about} onChange={(e)=>set("about",e.target.value)}/>
          </div>

          <div className="flex gap-3 pt-2">
            <Link href="/worker/dashboard" className="flex-1 border border-[#0f4d2b]/20 text-[#0f4d2b] font-semibold py-2.5 rounded-xl hover:bg-[#0f4d2b]/5 transition-all text-sm text-center">Cancel</Link>
            <button type="submit" disabled={saving||saved}
              className="flex-1 bg-[#0f4d2b] text-white font-semibold py-2.5 rounded-xl hover:bg-[#1a7a45] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 text-sm">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : saved ? <><CheckCircle2 size={15}/>Saved!</> : <><Save size={15}/>Save Changes</>}
            </button>
          </div>
        </form>
        <p className="text-center text-xs text-gray-400 pb-4">Powered by <span className="font-semibold text-[#0f4d2b]">Serbisyo360</span> · Data Privacy Act Compliant</p>
      </div>
    </div>
  );
}
