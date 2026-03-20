"use client";

import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import PublicNav from "@/components/shared/PublicNav";

export default function AlreadyReviewedPage() {
  const params = useSearchParams();
  const workerName = params.get("worker") || "this worker";
  return (
    <div className="min-h-screen bg-[#f7f9f5] flex flex-col">
      <PublicNav rightLabel="Review Submitted"/>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center animate-fade-up">
          <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-5">
            <AlertCircle size={40} className="text-amber-500"/>
          </div>
          <h1 className="font-display text-2xl font-bold text-[#0a2e18] mb-2">You have already reviewed this worker</h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">Our records show that a verified review was previously submitted from this phone number for {workerName}. Each phone number can only submit one review per worker.</p>
          <Link href="/" className="inline-flex items-center justify-center border border-[#0f4d2b]/20 text-[#0f4d2b] font-semibold py-3 px-6 rounded-xl hover:bg-[#f0faf4] transition-colors text-sm">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
