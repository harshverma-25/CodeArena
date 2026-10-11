"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserProfile } from "@/features/profile/hooks/useUserProfile";
import { PublicProfileView } from "@/features/profile/components/PublicProfileView";
import { Button } from "@/components/ui/button";
import { RefreshCw, UserX } from "lucide-react";



export default function UserPublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = (params.username as string) || "";

  const { data: profile, isLoading, isError, error, refetch } = useUserProfile(username);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-6 p-6 rounded-[24px] border-2 border-black bg-white shadow-[4px_4px_0px_#000] animate-pulse">
          <div className="h-20 w-20 rounded-2xl bg-stone-200 border-2 border-black shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-6 w-1/3 rounded-xl bg-stone-200" />
            <div className="h-4 w-1/4 rounded-xl bg-stone-200" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl border-2 border-black bg-white shadow-[3px_3px_0px_#000] p-4" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex flex-col items-center justify-center p-10 border-[2.5px] border-black rounded-[24px] bg-white text-center gap-4 shadow-[4px_4px_0px_#000] my-8">
        <div className="h-14 w-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000]">
          <UserX className="h-7 w-7 stroke-[2.5]" />
        </div>
        <div>
          <h3 className="text-xl font-black text-black mb-1">Player Profile Not Found</h3>
          <p className="text-xs font-bold text-stone-600 font-mono">
            {error?.message || `User '${username}' does not exist on CodeArena.`}
          </p>
        </div>
        <div className="flex gap-3 pt-2 text-xs">
          <button
            onClick={() => router.push("/leaderboard")}
            className="px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-black border-2 border-black font-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            Leaderboard
          </button>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-[#FFE600] hover:bg-[#FACC15] text-black border-2 border-black font-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="h-4 w-4 stroke-[2.5]" /> Retry
          </button>
        </div>
      </div>
    );
  }

  return <PublicProfileView profile={profile} />;
}
