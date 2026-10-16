"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";

export function ProtectedClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLobbyOrBattle = pathname?.startsWith("/lobby") || pathname?.startsWith("/battle");

  if (isLobbyOrBattle) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-[#fff8f0]">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-[88px] sm:pt-[92px] pb-12 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
