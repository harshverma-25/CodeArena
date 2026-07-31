import React from "react";
import { SignUp } from "@clerk/nextjs";
import { clerkTheme } from "@/features/auth/clerkTheme";

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-12rem)] items-center justify-center p-4">
      {/* Visual background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] -z-10 pointer-events-none" />

      <SignUp
        appearance={clerkTheme}
        path="/register"
        signInUrl="/login"
        forceRedirectUrl="/dashboard"
      />
    </div>
  );
}
