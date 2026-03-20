"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Eye, EyeOff, Users, ChevronDown,
  ChevronRight, CheckCircle2, XCircle, Check
} from "lucide-react";

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
  password: string;
  confirm: string;
}

interface Errors {
  [key: string]: string;
}

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
  checks: { label: string; passed: boolean }[];
} {
  const checks = [
    { label: "At least 8 characters", passed: password.length >= 8 },
    { label: "Uppercase letter", passed: /[A-Z]/.test(password) },
    { label: "Lowercase letter", passed: /[a-z]/.test(password) },
    { label: "Number", passed: /[0-9]/.test(password) },
    { label: "Special character (!@#$...)", passed: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.passed).length;
  const label = score <= 1 ? "Weak" : score <= 3 ? "Fair" : score === 4 ? "Good" : "Strong";
  const color = score <= 1 ? "#dc2626" : score <= 3 ? "#f59e0b" : score === 4 ? "#3b82f6" : "#16a34a";
  return { score, label, color, checks };
}

export default function WorkerRegisterPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState<FormData>({
    fullName: "", email: "", phone: "",
    specialization: "", municipality: "", barangay: "",
    about: "", password: "", confirm: "",
  });

  const set = (k: keyof FormData, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const pwStrength = getPasswordStrength(form.password);

  const validateStep1 = (): boolean => {
    const e: Errors = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^(\+63|0)[0-9]{9,10}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Enter a valid Philippine mobile number";
    if (!form.password) e.password = "Password is required";
    else if (pwStrength.score < 3) e.password = "Password is too weak";
    if (!form.confirm) e.confirm = "Please confirm your password";
    else if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = (): boolean => {
    const e: Errors = {};
    if (!form.specialization) e.specialization = "Please select a specialization";
    if (!form.municipality) e.municipality = "Please select a municipality";
    if (!form.barangay) e.barangay = "Please select a barangay";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    // TODO: connect to backend API
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen auth-bg flex items-center justify-center p-6">
        <div className="bg-[#0f4d2b] rounded-2xl p-10 text-center max-w-sm w-full shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-[#a8e6bf]" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-2">Registration Submitted!</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            Your profile is under review. You'll be notified once your LGU administrator approves your account and issues your QR code.
          </p>
          <Link href="/login" className="block w-full bg-white text-[#0f4d2b] font-semibold py-2.5 rounded-xl text-sm text-center hover:bg-[#f0faf4] transition-all">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-6 py-12">
      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-2xl shadow-[#0f4d2b]/20 border border-[#0f4d2b]/10">

        {/* LEFT PANEL */}
        <div className="hidden lg:flex lg:w-[42%] flex-col justify-center gap-8 p-10 bg-[#0a2e18]">
          <div className="animate-fade-up">
            <Image src="/serbisyo360-logo.png" alt="Serbisyo360" width={80} height={80} className="mb-4 drop-shadow-2xl" />
            <h1 className="font-display text-3xl font-bold text-white leading-tight">
              Serbisyo<span className="text-[#a8e6bf]">360</span>
            </h1>
            <p className="text-white/50 text-sm mt-1">Registry · Verification · Accountability</p>
          </div>

          <div className="animate-fade-up delay-1">
            <h2 className="font-display text-2xl font-bold text-white leading-snug mb-3">
              Join the Serbisyo360<br />
              <span className="italic text-[#a8e6bf]">Extension Team</span>
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Help bridge the gap between workers and the community through transparent, trusted service.
            </p>
            <ul className="mt-5 space-y-3">
              {[
                { step: "01", text: "Fill in your registration details" },
                { step: "02", text: "Wait for LGU admin verification" },
                { step: "03", text: "Receive your unique QR code" },
                { step: "04", text: "Start collecting verified reviews" },
              ].map(({ step: s, text }) => (
                <li key={s} className="flex items-center gap-3 text-xs text-white/60">
                  <span className="w-6 h-6 rounded-full bg-white/8 border border-white/15 flex items-center justify-center text-[10px] font-bold text-[#a8e6bf] shrink-0 font-display">{s}</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 bg-white flex items-center justify-center p-8 lg:p-10">
          <div className="w-full max-w-md animate-fade-in">

            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-3 mb-6">
              <Image src="/serbisyo360-logo.png" alt="Serbisyo360" width={40} height={40} />
              <span className="font-display text-xl font-bold text-[#0f4d2b]">Serbisyo<span className="text-[#1a7a45]">360</span></span>
            </div>

            {/* Tab switcher */}
            <div className="bg-[#0f4d2b] rounded-xl p-1 flex gap-1 mb-6">
              <Link href="/register/lgu" className="flex-1 text-xs font-semibold py-2 px-3 rounded-lg text-white/60 hover:text-white text-center transition-colors">🏛 LGU Admin</Link>
              <div className="flex-1 text-xs font-semibold py-2 px-3 rounded-lg bg-white text-[#0f4d2b] text-center shadow">👷 Local Worker</div>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-6">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step > s ? "bg-[#0f4d2b] text-white" : step === s ? "bg-[#0f4d2b] text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    {step > s ? <Check size={12} /> : s}
                  </div>
                  <span className={`text-xs font-medium ${step === s ? "text-[#0f4d2b]" : "text-gray-400"}`}>
                    {s === 1 ? "Personal Info" : "Work Details"}
                  </span>
                  {s < 2 && <div className={`flex-1 h-0.5 w-8 ${step > s ? "bg-[#0f4d2b]" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#0a2e18]">Personal Information</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Step 1 of 2 — Your basic details and account security</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Full Name</label>
                  <input
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] ${errors.fullName ? "border-red-400" : "border-gray-200"}`}
                    placeholder="Your complete name"
                    value={form.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                  />
                  {errors.fullName && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><XCircle size={11} />{errors.fullName}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email Address</label>
                  <input
                    type="email"
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] ${errors.email ? "border-red-400" : "border-gray-200"}`}
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                  {errors.email && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><XCircle size={11} />{errors.email}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Phone Number</label>
                  <input
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] ${errors.phone ? "border-red-400" : "border-gray-200"}`}
                    placeholder="+63 9XX XXX XXXX"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                  {errors.phone && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><XCircle size={11} />{errors.phone}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] pr-10 ${errors.password ? "border-red-400" : "border-gray-200"}`}
                      placeholder="Create a strong password"
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {form.password && (
                    <div className="mt-2 space-y-1.5">
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map((i) => (
                          <div key={i} className="flex-1 h-1 rounded-full transition-all" style={{ backgroundColor: i <= pwStrength.score ? pwStrength.color : "#e5e7eb" }} />
                        ))}
                        <span className="text-[10px] font-semibold ml-1" style={{ color: pwStrength.color }}>{pwStrength.label}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {pwStrength.checks.map((c) => (
                          <div key={c.label} className={`flex items-center gap-1 text-[10px] ${c.passed ? "text-green-600" : "text-gray-400"}`}>
                            {c.passed ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                            {c.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {errors.password && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><XCircle size={11} />{errors.password}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] pr-10 ${errors.confirm ? "border-red-400" : form.confirm && form.confirm === form.password ? "border-green-400" : "border-gray-200"}`}
                      placeholder="Repeat your password"
                      value={form.confirm}
                      onChange={(e) => set("confirm", e.target.value)}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    {form.confirm && form.confirm === form.password && (
                      <CheckCircle2 size={15} className="absolute right-9 top-1/2 -translate-y-1/2 text-green-500" />
                    )}
                  </div>
                  {errors.confirm && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><XCircle size={11} />{errors.confirm}</p>}
                </div>

                <button
                  onClick={handleNext}
                  className="w-full bg-[#0f4d2b] text-white font-semibold py-2.5 rounded-xl hover:bg-[#1a7a45] transition-all flex items-center justify-center gap-2 shadow-lg text-sm mt-2"
                >
                  Next
                </button>

                <p className="text-center text-xs text-gray-500">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#0f4d2b] font-semibold hover:underline">Log in</Link>
                </p>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#0a2e18]">Work Details</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Step 2 of 2 — Your assignment and specialization</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Specialization</label>
                  <div className="relative">
                    <select
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] appearance-none ${errors.specialization ? "border-red-400" : "border-gray-200"}`}
                      value={form.specialization}
                      onChange={(e) => set("specialization", e.target.value)}
                    >
                      <option value="">Select specialization</option>
                      {SPECIALIZATIONS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.specialization && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><XCircle size={11} />{errors.specialization}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Municipality</label>
                    <div className="relative">
                      <select
                        className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] appearance-none ${errors.municipality ? "border-red-400" : "border-gray-200"}`}
                        value={form.municipality}
                        onChange={(e) => set("municipality", e.target.value)}
                      >
                        <option value="">Select area</option>
                        {MUNICIPALITIES.map((m) => <option key={m}>{m}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.municipality && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><XCircle size={11} />{errors.municipality}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Barangay</label>
                    <div className="relative">
                      <select
                        className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] appearance-none ${errors.barangay ? "border-red-400" : "border-gray-200"}`}
                        value={form.barangay}
                        onChange={(e) => set("barangay", e.target.value)}
                      >
                        <option value="">Select barangay</option>
                        {BARANGAYS.map((b) => <option key={b}>{b}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.barangay && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><XCircle size={11} />{errors.barangay}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                    About / Designation <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] resize-none"
                    rows={3}
                    placeholder="Brief description of your role or experience"
                    value={form.about}
                    onChange={(e) => set("about", e.target.value)}
                  />
                </div>

                <div className="bg-[#f0faf4] border border-[#0f4d2b]/15 rounded-xl p-3">
                  <p className="text-[11px] text-[#3d6b4f] leading-relaxed">
                    Your profile will be reviewed and verified by your LGU administrator before your QR code is issued. Your phone number is encrypted and never shared publicly.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 border border-[#0f4d2b]/20 text-[#0f4d2b] font-semibold py-2.5 rounded-xl hover:bg-[#0f4d2b]/5 transition-all text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#0f4d2b] text-white font-semibold py-2.5 rounded-xl hover:bg-[#1a7a45] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 text-sm"
                  >
                    {loading
                      ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <><Users size={14} />Register as Worker</>
                    }
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}