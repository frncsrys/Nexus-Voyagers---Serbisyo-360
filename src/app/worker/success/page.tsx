"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import PublicNav from "@/components/shared/PublicNav";

export default function ReviewSuccessPage() {
  const params = useSearchParams();
  const workerId = params.get("workerId") || "";
  return (
    <div className="min-h-screen bg-[#f7f9f5] flex flex-col">
      <PublicNav rightLabel="Review Submitted"/>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center animate-fade-up">
          <div className="w-20 h-20 rounded-full bg-[#d4edda] flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={40} className="text-[#0f4d2b]"/>
          </div>
          <h1 className="font-display text-2xl font-bold text-[#0a2e18] mb-2">Thank you for your feedback</h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">Your review has been verified and recorded. It is now part of this worker's official service profile.</p>
          {workerId && (
            <Link href={`/worker/${workerId}`} className="inline-flex items-center justify-center bg-[#0f4d2b] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#1a7a45] transition-colors shadow-lg text-sm">
              Return to Profile
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
