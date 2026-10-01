"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserProfile } from "@/features/profile/hooks/useUserProfile";
import { PublicProfileView } from "@/features/profile/components/PublicProfileView";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, UserX, Home } from "lucide-react";

export default function UserPublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = (params.username as string) || "";

  const { data: profile, isLoading, isError, error, refetch } = useUserProfile(username);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-6 p-6 rounded-2xl border border-border bg-card/40 animate-pulse">
          <div className="h-20 w-20 rounded-2xl bg-secondary shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-6 w-1/3 rounded bg-secondary" />
            <div className="h-4 w-1/4 rounded bg-secondary" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl border border-border bg-card p-5" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-border rounded-2xl bg-card text-center gap-4 my-8">
        <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
          <UserX className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">Player Profile Not Found</h3>
          <p className="text-sm text-muted-foreground font-mono">
            {error?.message || `User '${username}' does not exist on CodeArena.`}
          </p>
        </div>
        <div className="flex gap-3 pt-2 font-mono text-xs">
          <Button onClick={() => router.push("/leaderboard")} variant="outline" className="gap-1.5">
            Leaderboard
          </Button>
          <Button onClick={() => refetch()} className="gap-1.5 bg-primary text-primary-foreground">
            <RefreshCw className="h-4 w-4" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  return <PublicProfileView profile={profile} />;
}
