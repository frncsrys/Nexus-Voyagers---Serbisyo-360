"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Star, MapPin, CheckCircle2, Calendar,
  Phone, XCircle, ChevronRight, Shield, QrCode
} from "lucide-react";
import Image from "next/image";
import PublicNav from "@/components/shared/PublicNav";

const MOCK_WORKER = {
  id: "worker-001",
  fullName: "Jane Doe",
  specialization: "Crop Production",
  municipality: "Quiapo",
  barangay: "Barangay 176",
  province: "Metro Manila",
  lguName: "City of Manila",
  rating: 4.7,
  totalReviews: 24,
  status: "verified",
  joinedAt: "March 19, 2026",
  avatarUrl: null as string | null,
};

interface ReviewForm {
  rating: number;
  comment: string;
  serviceDate: string;
  phone: string;
}

interface Errors { [key: string]: string; }

const RATING_LABELS: Record<number, string> = {
  1: "Poor", 2: "Fair", 3: "Good", 4: "Very Good", 5: "Excellent"
};

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            size={36}
            className={`transition-colors ${
              s <= (hovered || value)
                ? "fill-[#f4c430] text-[#f4c430]"
                : "fill-gray-100 text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function WorkerProfilePage() {
  const router = useRouter();
  const worker = MOCK_WORKER;

  const [form, setForm] = useState<ReviewForm>({
    rating: 0, comment: "", serviceDate: "", phone: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sendingOtp, setSendingOtp] = useState(false);

  const set = (k: keyof ReviewForm, v: string | number) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString().split("T")[0];

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.rating) e.rating = "Please select a star rating";
    if (!form.comment.trim()) e.comment = "Please write a comment";
    else if (form.comment.length > 300) e.comment = "Comment must be 300 characters or less";
    if (!form.serviceDate) e.serviceDate = "Please select the service date";
    else if (form.serviceDate > today) e.serviceDate = "Service date cannot be in the future";
    else if (form.serviceDate < thirtyDaysAgo) e.serviceDate = "Service date cannot be more than 30 days ago";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^(\+63|0)[0-9]{9,10}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Enter a valid Philippine mobile number (+63 or 09XX)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSendOtp = () => {
    if (!validate()) return;
    setSendingOtp(true);
    // TODO: call POST /api/otp/send with form.phone and worker.id
    setTimeout(() => {
      setSendingOtp(false);
      router.push(`/worker/${worker.id}/verify?phone=${encodeURIComponent(form.phone)}`);
    }, 1200);
  };

  const initials = worker.fullName.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <div className="min-h-screen bg-[#f7f9f5]">
      <PublicNav rightLabel="Verified Platform" />

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* Worker Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-fade-up">
            {/* Green header banner */}
            <div className="bg-[#0f4d2b] h-28 rounded-t-2xl relative">
                <div className="absolute inset-0 rounded-t-2xl opacity-10" style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "20px 20px"
                }} />
            </div>

            <div className="px-6 pb-6 -mt-10 relative">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0f4d2b] to-[#1a7a45] flex items-center justify-center text-white font-display font-bold text-2xl shadow-lg border-4 border-white mb-3">
                    {worker.avatarUrl
                        ? <Image src={worker.avatarUrl} alt={worker.fullName} width={80} height={80} className="rounded-2xl" />
                        : initials
                    }
                </div>

                {/* Verified badge */}
                <div className="inline-flex items-center gap-1.5 bg-[#d4edda] text-[#0f4d2b] text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
                    <CheckCircle2 size={12} />
                    Verified by {worker.lguName}
                </div>

                <h1 className="font-display text-2xl font-bold text-[#0a2e18] mb-1">{worker.fullName}</h1>
                <p className="text-sm font-semibold text-[#1a7a45] mb-3">{worker.specialization}</p>

                <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#1a7a45]" />
                        {worker.barangay}, {worker.municipality}, {worker.province}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#1a7a45]" />
                        Registered {worker.joinedAt}
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-[#f7f9f5] rounded-xl">
                    <div className="text-center">
                        <p className="font-display text-3xl font-bold text-[#0f4d2b]">{worker.rating}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">out of 5</p>
                    </div>
                    <div>
                        <div className="flex gap-0.5 mb-1">
                        {[1,2,3,4,5].map((s) => (
                            <Star key={s} size={16} className={s <= Math.round(worker.rating) ? "fill-[#f4c430] text-[#f4c430]" : "fill-gray-200 text-gray-200"} />
                        ))}
                        </div>
                        <p className="text-xs text-gray-500">{worker.totalReviews} verified reviews</p>
                    </div>
                </div>
            </div>
        </div>

        {/* QR Notice */}
        <div className="bg-[#0f4d2b]/5 border border-[#0f4d2b]/15 rounded-xl p-4 flex items-start gap-3 animate-fade-up delay-1">
          <QrCode size={20} className="text-[#0f4d2b] shrink-0 mt-0.5" />
          <p className="text-xs text-[#3d6b4f] leading-relaxed">
            <span className="font-semibold">QR Code Verified.</span> You scanned this worker's official Serbisyo360 QR code. This review session is valid for 30 minutes.
          </p>
        </div>

        {/* Review Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-up delay-2">
          <h2 className="font-display text-xl font-bold text-[#0a2e18] mb-1">Leave a Review</h2>
          <p className="text-xs text-gray-500 mb-6">
            Share your experience with {worker.fullName}'s service. Your feedback helps the community.
          </p>

          <div className="space-y-5">
            {/* Star rating */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-3 block">Your Rating</label>
              <StarRating value={form.rating} onChange={(v) => set("rating", v)} />
              {form.rating > 0 && (
                <p className="text-xs text-[#1a7a45] font-semibold mt-2">{RATING_LABELS[form.rating]}</p>
              )}
              {errors.rating && (
                <p className="text-red-500 text-[11px] mt-1.5 flex items-center gap-1">
                  <XCircle size={11} />{errors.rating}
                </p>
              )}
            </div>

            {/* Comment */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                Your Comment
                <span className={`font-normal ml-1 ${form.comment.length > 280 ? "text-red-400" : "text-gray-400"}`}>
                  ({form.comment.length}/300)
                </span>
              </label>
              <textarea
                rows={4}
                placeholder="Describe the service you received..."
                value={form.comment}
                onChange={(e) => set("comment", e.target.value)}
                maxLength={300}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] resize-none ${
                  errors.comment ? "border-red-400" : "border-gray-200"
                }`}
              />
              {errors.comment && (
                <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                  <XCircle size={11} />{errors.comment}
                </p>
              )}
            </div>

            {/* Service date */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Date of Service</label>
              <input
                type="date"
                max={today}
                min={thirtyDaysAgo}
                value={form.serviceDate}
                onChange={(e) => set("serviceDate", e.target.value)}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] ${
                  errors.serviceDate ? "border-red-400" : "border-gray-200"
                }`}
              />
              {errors.serviceDate && (
                <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                  <XCircle size={11} />{errors.serviceDate}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                <Phone size={12} />
                Phone Number for OTP Verification
              </label>
              <input
                type="tel"
                placeholder="+63 9XX XXX XXXX"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-gray-50 focus:bg-white focus:border-[#0f4d2b] ${
                  errors.phone ? "border-red-400" : "border-gray-200"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                  <XCircle size={11} />{errors.phone}
                </p>
              )}
              <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                <Shield size={10} />
                Your phone number is encrypted and will never be shared or displayed publicly.
              </p>
            </div>

            <button
              onClick={handleSendOtp}
              disabled={sendingOtp}
              className="w-full bg-[#0f4d2b] text-white font-semibold py-3 rounded-xl hover:bg-[#1a7a45] transition-all flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5 disabled:opacity-60 text-sm"
            >
              {sendingOtp ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Send OTP & Verify <ChevronRight size={15} /></>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 pb-4">
          Powered by <span className="font-semibold text-[#0f4d2b]">Serbisyo360</span> · Data Privacy Act Compliant
        </p>
      </div>
    </div>
  );
}