import React from "react";

export default function MatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-background">
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
