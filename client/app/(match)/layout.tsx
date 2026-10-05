import React from "react";

export default function MatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#fff8f0]">
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}
