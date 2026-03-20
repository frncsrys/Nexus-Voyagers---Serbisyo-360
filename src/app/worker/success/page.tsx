"use client";

import Link from "next/link";
import { CheckCircle2, Star, ArrowLeft } from "lucide-react";
import PublicNav from "@/components/shared/PublicNav";

export default function ReviewSuccessPage() {
  return (
    <div className="min-h-screen bg-[#f7f9f5] flex flex-col">
      <PublicNav rightLabel="Review Submitted" />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-up">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">

            {/* Success icon */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-[#d4edda]" />
              <div className="relative w-24 h-24 rounded-full bg-[#0f4d2b] flex items-center justify-center shadow-xl shadow-[#0f4d2b]/20">
                <CheckCircle2 size={40} className="text-white" />
              </div>
            </div>

            <h1 className="font-display text-2xl font-bold text-[#0a2e18] mb-2">
              Thank You for Your Feedback!
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-2">
              Your review has been verified and recorded. It is now part of{" "}
              <span className="font-semibold text-[#0f4d2b]">Jane Doe</span>'s official service profile.
            </p>

            {/* Stars */}
            <div className="flex justify-center gap-1 my-5">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={22} className="fill-[#f4c430] text-[#f4c430]" />
              ))}
            </div>

            {/* Info checklist */}
            <div className="bg-[#f7f9f5] rounded-xl p-4 mb-6 text-left space-y-3">
              {[
                { text: <>Your review is <span className="font-semibold text-[#0f4d2b]">OTP verified</span> and spam-free</> },
                { text: <>Your phone number is <span className="font-semibold text-[#0f4d2b]">encrypted</span> and never shared</> },
                { text: <>Feedback is now <span className="font-semibold text-[#0f4d2b]">visible</span> on the LGU dashboard</> },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle2 size={14} className="text-[#0f4d2b] shrink-0" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            <Link
              href="/worker/worker-001"
              className="flex items-center justify-center gap-2 w-full border border-[#0f4d2b]/20 text-[#0f4d2b] font-semibold py-2.5 rounded-xl hover:bg-[#0f4d2b]/5 transition-colors text-sm"
            >
              <ArrowLeft size={14} />
              Return to Worker Profile
            </Link>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Powered by <span className="font-semibold text-[#0f4d2b]">Serbisyo360</span> · Data Privacy Act Compliant
          </p>
        </div>
      </div>
    </div>
  );
}