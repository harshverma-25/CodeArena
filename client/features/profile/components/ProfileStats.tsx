"use client";

import React, { useState, useEffect } from "react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useUser } from "@clerk/nextjs";
import { 
  Trophy, 
  Percent, 
  Code, 
  Flame, 
  Swords, 
  Frown, 
  CheckCircle,
  Activity,
  Mail,
  User as UserIcon,
  Shield,
  Save,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProfileStats() {
  const { data: dbUser, isLoading: dbUserLoading } = useCurrentUser();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const updateProfileMutation = useUpdateProfile();

  const [displayName, setDisplayName] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("javascript");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (dbUser) {
      setDisplayName(dbUser.displayName || "");
      setPreferredLanguage(dbUser.preferredLanguage || "javascript");
    }
  }, [dbUser]);

  if (dbUserLoading || !clerkLoaded) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl border border-border bg-card/40 animate-pulse">
          <div className="h-20 w-20 rounded-2xl bg-secondary shrink-0" />
          <div className="space-y-2 flex-1 w-full text-center sm:text-left">
            <div className="h-6 w-1/3 rounded bg-secondary mx-auto sm:mx-0" />
            <div className="h-4 w-1/4 rounded bg-secondary mx-auto sm:mx-0" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl border border-border bg-card p-5" />
          ))}
        </div>
      </div>
    );
  }

  const matchesPlayed = dbUser?.matchesPlayed || 0;
  const wins = dbUser?.wins || 0;
  const losses = dbUser?.losses || 0;
  const draws = dbUser?.draws || 0;
  const totalSubmissions = dbUser?.totalSubmissions || 0;
  const acceptedSubmissions = dbUser?.acceptedSubmissions || 0;
  const winRate = matchesPlayed ? Math.round((wins / matchesPlayed) * 100) : 0;
  const successRate = totalSubmissions ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0;
  const highestStreak = dbUser?.highestWinStreak || 0;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  const handleSave = () => {
    updateProfileMutation.mutate(
      { displayName, preferredLanguage },
      {
        onSuccess: () => {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        }
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Profile Header Overview Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xl">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-64 h-64 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          {/* User Avatar */}
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dbUser?.avatar || clerkUser?.imageUrl || "/placeholder-avatar.png"}
              alt={dbUser?.username || "User"}
              className="h-20 w-20 rounded-2xl border border-border bg-zinc-950 object-cover shadow-inner"
            />
            <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-[10px] font-bold text-primary-foreground border-2 border-card">
              🏆
            </span>
          </div>

          {/* User Meta */}
          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              {dbUser?.displayName || clerkUser?.fullName || dbUser?.username}
            </h2>
            <p className="text-xs text-muted-foreground font-mono">
              @{dbUser?.username || "challenger"}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-primary" /> Ranked Challenger
              </span>
              <span className="hidden sm:inline text-zinc-700">•</span>
              <span>Joined: {formatDate(dbUser?.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Statistics Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Win Rate */}
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
              Win Rate
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-foreground font-mono">{winRate}%</span>
            <p className="text-[10px] text-muted-foreground mt-1 font-mono">
              {wins} wins / {losses} losses
            </p>
          </div>
        </div>

        {/* Battles Played */}
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
              Battles
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10 text-purple-400">
              <Swords className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-foreground font-mono">{matchesPlayed}</span>
            <p className="text-[10px] text-muted-foreground mt-1 font-mono">
              {draws} draws / {matchesPlayed - wins - losses - draws} abandoned
            </p>
          </div>
        </div>

        {/* Problems Solved */}
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
              Solved
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-foreground font-mono">{acceptedSubmissions}</span>
            <p className="text-[10px] text-muted-foreground mt-1 font-mono">
              Success Rate: {successRate}%
            </p>
          </div>
        </div>

        {/* Streak */}
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
              Win Streak
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/10 text-orange-400">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-foreground font-mono">{highestStreak}</span>
            <p className="text-[10px] text-muted-foreground mt-1 font-mono">
              All-time record
            </p>
          </div>
        </div>
      </div>

      {/* 3. Main Split View: Edit Settings & Account Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Edit Settings (Left 2 cols) */}
        <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5">
          <div>
            <h3 className="text-lg font-bold text-foreground">Profile Settings</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Customize your public-facing information.</p>
          </div>

          <div className="space-y-4">
            {/* Display Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="displayName" className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your public display name"
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50"
              />
            </div>

            {/* Preferred Language Input */}
            <div className="space-y-1.5">
              <label htmlFor="preferredLang" className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                Preferred Coding Language
              </label>
              <select
                id="preferredLang"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={updateProfileMutation.isPending}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold cursor-pointer disabled:opacity-55"
            >
              {updateProfileMutation.isPending ? (
                <>Saving...</>
              ) : saveSuccess ? (
                <>
                  <Check className="h-4 w-4" /> Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
            {saveSuccess && (
              <span className="text-xs font-bold font-mono text-emerald-400 animate-pulse">
                Profile updated successfully.
              </span>
            )}
          </div>
        </div>

        {/* Account Details (Right 1 col) */}
        <div className="md:col-span-1 rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">Security & Account</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Clerk authenticated information.</p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex flex-col gap-1 border-b border-border/40 pb-2">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Email Address</span>
                <span className="text-foreground flex items-center gap-1.5 overflow-hidden text-ellipsis">
                  <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                  {clerkUser?.primaryEmailAddress?.emailAddress || "Guest email"}
                </span>
              </div>

              <div className="flex flex-col gap-1 border-b border-border/40 pb-2">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Username ID</span>
                <span className="text-foreground flex items-center gap-1.5">
                  <UserIcon className="h-3.5 w-3.5 text-primary shrink-0" />
                  {dbUser?.username || "no-username"}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">System Status</span>
                <span className="text-foreground flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  Online
                </span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-zinc-500 font-mono pt-4 border-t border-border/40">
            Account ID: {clerkUser?.id || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProfileStats;
