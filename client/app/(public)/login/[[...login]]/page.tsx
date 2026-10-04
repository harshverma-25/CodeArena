"use client";

import React, { useState } from "react";
import { SignIn } from "@clerk/nextjs";
import { clerkTheme } from "@/features/auth/clerkTheme";
import { PlayAsGuestModal } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export default function LoginPage() {
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);

  return (
    <div className="relative flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center p-4">
      {/* Visual background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] -z-10 pointer-events-none" />

      <SignIn
        appearance={clerkTheme}
        path="/login"
        signUpUrl="/register"
        forceRedirectUrl="/dashboard"
      />

      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 w-64">
          <div className="h-[1px] flex-1 bg-border/60" />
          <span className="text-[11px] text-muted-foreground uppercase font-mono tracking-wider">or</span>
          <div className="h-[1px] flex-1 bg-border/60" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => setIsGuestModalOpen(true)}
          className="mt-1 h-10 px-5 text-xs font-semibold gap-2 border-border/80 bg-card/60 backdrop-blur-sm hover:bg-card hover:border-primary/50 text-foreground cursor-pointer shadow-sm transition-all"
        >
          <Zap className="h-4 w-4 text-amber-500 fill-amber-500/20" />
          <span>Play as Guest</span>
        </Button>
      </div>

      <PlayAsGuestModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
      />
    </div>
  );
}
