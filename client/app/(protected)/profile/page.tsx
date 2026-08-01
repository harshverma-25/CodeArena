"use client";

import React from "react";
import { ProfileStats } from "@/features/profile";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text text-transparent">
          User Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor your competitive coding statistics and update your account settings.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
        <ProfileStats />
      </div>
    </div>
  );
}
