"use client";

import Image from "next/image";
import Link from "next/link";
import { Shield } from "lucide-react";

interface PublicNavProps {
  rightLabel?: string;
}

export default function PublicNav({ rightLabel = "Verified Platform" }: PublicNavProps) {
  // TODO: replace with real auth session
  const isLoggedIn = false;
  const userRole: "lgu" | "worker" | null = null;

  const logoHref = isLoggedIn
    ? userRole === "lgu"
      ? "/lgu/dashboard"
      : userRole === "worker"
      ? "/worker/dashboard"
      : "/"
    : "/";

  return (
    <div className="bg-[#0f4d2b] text-white py-4 px-6 flex items-center justify-between shadow-lg">
      <Link
        href={logoHref}
        className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
      >
        <Image
          src="/serbisyo360-logo.png"
          alt="Serbisyo360"
          width={36}
          height={36}
          className="drop-shadow"
        />
        <span className="font-display font-bold text-base">
          Serbisyo<span className="text-[#a8e6bf]">360</span>
        </span>
      </Link>
      <div className="flex items-center gap-1.5 text-xs text-white/70">
        <Shield size={14} className="text-[#a8e6bf]" />
        {rightLabel}
      </div>
    </div>
  );
}