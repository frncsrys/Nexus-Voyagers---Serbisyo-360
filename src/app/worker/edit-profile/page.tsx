"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, CheckCircle2, XCircle,
  ChevronDown, Save, AlertTriangle, LogOut
} from "lucide-react";
import { logout } from "@/lib/logout";

const SPECIALIZATIONS = [
  "Crop Production", "Livestock", "Fisheries",
  "Soil and Water", "Rural Development", "Other"
];
const MUNICIPALITIES = [
  "Quiapo", "Tondo", "Binondo", "Malate",
  "Ermita", "Paco", "Santa Ana", "San Miguel"
];
const BARANGAYS = [
  "Barangay 1", "Barangay 2", "Barangay 176",
  "Bagong Silang", "Commonwealth", "Payatas", "Batasan Hills"
];

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  municipality: string;
  barangay: string;
  about: string;
}

interface Errors { [key: string]: string; }

// TODO: replace with real session data GET /api/workers/me
const INITIAL_DATA: FormData = {
  fullName: "Jane Doe",
  email: "jane.doe@email.com",
  phone: "+63 912 345 6789",
  specialization: "Crop Production",
  municipality: "Quiapo",
  barangay: "Barangay 176",
  about: "Agricultural extension worker specializing in crop production techniques.",
};

export default function EditProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k: keyof FormData, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
    setSaved(false);
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^(\+63|0)[0-9]{9,10}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Enter a valid Philippine mobile number";
    if (!form.specialization) e.specialization = "Please select a specialization";
    if (!form.municipality) e.municipality = "Please select a municipality";
    if (!form.barangay) e.barangay = "Please select a barangay";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setLoading(true);
    // TODO: call PATCH /api/workers/me with form data
    setTimeout(() => {
    setLoading(false);
    setSaved(true);
    // Redirect after showing success state briefly
    setTimeout(() => {
            router.push("/worker/dashboard");
        }, 1500);
    }, 1200);
  };

  const initials = form.fullName.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <div className="min-h-screen bg-[#f7f9f5] font-body">
      {/* Top nav */}
      <header className="bg-[#0a2e18] text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <Link
          href="/worker/dashboard"
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <Image src="/serbisyo360-logo.png" alt="Serbisyo360" width={36} height={36} />
          <span className="font-display font-bold text-base">
            Serbisyo<span className="text-[#a8e6bf]">360</span>
          </span>
        </Link>
        <button
            onClick={logout}
            className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs transition-colors"
            >
            <LogOut size={14} />Log out
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* Back + title */}
        <div className="flex items-center gap-3 animate-fade-up">
          <Link
            href="/worker/dashboard"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#0f4d2b] transition-colors"
          >
            <ArrowLeft size={15} />Back to Dashboard
          </Link>
        </div>

        <div className="animate-fade-up">
          <h1 className="font-display text-2xl font-bold text-[#0a2e18]">Edit Profile</h1>
          <p className="text-xs text-gray-500 mt-1">
            Changes to your profile will be reviewed by your LGU administrator before going live.
          </p>
        </div>

        {/* Re-approval notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 animate-fade-up delay-1">
          <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            <span className="font-semibold">Important:</span> After saving changes, your profile status will return to{" "}
            <span className="font-semibold">Pending</span> until your LGU administrator re-approves it. Your QR code will be temporarily disabled during this period.
          </p>
        </div>

        {/* Avatar section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-fade-up delay-1">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0f4d2b] to-[#1a7a45] flex items-center justify-center text-white font-display font-bold text-xl shadow-lg">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0a2e18]">{form.fullName}</p>
              <p className="text-xs text-gray-400 mt-0.5">{form.specialization}</p>
              <p className="text-[11px] text-gray-300 mt-2">
                Profile photo upload coming soon
              </p>
            </div>
          </div>
        </div>

        {/* Personal info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 animate-fade-up delay-2">
          <h2 className="font-display text-base font-bold text-[#0a2e18]">Personal Information</h2>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Full Name</label>
            <input
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] ${
                errors.fullName ? "border-red-400" : "border-gray-200"
              }`}
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
            />
            {errors.fullName && (
              <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                <XCircle size={11} />{errors.fullName}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email Address</label>
            <input
              type="email"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] ${
                errors.email ? "border-red-400" : "border-gray-200"
              }`}
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                <XCircle size={11} />{errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Phone Number</label>
            <input
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] ${
                errors.phone ? "border-red-400" : "border-gray-200"
              }`}
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
            {errors.phone && (
              <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                <XCircle size={11} />{errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Work details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 animate-fade-up delay-3">
          <h2 className="font-display text-base font-bold text-[#0a2e18]">Work Details</h2>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Specialization</label>
            <div className="relative">
              <select
                className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] appearance-none ${
                  errors.specialization ? "border-red-400" : "border-gray-200"
                }`}
                value={form.specialization}
                onChange={(e) => set("specialization", e.target.value)}
              >
                <option value="">Select specialization</option>
                {SPECIALIZATIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.specialization && (
              <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                <XCircle size={11} />{errors.specialization}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Municipality</label>
              <div className="relative">
                <select
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] appearance-none ${
                    errors.municipality ? "border-red-400" : "border-gray-200"
                  }`}
                  value={form.municipality}
                  onChange={(e) => set("municipality", e.target.value)}
                >
                  <option value="">Select area</option>
                  {MUNICIPALITIES.map((m) => <option key={m}>{m}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.municipality && (
                <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                  <XCircle size={11} />{errors.municipality}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Barangay</label>
              <div className="relative">
                <select
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] appearance-none ${
                    errors.barangay ? "border-red-400" : "border-gray-200"
                  }`}
                  value={form.barangay}
                  onChange={(e) => set("barangay", e.target.value)}
                >
                  <option value="">Select barangay</option>
                  {BARANGAYS.map((b) => <option key={b}>{b}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.barangay && (
                <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                  <XCircle size={11} />{errors.barangay}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
              About / Designation
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <textarea
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] resize-none"
              value={form.about}
              onChange={(e) => set("about", e.target.value)}
            />
          </div>
        </div>

        {/* Save button */}
        <div className="flex gap-3 animate-fade-up delay-4">
          <Link
            href="/worker/dashboard"
            className="flex-1 border border-gray-200 text-gray-500 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm text-center"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`flex-1 font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg text-sm ${
              saved
                ? "bg-green-500 text-white"
                : "bg-[#0f4d2b] text-white hover:bg-[#1a7a45] disabled:opacity-60"
            }`}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : saved ? (
              <><CheckCircle2 size={15} />Saved! Pending Re-approval</>
            ) : (
              <><Save size={15} />Save Changes</>
            )}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 pb-4">
          Powered by <span className="font-semibold text-[#0f4d2b]">Serbisyo360</span>
        </p>
      </div>
    </div>
  );
}