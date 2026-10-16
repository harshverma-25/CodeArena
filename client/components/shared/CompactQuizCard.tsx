"use client";

import React, { useState } from "react";
import { Play, Users, Trophy, Film } from "lucide-react";
import {
  ArcadeBrainIcon,
  ArcadeCodeIcon,
  ArcadeFlaskIcon,
  ArcadeGlobeIcon,
  ArcadeLightbulbIcon,
} from "@/components/ui/ArcadeIcons";

export interface CompactQuizCardProps {
  id: string;
  title: string;
  categorySlug: string;
  subjectSlug?: string | null;
  isMixedCategory?: boolean;
  thumbnailUrl?: string;
  questionCount?: number;
  playedCount?: number;
  rank?: number;
  onPlay: () => void;
}



function getThumbnailTheme(categorySlug: string) {
  const cat = (categorySlug || "").toLowerCase();
  if (cat.includes("program") || cat.includes("code")) {
    return {
      bg: "bg-gradient-to-br from-[#CFFAFE] to-[#BAE6FD]",
      icon: <ArcadeCodeIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
    };
  }
  if (cat.includes("science") || cat.includes("physics") || cat.includes("chem") || cat.includes("bio")) {
    return {
      bg: "bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0]",
      icon: <ArcadeFlaskIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
    };
  }
  if (cat.includes("general") || cat.includes("globe") || cat.includes("history") || cat.includes("geo")) {
    return {
      bg: "bg-gradient-to-br from-[#FEF9C3] to-[#FEF08A]",
      icon: <ArcadeGlobeIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
    };
  }
  if (cat.includes("entertainment") || cat.includes("movie") || cat.includes("anime") || cat.includes("marvel")) {
    return {
      bg: "bg-gradient-to-br from-[#FFE4E6] to-[#FECDD3]",
      icon: <Film className="w-6 h-6 sm:w-8 sm:h-8 text-rose-600" />,
    };
  }
  if (cat.includes("sport") || cat.includes("cricket") || cat.includes("football")) {
    return {
      bg: "bg-gradient-to-br from-[#FFEDD5] to-[#FED7AA]",
      icon: <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />,
    };
  }
  return {
    bg: "bg-gradient-to-br from-[#FEF08A] to-[#FDE047]",
    icon: <ArcadeLightbulbIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
  };
}

export function QuizThumbnail({
  src,
  alt,
  categorySlug,
}: {
  src?: string;
  alt: string;
  categorySlug: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (src && !hasError) {
    return (
      <div className="w-full h-full relative overflow-hidden bg-stone-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
    );
  }

  // Themed Fallback Illustration
  const theme = getThumbnailTheme(categorySlug);

  return (
    <div
      className={`w-full h-full relative overflow-hidden flex flex-col items-center justify-center p-2 select-none ${theme.bg} group-hover:scale-105 transition-transform duration-300`}
    >
      {/* Retro Dot Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`dot-grid-${categorySlug}`} width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="1.2" fill="#000" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#dot-grid-${categorySlug})`} />
        </svg>
      </div>

      {/* Centered Arcade Vector Icon */}
      <div className="relative z-10 p-2 sm:p-2.5 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center">
        {theme.icon}
      </div>
    </div>
  );
}

export function CompactQuizCard({
  id,
  title,
  categorySlug,
  subjectSlug,
  thumbnailUrl,
  questionCount,
  playedCount,
  onPlay,
}: CompactQuizCardProps) {
  // Real image URL from database / Cloudinary / manual upload
  const effectiveImageUrl = thumbnailUrl ? thumbnailUrl.trim() : undefined;

  const displayQuestions = questionCount && questionCount > 0 ? questionCount : 10;
  const displayPlays = typeof playedCount === "number" ? playedCount : 0;

  return (
    <div
      onClick={onPlay}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPlay();
        }
      }}
      className="group relative rounded-2xl sm:rounded-3xl border-2 sm:border-[2.5px] border-black bg-[#D4F5E4] p-2 sm:p-2.5 shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:translate-x-[1.5px] active:translate-y-[1.5px] transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      {/* 1. Thumbnail Image Container (1:1 Aspect Ratio with Black Border) */}
      <div className="w-full aspect-square rounded-xl sm:rounded-2xl border-2 border-black overflow-hidden relative bg-stone-200 shrink-0">
        <QuizThumbnail
          src={effectiveImageUrl}
          alt={title}
          categorySlug={categorySlug}
        />

        {/* Top-Right Pill Badge: "{count} Questions" */}
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10">
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full bg-white border-[1.5px] sm:border-2 border-black text-[9px] sm:text-[10px] md:text-xs font-black text-black shadow-[1px_1px_0px_#000] whitespace-nowrap leading-tight">
            {displayQuestions} Questions
          </span>
        </div>
      </div>

      {/* 2. Bottom Row: Title + Played Count on Left, Circular Teal Play Button on Right */}
      <div className="pt-2 sm:pt-2.5 px-0.5 flex items-center justify-between gap-1.5">
        {/* Left: Title & Played Count */}
        <div className="min-w-0 flex-1">
          <h3
            className="font-black text-xs sm:text-sm md:text-base text-black truncate leading-tight tracking-tight group-hover:text-[#007A6C] transition-colors"
            title={title}
          >
            {title}
          </h3>

          <div className="flex items-center gap-1 mt-0.5 sm:mt-1 text-black">
            <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 stroke-[2.5]" />
            <span className="font-bold text-[9px] sm:text-[11px] text-stone-900 leading-none truncate">
              {displayPlays} played
            </span>
          </div>
        </div>

        {/* Right: Circular Teal Play Button (Matching Screenshot) */}
        <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-[#00A896] group-hover:bg-[#009688] border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] sm:shadow-[2px_2px_0px_#000] shrink-0 group-hover:scale-105 active:scale-95 transition-transform">
          <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 fill-white text-white ml-0.5" />
        </div>
      </div>
    </div>
  );
}

export default CompactQuizCard;
