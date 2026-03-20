"use client";

import { Clock } from "lucide-react";
import PublicNav from "@/components/shared/PublicNav";

export default function ExpiredSessionPage() {
  return (
    <div className="min-h-screen bg-[#f7f9f5] flex flex-col">
      <PublicNav rightLabel="Session Expired" />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-up">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">

            {/* Icon */}
            <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-gray-200 flex items-center justify-center mx-auto mb-6">
              <Clock size={40} className="text-gray-400" />
            </div>

            <h1 className="font-display text-2xl font-bold text-[#0a2e18] mb-2">
              Session Expired
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              The review link generated from this QR code is only valid for{" "}
              <span className="font-semibold text-[#0f4d2b]">30 minutes</span>. Please ask the extension worker to show their QR code again to start a new session.
            </p>

            {/* Info card */}
            <div className="bg-[#f7f9f5] border border-gray-200 rounded-xl p-5 mb-6 text-left space-y-3">
              <p className="text-xs font-semibold text-gray-600">Why does the session expire?</p>
              <div className="flex items-start gap-2 text-xs text-gray-500">
                <Clock size={13} className="text-[#0f4d2b] shrink-0 mt-0.5" />
                <span>Sessions are limited to 30 minutes to prevent unauthorized or delayed review submissions.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-500">
                <Clock size={13} className="text-[#0f4d2b] shrink-0 mt-0.5" />
                <span>Simply ask the worker to display their QR code again and scan it fresh to start a new session.</span>
              </div>
            </div>

            {/* Security notice */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-400 leading-relaxed">
                For security reasons, expired sessions cannot be restarted from this page. Please scan the worker's QR code again.
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Powered by <span className="font-semibold text-[#0f4d2b]">Serbisyo360</span> · Data Privacy Act Compliant
          </p>
        </div>
      </div>
    </div>
  );
}