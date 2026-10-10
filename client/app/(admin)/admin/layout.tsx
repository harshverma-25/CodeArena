"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderTree,
  UploadCloud,
  History as HistoryIcon,
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  Menu,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useCurrentUser } from "@/features/auth";
import { getNativeUser } from "@/features/auth/nativeAuth";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const [mounted, setMounted] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeUser = user || (mounted ? getNativeUser() : null);
  const isAdmin = activeUser?.role === "admin";

  const navLinks = [
    {
      label: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Categories & Subjects",
      href: "/admin/categories",
      icon: FolderTree,
      exact: false,
    },
    {
      label: "Import Questions",
      href: "/admin/import",
      icon: UploadCloud,
      exact: false,
    },
    {
      label: "Import History",
      href: "/admin/history",
      icon: HistoryIcon,
      exact: false,
    },
  ];

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7EE] flex items-center justify-center p-4">
        <div className="bg-white border-2 border-black rounded-2xl p-8 shadow-[4px_4px_0px_#000] text-center max-w-sm w-full">
          <div className="w-12 h-12 border-4 border-black border-t-[#FFE600] rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-black text-black">Verifying Admin Access...</h2>
          <p className="text-xs text-stone-600 font-bold mt-1">Checking system permissions</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF7EE] flex items-center justify-center p-4">
        <div className="bg-white border-2 border-black rounded-2xl p-8 shadow-[6px_6px_0px_#000] text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 border-2 border-black rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-600 shadow-[3px_3px_0px_#000]">
            <ShieldAlert className="w-8 h-8 stroke-[2.5]" />
          </div>
          <span className="px-3 py-1 bg-red-100 text-red-800 border-2 border-black rounded-full text-xs font-black uppercase tracking-wider inline-block mb-3">
            Access Restricted
          </span>
          <h1 className="text-2xl font-black text-black mb-2">Admin Clearance Required</h1>
          <p className="text-xs text-stone-600 font-semibold mb-6 leading-relaxed">
            You are signed in as <strong className="text-black">{activeUser?.username || "Guest"}</strong> with role{" "}
            <code className="bg-stone-100 px-1.5 py-0.5 rounded border border-black text-stone-800">
              {activeUser?.role || "none"}
            </code>
            . You need administrator privileges to access this area.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-[#FFE600] text-black font-black text-xs border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000] transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to QUIZZY
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-white text-black font-black text-xs border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-stone-50 transition-all flex items-center justify-center"
            >
              Sign In with Admin Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-black flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-white border-b-2 border-black p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#FFE600] border-2 border-black px-2.5 py-1 rounded-xl shadow-[2px_2px_0px_#000] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            <span className="text-xs font-black tracking-wider uppercase">QUIZZY ADMIN</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-2 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] hover:bg-stone-100"
          aria-label="Toggle navigation"
        >
          {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={cn(
          "w-full lg:w-64 bg-white border-r-2 border-black flex flex-col shrink-0 lg:sticky lg:top-0 lg:h-screen z-30 transition-all",
          isMobileNavOpen ? "block border-b-2 border-black" : "hidden lg:flex"
        )}
      >
        {/* Brand / Logo */}
        <div className="p-5 border-b-2 border-black hidden lg:flex items-center justify-between bg-[#FAF7EE]">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFE600] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight leading-none">QUIZZY</div>
              <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-0.5">ADMIN PANEL</div>
            </div>
          </Link>
        </div>

        {/* Current Admin User Profile Box */}
        <div className="p-4 border-b-2 border-black bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2DD4BF] border-2 border-black flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_#000] overflow-hidden">
              {activeUser?.avatar ? (
                <img src={activeUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                activeUser?.username?.slice(0, 2).toUpperCase() || "AD"
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black truncate">{activeUser?.displayName || activeUser?.username}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Super Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileNavOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black border-2 transition-all",
                  isActive
                    ? "bg-[#FFE600] text-black border-black shadow-[3px_3px_0px_#000] translate-x-1"
                    : "text-stone-700 border-transparent hover:border-black hover:bg-[#FAF7EE] hover:text-black"
                )}
              >
                <Icon className="w-4 h-4 stroke-[2.2] shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t-2 border-black space-y-2 bg-[#FAF7EE]">
          <Link
            href="/"
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-white text-black font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-stone-100 transition-all"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              Exit to Quizzy
            </span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </Link>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 bg-[#FAF7EE] p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
