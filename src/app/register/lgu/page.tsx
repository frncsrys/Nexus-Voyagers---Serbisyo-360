"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ShieldCheck, ChevronDown, XCircle, CheckCircle2, Check } from "lucide-react";

const REGIONS = ["NCR","Region I","Region II","Region III","Region IV-A","Region IV-B","Region V","Region VI","Region VII","Region VIII","Region IX","Region X","Region XI","Region XII","Region XIII","BARMM","CAR"];
const PROVINCES = ["Metro Manila","Batangas","Bulacan","Cavite","Laguna","Pampanga","Rizal","Cebu","Davao del Sur","Iloilo"];

interface FormData { lguName:string; province:string; region:string; adminName:string; email:string; officeContact:string; address:string; password:string; confirm:string; }
interface Errors { [key: string]: string; }

function getPasswordStrength(pw: string) {
  const checks = [
    { label: "At least 8 characters", passed: pw.length >= 8 },
    { label: "Uppercase letter", passed: /[A-Z]/.test(pw) },
    { label: "Lowercase letter", passed: /[a-z]/.test(pw) },
    { label: "Number", passed: /[0-9]/.test(pw) },
    { label: "Special character (!@#$...)", passed: /[^A-Za-z0-9]/.test(pw) },
  ];
  const score = checks.filter((c) => c.passed).length;
  const label = score <= 1 ? "Weak" : score <= 3 ? "Fair" : score === 4 ? "Good" : "Strong";
  const color = score <= 1 ? "#dc2626" : score <= 3 ? "#f59e0b" : score === 4 ? "#3b82f6" : "#16a34a";
  return { score, label, color, checks };
}

