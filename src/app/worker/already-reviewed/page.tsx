"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import PublicNav from "@/components/shared/PublicNav";

export default function AlreadyReviewedPage() {
  return (
    <div className="min-h-screen bg-[#f7f9f5] flex flex-col">
      <PublicNav rightLabel="Review Status" />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-up">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">

            {/* Icon */}
            <div className="w-24 h-24 rounded-full bg-amber-50 border-4 border-amber-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
              <AlertCircle size={40} className="text-amber-500" />
            </div>

            <h1 className="font-display text-2xl font-bold text-[#0a2e18] mb-2">
              Already Reviewed
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Our records show that a verified review was previously submitted from this phone number for{" "}
              <span className="font-semibold text-[#0f4d2b]">Jane Doe</span>. Each phone number can only submit one review per worker.
            </p>

            {/* Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs text-amber-700 leading-relaxed">
                🔒 This policy prevents spam and ensures that every review on Serbisyo360 reflects a genuine service experience. Your previous review has already been counted.
              </p>
            </div>

            <Link
              href="/worker/worker-001"
              className="flex items-center justify-center gap-2 w-full bg-[#0f4d2b] text-white font-semibold py-2.5 rounded-xl hover:bg-[#1a7a45] transition-colors text-sm shadow-lg"
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