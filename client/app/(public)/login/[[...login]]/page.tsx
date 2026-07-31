import React from "react";
import { SignIn } from "@clerk/nextjs";
import { clerkTheme } from "@/features/auth/clerkTheme";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-12rem)] items-center justify-center p-4">
      {/* Visual background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] -z-10 pointer-events-none" />

      <SignIn
        appearance={clerkTheme}
        path="/login"
        signUpUrl="/register"
        forceRedirectUrl="/dashboard"
      />
    </div>
  );
}