export default function LGURegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState<FormData>({ lguName:"", province:"", region:"", adminName:"", email:"", officeContact:"", address:"", password:"", confirm:"" });

  const set = (k: keyof FormData, v: string) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };
  const pwStrength = getPasswordStrength(form.password);

  const validateStep1 = (): boolean => {
    const e: Errors = {};
    if (!form.lguName.trim()) e.lguName = "LGU name is required";
    if (!form.province) e.province = "Province is required";
    if (!form.region) e.region = "Region is required";
    if (!form.adminName.trim()) e.adminName = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.officeContact.trim()) e.officeContact = "Contact number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = (): boolean => {
    const e: Errors = {};
    if (!form.password) e.password = "Password is required";
    else if (pwStrength.score < 3) e.password = "Password is too weak";
    if (!form.confirm) e.confirm = "Please confirm your password";
    else if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validateStep1()) setStep(2); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/register/lgu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setServerError(data.error || "Registration failed."); return; }
      setSubmitted(true);
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen auth-bg flex items-center justify-center p-6">
        <div className="bg-[#0f4d2b] rounded-2xl p-10 text-center max-w-sm w-full shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={32} className="text-[#a8e6bf]" /></div>
          <h2 className="font-display text-2xl font-bold text-white mb-2">Account Created!</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-6">Your LGU admin account has been created. You can now log in and start managing your workers.</p>
          <Link href="/login" className="block w-full bg-white text-[#0f4d2b] font-semibold py-2.5 rounded-xl text-sm text-center hover:bg-[#f0faf4] transition-all">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-6 py-12">
      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-2xl shadow-[#0f4d2b]/20 border border-[#0f4d2b]/10">
        <div className="hidden lg:flex lg:w-[42%] flex-col justify-center gap-8 p-10 bg-[#0a2e18]">
          <div className="animate-fade-up">
            <Image src="/serbisyo360-logo.png" alt="Serbisyo360" width={80} height={80} className="mb-4 drop-shadow-2xl" />
            <h1 className="font-display text-3xl font-bold text-white leading-tight">Serbisyo<span className="text-[#a8e6bf]">360</span></h1>
            <p className="text-white/50 text-sm mt-1">Registry · Verification · Accountability</p>
          </div>
          <div className="animate-fade-up delay-1">
            <h2 className="font-display text-2xl font-bold text-white leading-snug mb-3">Register as an<br /><span className="italic text-[#a8e6bf]">LGU Administrator</span></h2>
            <ul className="mt-5 space-y-2">
              {["Manage and verify worker profiles","Access LGU analytics dashboard","Export workforce data for deployment","Receive OTP-verified public feedback"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-white/60"><ShieldCheck size={13} className="text-[#a8e6bf] shrink-0" />{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-1 bg-white flex items-center justify-center p-8 lg:p-10">
          <div className="w-full max-w-md animate-fade-in">
            <div className="lg:hidden flex items-center gap-3 mb-6">
              <Image src="/serbisyo360-logo.png" alt="Serbisyo360" width={40} height={40} />
              <span className="font-display text-xl font-bold text-[#0f4d2b]">Serbisyo<span className="text-[#1a7a45]">360</span></span>
            </div>
            <div className="bg-[#0f4d2b] rounded-xl p-1 flex gap-1 mb-6">
              <div className="flex-1 text-xs font-semibold py-2 px-3 rounded-lg bg-white text-[#0f4d2b] text-center shadow">🏛 LGU Admin</div>
              <Link href="/register/worker" className="flex-1 text-xs font-semibold py-2 px-3 rounded-lg text-white/60 hover:text-white text-center transition-colors">👷 Local Worker</Link>
            </div>
            <div className="flex items-center gap-3 mb-6">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step > s ? "bg-[#0f4d2b] text-white" : step === s ? "bg-[#0f4d2b] text-white" : "bg-gray-100 text-gray-400"}`}>
                    {step > s ? <Check size={12} /> : s}
                  </div>
                  <span className={`text-xs font-medium ${step === s ? "text-[#0f4d2b]" : "text-gray-400"}`}>{s === 1 ? "LGU Details" : "Set Password"}</span>
                  {s < 2 && <div className={`flex-1 h-0.5 w-8 ${step > s ? "bg-[#0f4d2b]" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                <XCircle size={14} className="text-red-500 shrink-0" />
                <p className="text-red-600 text-xs">{serverError}</p>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div><h2 className="font-display text-xl font-bold text-[#0a2e18]">LGU Information</h2><p className="text-xs text-gray-500 mt-0.5">Step 1 of 2 — Your LGU and admin details</p></div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">LGU Name</label>
                  <input className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] ${errors.lguName ? "border-red-400" : "border-gray-200"}`} placeholder="e.g. City of Manila" value={form.lguName} onChange={(e) => set("lguName", e.target.value)} />
                  {errors.lguName && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><XCircle size={11} />{errors.lguName}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Province</label>
                    <div className="relative">
                      <select className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] appearance-none ${errors.province ? "border-red-400" : "border-gray-200"}`} value={form.province} onChange={(e) => set("province", e.target.value)}>
                        <option value="">Select province</option>{PROVINCES.map((p) => <option key={p}>{p}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.province && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><XCircle size={11} />{errors.province}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Region</label>
                    <div className="relative">
                      <select className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] appearance-none ${errors.region ? "border-red-400" : "border-gray-200"}`} value={form.region} onChange={(e) => set("region", e.target.value)}>
                        <option value="">Select region</option>{REGIONS.map((r) => <option key={r}>{r}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.region && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><XCircle size={11} />{errors.region}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Admin Full Name</label>
                  <input className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] ${errors.adminName ? "border-red-400" : "border-gray-200"}`} placeholder="Your full name" value={form.adminName} onChange={(e) => set("adminName", e.target.value)} />
                  {errors.adminName && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><XCircle size={11} />{errors.adminName}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Government Email Address</label>
                  <input type="email" className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] ${errors.email ? "border-red-400" : "border-gray-200"}`} placeholder="admin@lgu.gov.ph" value={form.email} onChange={(e) => set("email", e.target.value)} />
                  {errors.email && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><XCircle size={11} />{errors.email}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Office Contact Number</label>
                  <input className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] ${errors.officeContact ? "border-red-400" : "border-gray-200"}`} placeholder="+63 2 XXXX XXXX" value={form.officeContact} onChange={(e) => set("officeContact", e.target.value)} />
                  {errors.officeContact && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><XCircle size={11} />{errors.officeContact}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Office / Address <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b]" placeholder="Department or office address" value={form.address} onChange={(e) => set("address", e.target.value)} />
                </div>
                <button onClick={handleNext} className="w-full bg-[#0f4d2b] text-white font-semibold py-2.5 rounded-xl hover:bg-[#1a7a45] transition-all flex items-center justify-center gap-2 shadow-lg text-sm mt-2">Next</button>
                <p className="text-center text-xs text-gray-500">Already have an account?{" "}<Link href="/login" className="text-[#0f4d2b] font-semibold hover:underline">Log in</Link></p>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                <div><h2 className="font-display text-xl font-bold text-[#0a2e18]">Set Your Password</h2><p className="text-xs text-gray-500 mt-0.5">Step 2 of 2 — Secure your account</p></div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] pr-10 ${errors.password ? "border-red-400" : "border-gray-200"}`} placeholder="Create a strong password" value={form.password} onChange={(e) => set("password", e.target.value)} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                  </div>
                  {form.password && (
                    <div className="mt-2 space-y-1.5">
                      <div className="flex gap-1 items-center">
                        {[1,2,3,4,5].map((i) => (<div key={i} className="flex-1 h-1 rounded-full transition-all" style={{ backgroundColor: i <= pwStrength.score ? pwStrength.color : "#e5e7eb" }} />))}
                        <span className="text-[10px] font-semibold ml-1" style={{ color: pwStrength.color }}>{pwStrength.label}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {pwStrength.checks.map((c) => (
                          <div key={c.label} className={`flex items-center gap-1 text-[10px] ${c.passed ? "text-green-600" : "text-gray-400"}`}>
                            {c.passed ? <CheckCircle2 size={10} /> : <XCircle size={10} />}{c.label}
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
                    <input type={showConfirm ? "text" : "password"} className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] pr-10 ${errors.confirm ? "border-red-400" : form.confirm && form.confirm === form.password ? "border-green-400" : "border-gray-200"}`} placeholder="Repeat your password" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                  </div>
                  {errors.confirm && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><XCircle size={11} />{errors.confirm}</p>}
                </div>
                <div className="bg-[#f0faf4] border border-[#0f4d2b]/15 rounded-xl p-3">
                  <p className="text-[11px] text-[#3d6b4f] leading-relaxed">Your account is activated immediately for demo purposes.</p>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 border border-[#0f4d2b]/20 text-[#0f4d2b] font-semibold py-2.5 rounded-xl hover:bg-[#0f4d2b]/5 transition-all text-sm">← Back</button>
                  <button type="submit" disabled={loading} className="flex-1 bg-[#0f4d2b] text-white font-semibold py-2.5 rounded-xl hover:bg-[#1a7a45] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 text-sm">
                    {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Register as LGU Admin"}
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
