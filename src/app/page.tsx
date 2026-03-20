"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  QrCode,
  ShieldCheck,
  BarChart3,
  Star,
  ArrowRight,
  Menu,
  X,
  CheckCircle2,
  Users,
  MapPin,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f9f5] text-[#0f1f0f] font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        .font-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes scanline {
          0% { top: 10%; }
          100% { top: 85%; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        .animate-fade-up { animation: fadeUp 0.7s ease forwards; }
        .animate-fade-in { animation: fadeIn 0.6s ease forwards; }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .delay-1 { animation-delay: 0.15s; }
        .delay-2 { animation-delay: 0.3s; }
        .delay-3 { animation-delay: 0.45s; }
        .delay-4 { animation-delay: 0.6s; }

        .hero-grid {
          background-image:
            linear-gradient(rgba(15,77,43,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,77,43,0.06) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .step-connector::after {
          content: '';
          position: absolute;
          top: 32px;
          left: calc(100% + 1px);
          width: calc(100% - 2px);
          height: 2px;
          background: repeating-linear-gradient(90deg, #1a7a45 0, #1a7a45 6px, transparent 6px, transparent 14px);
        }

        .card-hover {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(15,77,43,0.12);
        }

        .qr-scan::after {
          content: '';
          position: absolute;
          left: 12px;
          right: 12px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #1a7a45, transparent);
          animation: scanline 2s ease-in-out infinite alternate;
          box-shadow: 0 0 8px #1a7a45;
        }

        .stat-number {
          font-feature-settings: 'tnum';
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-body ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-[#0f4d2b]/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#0f4d2b] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white font-display font-bold text-sm">S</span>
            </div>
            <span className="font-display font-semibold text-[#0f4d2b] text-lg tracking-tight">
              Serbisyo<span className="text-[#1a7a45]">360</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {["About", "How It Works", "For LGUs"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-[#2d5a3d] hover:text-[#0f4d2b] font-medium transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-[#0f4d2b] px-4 py-2 rounded-lg hover:bg-[#0f4d2b]/8 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register/lgu"
              className="text-sm font-medium bg-[#0f4d2b] text-white px-4 py-2 rounded-lg hover:bg-[#1a7a45] transition-colors shadow-sm"
            >
              Register LGU
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-[#0f4d2b]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-[#0f4d2b]/10 px-6 py-4 flex flex-col gap-4 animate-fade-in">
            {["About", "How It Works", "For LGUs"].map((item) => (
              <a key={item} href="#" className="text-sm font-medium text-[#2d5a3d]">
                {item}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <Link href="/login" className="flex-1 text-center text-sm font-medium border border-[#0f4d2b] text-[#0f4d2b] px-4 py-2 rounded-lg">
                Log in
              </Link>
              <Link href="/register/lgu" className="flex-1 text-center text-sm font-medium bg-[#0f4d2b] text-white px-4 py-2 rounded-lg">
                Register LGU
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="hero-grid relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#0f4d2b]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1a7a45]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center w-full">
          {/* Left copy */}
          <div className="font-body">
            <div className="inline-flex items-center gap-2 bg-[#0f4d2b]/8 text-[#0f4d2b] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 animate-fade-up opacity-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a7a45] animate-pulse" />
              LGU Workforce Management Portal
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-bold text-[#0a2e18] leading-[1.05] mb-6 animate-fade-up opacity-0 delay-1">
              Empowering
              <br />
              <span className="text-[#1a7a45] italic">Local Labor.</span>
              <br />
              Trusted by
              <br />
              Communities.
            </h1>

            <p className="text-[#3d6b4f] text-lg leading-relaxed mb-8 max-w-md animate-fade-up opacity-0 delay-2">
              A verified platform where agricultural extension workers are registered, reviewed by the public, and tracked by LGUs — giving government clean, trustworthy workforce data.
            </p>

            <div className="flex flex-wrap gap-3 animate-fade-up opacity-0 delay-3">
              <Link
                href="/register/worker"
                className="inline-flex items-center gap-2 bg-[#0f4d2b] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#1a7a45] transition-all shadow-lg shadow-[#0f4d2b]/20 hover:shadow-[#0f4d2b]/30 hover:-translate-y-0.5"
              >
                Register as Worker
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-white text-[#0f4d2b] font-semibold px-6 py-3 rounded-xl border border-[#0f4d2b]/20 hover:border-[#0f4d2b]/40 transition-all hover:-translate-y-0.5"
              >
                LGU Portal
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-10 animate-fade-up opacity-0 delay-4">
              {[
                { label: "OTP Verified", icon: ShieldCheck },
                { label: "Anti-spam Reviews", icon: CheckCircle2 },
                { label: "LGU Managed", icon: BarChart3 },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-[#3d6b4f] font-medium">
                  <Icon size={14} className="text-[#1a7a45]" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right — floating worker card mockup */}
          <div className="relative flex justify-center items-center animate-fade-in opacity-0 delay-2">
            {/* Pulse rings */}
            <div className="absolute w-72 h-72 rounded-full border-2 border-[#1a7a45]/20" style={{ animation: "pulse-ring 3s ease-out infinite" }} />
            <div className="absolute w-72 h-72 rounded-full border-2 border-[#1a7a45]/15" style={{ animation: "pulse-ring 3s ease-out infinite 1s" }} />

            {/* Worker profile card */}
            <div className="animate-float relative z-10 bg-white rounded-2xl shadow-2xl shadow-[#0f4d2b]/15 p-6 w-72 border border-[#0f4d2b]/10">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0f4d2b] to-[#1a7a45] flex items-center justify-center text-white font-display font-bold text-xl shadow-lg">
                  J
                </div>
                <div>
                  <p className="font-semibold text-[#0a2e18] font-body">Nexus Voyagers</p>
                  <p className="text-xs text-[#3d6b4f] font-body">Agricultural Worker</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={10} className="text-[#1a7a45]" />
                    <span className="text-xs text-[#3d6b4f] font-body">Manila, NCR</span>
                  </div>
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    className={s <= 4 ? "fill-[#f4c430] text-[#f4c430]" : "text-gray-200 fill-gray-200"}
                  />
                ))}
                <span className="text-xs text-[#3d6b4f] ml-1 font-body">4.0 · 24 reviews</span>
              </div>

              {/* Verified badge */}
              <div className="flex items-center gap-1.5 bg-[#d4edda] text-[#0f4d2b] text-xs font-semibold px-3 py-1.5 rounded-lg mb-4 w-fit font-body">
                <CheckCircle2 size={12} />
                LGU Verified
              </div>

              {/* QR placeholder */}
              <div className="qr-scan relative bg-[#f7f9f5] rounded-xl p-3 border border-dashed border-[#0f4d2b]/20 overflow-hidden">
                <div className="flex items-center gap-2">
                  <QrCode size={36} className="text-[#0f4d2b]" />
                  <div className="font-body">
                    <p className="text-xs font-semibold text-[#0a2e18]">Scan to Review</p>
                    <p className="text-[10px] text-[#3d6b4f]">QR Code · Serbisyo360</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating mini review bubble */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg shadow-[#0f4d2b]/10 p-3 border border-[#0f4d2b]/8 font-body animate-float" style={{ animationDelay: "1.5s" }}>
              <p className="text-xs font-semibold text-[#0a2e18]">New Review ✓</p>
              <div className="flex gap-0.5 mt-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={10} className="fill-[#f4c430] text-[#f4c430]" />
                ))}
              </div>
              <p className="text-[10px] text-[#3d6b4f] mt-0.5">OTP Verified · Just now</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 font-body" id="how-it-works">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-[#1a7a45] uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="font-display text-4xl font-bold text-[#0a2e18]">
              From Registration to
              <br />
              <span className="italic text-[#1a7a45]">Trusted Reviews</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {[
              {
                step: "01",
                icon: Users,
                title: "Worker Registers",
                desc: "Worker signs up or LGU manually enters their details into the system.",
                color: "bg-[#e8f5ed]",
              },
              {
                step: "02",
                icon: ShieldCheck,
                title: "LGU Verifies",
                desc: "LGU admin reviews and approves the worker profile for authenticity.",
                color: "bg-[#d4edda]",
              },
              {
                step: "03",
                icon: QrCode,
                title: "QR Code Issued",
                desc: "A unique QR code is generated as the worker's verifiable digital ID.",
                color: "bg-[#c1e4cb]",
              },
              {
                step: "04",
                icon: Star,
                title: "Public Reviews",
                desc: "Anyone who encounters the worker scans the QR and leaves an OTP-verified review.",
                color: "bg-[#a8e6bf]",
              },
            ].map(({ step, icon: Icon, title, desc, color }, i) => (
              <div
                key={step}
                className={`card-hover relative ${color} rounded-2xl p-6 border border-[#0f4d2b]/8`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-5xl font-bold text-[#0f4d2b]/15">{step}</span>
                  <div className="w-10 h-10 rounded-xl bg-[#0f4d2b] flex items-center justify-center shadow-md">
                    <Icon size={18} className="text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-[#0a2e18] mb-2">{title}</h3>
                <p className="text-sm text-[#3d6b4f] leading-relaxed">{desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-10 -right-3 z-10">
                    <ChevronRight size={20} className="text-[#0f4d2b]/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 bg-[#0a2e18] text-white font-body" id="features">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-[#a8e6bf] uppercase tracking-widest mb-3">Built For Government</p>
            <h2 className="font-display text-4xl font-bold">
              Everything LGUs Need to
              <br />
              <span className="italic text-[#a8e6bf]">Make Better Decisions</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "OTP-Verified Reviews",
                desc: "Every review is tied to a verified phone number. The same number can't review the same worker twice — keeping your data clean and spam-free.",
              },
              {
                icon: QrCode,
                title: "Unique QR Identity",
                desc: "Each worker gets a unique, scannable QR code that acts as their digital ID — verifiable by anyone, anywhere, instantly.",
              },
              {
                icon: BarChart3,
                title: "LGU Analytics Dashboard",
                desc: "Filter workers by rating, specialization, and location. Export clean workforce data for project deployment and hiring decisions.",
              },
              {
                icon: Users,
                title: "Worker Management",
                desc: "LGU admins can register, verify, or reject workers. Full control over who represents your municipality's workforce.",
              },
              {
                icon: Star,
                title: "Public Accountability",
                desc: "Community members rate and review workers after every job. Transparency builds trust between citizens and government services.",
              },
              {
                icon: MapPin,
                title: "Location Tracking",
                desc: "Workers are tagged by municipality and area covered, giving LGUs precise data for regional deployment planning.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="card-hover bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1a7a45]/30 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-[#a8e6bf]" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 font-body">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-[#0f4d2b] to-[#1a7a45] rounded-3xl p-12 shadow-2xl shadow-[#0f4d2b]/20 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5" />

            <p className="text-xs font-semibold text-[#a8e6bf] uppercase tracking-widest mb-4 relative z-10">
              Get Started Today
            </p>
            <h2 className="font-display text-4xl font-bold text-white mb-4 relative z-10">
              Ready to Build a
              <br />
              <span className="italic">Smarter Community?</span>
            </h2>
            <p className="text-white/70 mb-8 max-w-md mx-auto relative z-10">
              Join the growing network of LGUs using Serbisyo360 to manage, verify, and deploy their local workforce with confidence.
            </p>
            <div className="flex flex-wrap justify-center gap-3 relative z-10">
              <Link
                href="/register/lgu"
                className="inline-flex items-center gap-2 bg-white text-[#0f4d2b] font-semibold px-6 py-3 rounded-xl hover:bg-[#f0faf4] transition-all shadow-lg hover:-translate-y-0.5"
              >
                Register Your LGU
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/register/worker"
                className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-all hover:-translate-y-0.5"
              >
                Register as Worker
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0a2e18] text-white/60 py-12 font-body">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1a7a45] flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">S</span>
              </div>
              <span className="font-display font-semibold text-white text-base">
                Serbisyo<span className="text-[#a8e6bf]">360</span>
              </span>
            </div>
            <p className="text-sm text-center">
              Empowering Local Labor · Verified Feedback · Smarter LGU Decisions
            </p>
            <p className="text-sm">© 2026 Serbisyo360</p>
          </div>
        </div>
      </footer>
    </div>
  );
}