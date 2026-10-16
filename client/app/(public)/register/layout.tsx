import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join QUIZZY to compete in live multiplayer quiz battles, challenge friends, and track your scoring performance.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
