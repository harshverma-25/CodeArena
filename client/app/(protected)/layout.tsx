"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLobby = pathname?.startsWith("/lobby");

  if (isLobby) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        {children}
      </main>
    </div>
  );
}
