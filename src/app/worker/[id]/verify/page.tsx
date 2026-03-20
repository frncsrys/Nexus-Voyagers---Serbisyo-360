"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, ChevronLeft, XCircle, Mail } from "lucide-react";
import PublicNav from "@/components/shared/PublicNav";

export default function OTPVerifyPage() {
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get("phone") || "";
  const maskedPhone = phone.replace(
    /^(\+63|0)(\d{3})(\d{3,4})(\d{3,4})$/,
    (_, code, a, b, c) => `${code} ${a} **** ${c}`
  );

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [sessionTimer, setSessionTimer] = useState(30 * 60);
  const [useEmail, setUseEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setResendTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTimer((t) => {
        if (t <= 1) { clearInterval(interval); router.push("/worker/expired"); }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [router]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");
    if (value && index < 5) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      refs.current[5]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter all 6 digits of the OTP code"); return; }
    setLoading(true);
    // TODO: call POST /api/otp/verify with code, phone, workerId
    setTimeout(() => {
      setLoading(false);
      if (code === "000000") router.push("/worker/already-reviewed");
      else router.push("/worker/success");
    }, 1200);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(60);
    setOtp(["", "", "", "", "", ""]);
    refs.current[0]?.focus();
    // TODO: call POST /api/otp/resend
  };

  const handleEmailOtp = () => {
    if (!email.trim()) { setEmailError("Email address is required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError("Enter a valid email address"); return; }
    setEmailError("");
    // TODO: call POST /api/otp/send-email
  };

  const sessionPct = (sessionTimer / (30 * 60)) * 100;

  return (
    <div className="min-h-screen bg-[#f7f9f5] flex flex-col">
      <PublicNav rightLabel="OTP Verification" />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-4 animate-fade-up">

          {/* Session timer */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-medium">Session expires in</span>
              <span className={`text-sm font-bold font-display ${sessionTimer < 300 ? "text-red-500" : "text-[#0f4d2b]"}`}>
                {formatTime(sessionTimer)}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${sessionPct}%`,
                  backgroundColor: sessionTimer < 300 ? "#dc2626" : "#0f4d2b"
                }}
              />
            </div>
          </div>

          {/* OTP Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#0f4d2b] transition-colors mb-5"
            >
              <ChevronLeft size={14} /> Back to review form
            </button>

            <div className="w-14 h-14 rounded-2xl bg-[#d4edda] flex items-center justify-center mb-4">
              <Shield size={24} className="text-[#0f4d2b]" />
            </div>

            <h2 className="font-display text-xl font-bold text-[#0a2e18] mb-1">Verify Your Number</h2>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Enter the 6-digit code sent to{" "}
              <span className="font-semibold text-[#0f4d2b]">{maskedPhone || "your phone"}</span>
            </p>

            {/* 6-digit OTP inputs */}
            <div className="flex gap-2 mb-3" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { refs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={`w-full aspect-square text-center text-xl font-bold font-display border-2 rounded-xl outline-none transition-all ${
                    error
                      ? "border-red-400 bg-red-50 text-red-600"
                      : digit
                        ? "border-[#0f4d2b] bg-[#f0faf4] text-[#0f4d2b]"
                        : "border-gray-200 bg-gray-50 focus:border-[#0f4d2b] focus:bg-white"
                  }`}
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-[11px] mb-4 flex items-center gap-1">
                <XCircle size={11} />{error}
              </p>
            )}

            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-[#0f4d2b] text-white font-semibold py-3 rounded-xl hover:bg-[#1a7a45] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 text-sm mb-4"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : "Confirm & Submit Review"
              }
            </button>

            {/* Resend */}
            <div className="text-center mb-5">
              {resendTimer > 0 ? (
                <p className="text-xs text-gray-400">
                  Resend code in <span className="font-semibold text-[#0f4d2b]">{resendTimer}s</span>
                </p>
              ) : (
                <button onClick={handleResend} className="text-xs font-semibold text-[#0f4d2b] hover:underline">
                  Resend OTP
                </button>
              )}
            </div>

            {/* Email fallback */}
            <div className="border-t border-gray-100 pt-4">
              <button
                onClick={() => { setUseEmail(!useEmail); setEmailError(""); }}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0f4d2b] transition-colors mx-auto"
              >
                <Mail size={13} />
                {useEmail ? "Use SMS instead" : "No signal? Use email OTP instead"}
              </button>

              {useEmail && (
                <div className="mt-3 space-y-2 animate-fade-in">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none bg-gray-50 focus:bg-white focus:border-[#0f4d2b] ${
                      emailError ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {emailError && (
                    <p className="text-red-500 text-[11px] flex items-center gap-1">
                      <XCircle size={11} />{emailError}
                    </p>
                  )}
                  <button
                    onClick={handleEmailOtp}
                    className="w-full bg-[#f0faf4] border border-[#0f4d2b]/20 text-[#0f4d2b] font-semibold py-2.5 rounded-xl text-xs hover:bg-[#d4edda] transition-colors"
                  >
                    Send OTP to Email
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-gray-400">
            Powered by <span className="font-semibold text-[#0f4d2b]">Serbisyo360</span> · Data Privacy Act Compliant
          </p>
        </div>
      </div>
    </div>
  );
}