"use client";

import React from "react";
import { User } from "lucide-react";
import { ProfileStats } from "@/features/profile";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-[#FAF7EE] border-[2.5px] border-black rounded-[28px] p-6 sm:p-7 shadow-[5px_5px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-[#DDD6FE] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
              <User className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
              Player Profile
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-bold text-stone-600 pl-0 sm:pl-[50px]">
            Track your performance metrics, customize account display settings, and view quiz history.
          </p>
        </div>
      </div>

      <ProfileStats />
    </div>
  );
}
