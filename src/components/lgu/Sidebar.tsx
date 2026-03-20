"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, ClipboardCheck,
  BarChart3, LogOut, X
} from "lucide-react";
import { logout } from "@/lib/logout";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/lgu/dashboard" },
  { icon: BarChart3, label: "Analytics & Reports", href: "/lgu/analytics" },
  { icon: Users, label: "Manage Workers", href: "/lgu/workers" },
  { icon: ClipboardCheck, label: "Pending Approvals", href: "/lgu/approvals", badge: 3 },
];

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobile, onClose }: SidebarProps) {
  const pathname = usePathname();

  // TODO: replace with real auth session
  const isLoggedIn = true;
  const userRole = "lgu";
  const logoHref = isLoggedIn
    ? userRole === "lgu"
      ? "/lgu/dashboard"
      : "/worker/dashboard"
    : "/";

  return (
    <div className={`flex flex-col h-full bg-[#0a2e18] ${mobile ? "w-full" : "w-64"}`}>
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <Link
            href={logoHref}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <Image src="/serbisyo360-logo.png" alt="Serbisyo360" width={36} height={36} />
            <span className="font-display font-bold text-white text-base">
              Serbisyo<span className="text-[#a8e6bf]">360</span>
            </span>
          </Link>
          {mobile && (
            <button onClick={onClose} className="text-white/60 hover:text-white">
              <X size={20} />
            </button>
          )}
        </div>
        <p className="text-white/40 text-[10px] mt-1">LGU Admin Portal</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(({ icon: Icon, label, href, badge }) => {
          const active =
            pathname === href ||
            (href !== "/lgu/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                active
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/8"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon size={17} />
                {label}
              </span>
              {badge && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Admin info */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-[#1a7a45] flex items-center justify-center text-white font-display font-bold text-sm">
            FC
          </div>
          <div>
            <p className="text-white text-xs font-semibold">Francis Carabasa</p>
            <p className="text-white/40 text-[10px]">Quiapo, Manila LGU</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-white/40 hover:text-white/70 text-xs transition-colors w-full"
        >
          <LogOut size={14} />Log out
        </button>
      </div>
    </div>
  );
}