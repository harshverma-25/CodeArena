import type { Metadata } from "next";
import { ProtectedClientShell } from "./ProtectedClientShell";

export const metadata: Metadata = {
  title: "Arena & Dashboard",
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

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedClientShell>{children}</ProtectedClientShell>;
}
