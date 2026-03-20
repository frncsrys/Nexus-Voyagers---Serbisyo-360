"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2, XCircle } from "lucide-react";

type Step = "email" | "sent";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    if (!email.trim()) { setError("Email address is required"); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // TODO: call POST /api/auth/forgot-password with email
    setTimeout(() => {
      setLoading(false);
      setStep("sent");
    }, 1200);
  };

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-6">
      <div className="w-full max-w-sm animate-fade-up">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <Image src="/serbisyo360-logo.png" alt="Serbisyo360" width={48} height={48} />
            <span className="font-display font-bold text-[#0f4d2b] text-xl">
              Serbisyo<span className="text-[#1a7a45]">360</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#0f4d2b]/10 p-8">

          {step === "email" && (
            <>
              <div className="w-14 h-14 rounded-2xl bg-[#d4edda] flex items-center justify-center mb-5">
                <Mail size={24} className="text-[#0f4d2b]" />
              </div>

              <h1 className="font-display text-2xl font-bold text-[#0a2e18] mb-1">
                Forgot Password?
              </h1>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                No worries. Enter your registered email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] ${
                      error ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {error && (
                    <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                      <XCircle size={11} />{error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0f4d2b] text-white font-semibold py-2.5 rounded-xl hover:bg-[#1a7a45] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 text-sm"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Send Reset Link</>
                  )}
                </button>
              </form>
            </>
          )}

          {step === "sent" && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#0f4d2b] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#0f4d2b]/20">
                <CheckCircle2 size={32} className="text-white" />
              </div>
              <h2 className="font-display text-xl font-bold text-[#0a2e18] mb-2">
                Check Your Email
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed mb-2">
                We've sent a password reset link to
              </p>
              <p className="text-sm font-semibold text-[#0f4d2b] mb-5">{email}</p>
              <div className="bg-[#f7f9f5] rounded-xl p-4 mb-5 text-left space-y-2">
                {[
                  "Check your inbox for the reset link",
                  "The link is valid for 30 minutes",
                  "Check your spam folder if you don't see it",
                ].map((tip, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle2 size={12} className="text-[#0f4d2b] shrink-0" />
                    {tip}
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setStep("email"); setEmail(""); }}
                className="text-xs text-[#0f4d2b] font-semibold hover:underline"
              >
                Use a different email
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-5">
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#0f4d2b] transition-colors font-medium"
          >
            <ArrowLeft size={13} />Back to Login
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-3">
          Powered by <span className="font-semibold text-[#0f4d2b]">Serbisyo360</span>
        </p>
      </div>
    </div>
  );
}