"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#FAF7EE] text-stone-900 selection:bg-[#FFE600] selection:text-black">
      <Navbar />
      <main className="flex-1 pt-20">{children}</main>
    </div>
  );
}
