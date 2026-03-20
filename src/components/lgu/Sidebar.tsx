"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Users, ClipboardCheck, BarChart3, LogOut, X } from "lucide-react";
import { logout } from "@/lib/logout";

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobile, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [adminName, setAdminName] = useState("Admin");
  const [lguName, setLguName] = useState("LGU");
  const [initials, setInitials] = useState("A");
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    // Load admin info from session
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setAdminName(d.user.adminName || "Admin");
          setLguName(d.user.lguName || "LGU");
          setInitials((d.user.adminName || "A").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2));
        }
      })
      .catch(() => {});

    // Load pending count
    fetch("/api/lgu/workers?status=pending")
      .then((r) => r.json())
      .then((d) => { if (d.total != null) setPendingCount(d.total); })
      .catch(() => {});
  }, []);

  const NAV_ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard",          href: "/lgu/dashboard"  },
    { icon: BarChart3,       label: "Analytics & Reports",href: "/lgu/analytics"  },
    { icon: Users,           label: "Manage Workers",     href: "/lgu/workers"    },
    { icon: ClipboardCheck,  label: "Pending Approvals",  href: "/lgu/approvals", badge: pendingCount },
  ];

  return (
    <div className={`flex flex-col h-full bg-[#0a2e18] ${mobile ? "w-full" : "w-64"}`}>
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <Link href="/lgu/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <Image src="/serbisyo360-logo.png" alt="Serbisyo360" width={36} height={36}/>
            <span className="font-display font-bold text-white text-base">Serbisyo<span className="text-[#a8e6bf]">360</span></span>
          </Link>
          {mobile && <button onClick={onClose} className="text-white/60 hover:text-white"><X size={20}/></button>}
        </div>
        <p className="text-white/40 text-[10px] mt-1">LGU Admin Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(({ icon: Icon, label, href, badge }) => {
          const active = pathname === href || (href !== "/lgu/dashboard" && pathname.startsWith(href));
          return (
            <Link key={label} href={href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${active ? "bg-white/15 text-white" : "text-white/60 hover:text-white hover:bg-white/8"}`}>
              <span className="flex items-center gap-3"><Icon size={17}/>{label}</span>
              {badge != null && badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-[#1a7a45] flex items-center justify-center text-white font-display font-bold text-sm">{initials}</div>
          <div>
            <p className="text-white text-xs font-semibold">{adminName}</p>
            <p className="text-white/40 text-[10px]">{lguName}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-white/40 hover:text-white/70 text-xs transition-colors w-full">
          <LogOut size={14}/>Log out
        </button>
      </div>
    </div>
  );
}
