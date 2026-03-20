"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, ChevronRight, XCircle } from "lucide-react";

type Role = "lgu" | "worker";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("lgu");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; server?: string }>({});

  const validate = (): boolean => {
    const e: { email?: string; password?: string } = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setErrors({ server: data.error || "Login failed." }); return; }
      if (data.role === "lgu_admin") router.push("/lgu/dashboard");
      else router.push("/worker/dashboard");
    } catch {
      setErrors({ server: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-6">
      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-2xl shadow-[#0f4d2b]/20 border border-[#0f4d2b]/10">
        <div className="hidden lg:flex lg:w-[45%] flex-col justify-center gap-8 p-10 bg-[#0a2e18]">
          <div className="animate-fade-up">
            <Link href="/" className="hover:opacity-80 transition-opacity inline-block">
              <Image src="/serbisyo360-logo.png" alt="Serbisyo360" width={80} height={80} className="mb-4 drop-shadow-2xl" />
            </Link>
            <h1 className="font-display text-3xl font-bold text-white leading-tight">Serbisyo<span className="text-[#a8e6bf]">360</span></h1>
            <p className="text-white/50 text-sm mt-1">Registry · Verification · Accountability</p>
          </div>
          <div className="animate-fade-up delay-1">
            <h2 className="font-display text-2xl font-bold text-white leading-snug mb-3">Let's Build a<br /><span className="italic text-[#a8e6bf]">Smarter Community</span></h2>
            <p className="text-white/60 text-sm leading-relaxed">Log in to your verified account to manage local services or oversee your LGU registry with confidence.</p>
            <div className="flex flex-wrap gap-2 mt-5">
              {["OTP-Verified Reviews", "LGU Managed", "Anti-Spam Protection"].map((f) => (
                <span key={f} className="text-xs bg-white/8 border border-white/10 text-white/70 px-3 py-1.5 rounded-full">{f}</span>
              ))}
            </div>
          </div>
          <div className="animate-fade-up delay-2">
            <p className="text-white/40 text-xs">Don't have an account?{" "}<Link href="/register/lgu" className="text-[#a8e6bf] hover:text-white transition-colors font-medium">Register here</Link></p>
          </div>
        </div>

        <div className="flex-1 bg-white flex items-center justify-center p-8 lg:p-10">
          <div className="w-full max-w-sm animate-fade-in">
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <Link href="/"><Image src="/serbisyo360-logo.png" alt="Serbisyo360" width={44} height={44} /></Link>
              <span className="font-display text-xl font-bold text-[#0f4d2b]">Serbisyo<span className="text-[#1a7a45]">360</span></span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[#0a2e18] mb-1">Welcome back</h2>
            <p className="text-sm text-gray-500 mb-6">Sign in to your account to continue</p>
            <div className="bg-[#0f4d2b] rounded-xl p-1 flex gap-1 mb-6">
              {(["lgu", "worker"] as Role[]).map((r) => (
                <button key={r} onClick={() => { setRole(r); setErrors({}); }}
                  className={`flex-1 text-xs font-semibold py-2 px-3 rounded-lg transition-all duration-200 ${role === r ? "bg-white text-[#0f4d2b] shadow" : "text-white/60 hover:text-white"}`}>
                  {r === "lgu" ? "🏛 LGU Admin" : "👷 Local Worker"}
                </button>
              ))}
            </div>
            {errors.server && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                <XCircle size={14} className="text-red-500 shrink-0" />
                <p className="text-red-600 text-xs">{errors.server}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{role === "lgu" ? "Government Email Address" : "Email Address"}</label>
                <input type="email" placeholder={role === "lgu" ? "admin@lgu.gov.ph" : "worker@email.com"} value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] ${errors.email ? "border-red-400" : "border-gray-200"}`} />
                {errors.email && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><XCircle size={11} />{errors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] pr-10 ${errors.password ? "border-red-400" : "border-gray-200"}`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><XCircle size={11} />{errors.password}</p>}
              </div>
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-xs text-[#0f4d2b] hover:underline font-medium">Forgot password?</Link>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-[#0f4d2b] text-white font-semibold py-2.5 rounded-xl hover:bg-[#1a7a45] transition-all flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5 disabled:opacity-60 text-sm">
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><LogIn size={15} />Log In</>}
              </button>
            </form>
            <div className="mt-6 space-y-2">
              <p className="text-xs text-center text-gray-400">Don't have an account?</p>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/register/lgu" className="flex items-center justify-center gap-1 text-xs font-medium text-[#0f4d2b] border border-[#0f4d2b]/20 py-2 px-3 rounded-lg hover:bg-[#0f4d2b]/5 transition-colors">Register as LGU <ChevronRight size={12} /></Link>
                <Link href="/register/worker" className="flex items-center justify-center gap-1 text-xs font-medium text-[#0f4d2b] border border-[#0f4d2b]/20 py-2 px-3 rounded-lg hover:bg-[#0f4d2b]/5 transition-colors">Register as Worker <ChevronRight size={12} /></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
