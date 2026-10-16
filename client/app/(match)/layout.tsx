import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Match Results",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function MatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#FAF7EE]">
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}
