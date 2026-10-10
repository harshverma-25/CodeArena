"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Play,
  Users,
  Clock,
  Sparkles,
  Zap,
  Flame,
  Crown,
  Check,
  X,
  SlidersHorizontal,
  ChevronRight,
  Award,
  Trophy,
} from "lucide-react";

import {
  ArcadeBrainIcon,
  ArcadeLightbulbIcon,
  ArcadeCodeIcon,
  ArcadeFlaskIcon,
  ArcadeGlobeIcon,
  ArcadeNewsIcon,
  ArcadeCrownIcon,
  ArcadeLightningIcon,
  ArcadeFlameIcon,
  ArcadeStarIcon,
} from "@/components/ui/ArcadeIcons";

import { isGuestSessionActive, getGuestUser, PlayAsGuestModal, useCurrentUser } from "@/features/auth";
import { useApiClient } from "@/hooks/useApiClient";
import { Category, PopularQuiz } from "@/types";

// Dynamic pastel palette for category cards
const CATEGORY_THEMES = [
  {
    bgColor: "bg-[#DCFCE7]", // Pastel mint green
    hoverBg: "hover:bg-[#BBF7D0]",
    buttonColor: "bg-[#0D9488]",
    buttonHover: "hover:bg-[#0F766E]",
  },
  {
    bgColor: "bg-[#FEF9C3]", // Pastel yellow
    hoverBg: "hover:bg-[#FEF08A]",
    buttonColor: "bg-[#F59E0B]",
    buttonHover: "hover:bg-[#D97706]",
  },
  {
    bgColor: "bg-[#EDE9FE]", // Pastel lavender
    hoverBg: "hover:bg-[#DDD6FE]",
    buttonColor: "bg-[#7C3AED]",
    buttonHover: "hover:bg-[#6D28D9]",
  },
  {
    bgColor: "bg-[#FFE4E6]", // Pastel pink
    hoverBg: "hover:bg-[#FECDD3]",
    buttonColor: "bg-[#EC4899]",
    buttonHover: "hover:bg-[#DB2777]",
  },
  {
    bgColor: "bg-[#CFFAFE]", // Pastel sky blue
    hoverBg: "hover:bg-[#BAE6FD]",
    buttonColor: "bg-[#0284C7]",
    buttonHover: "hover:bg-[#0369A1]",
  },
  {
    bgColor: "bg-[#FFEDD5]", // Pastel peach orange
    hoverBg: "hover:bg-[#FED7AA]",
    buttonColor: "bg-[#EA580C]",
    buttonHover: "hover:bg-[#C2410C]",
  },
];

const RANK_BADGE_COLORS = [
  "bg-[#FFE600] text-black", // Rank 1: Yellow
  "bg-[#2DD4BF] text-black", // Rank 2: Teal
  "bg-[#FB923C] text-black", // Rank 3: Orange
  "bg-[#F472B6] text-black", // Rank 4: Pink
  "bg-[#38BDF8] text-black", // Rank 5: Sky blue
];

function getCategoryIcon(slug: string, className = "w-12 h-12") {
  switch (slug.toLowerCase()) {
    case "aptitude":
      return <ArcadeBrainIcon className={className} />;
    case "programming":
      return <ArcadeCodeIcon className={className} />;
    case "science":
      return <ArcadeFlaskIcon className={className} />;
    case "general-knowledge":
      return <ArcadeGlobeIcon className={className} />;
    default:
      return <ArcadeLightbulbIcon className={className} />;
  }
}

function renderQuizIcon(icon?: string, categorySlug?: string) {
  const target = (icon || categorySlug || "").toLowerCase();
  if (target.includes("brain") || target.includes("aptitude")) {
    return <ArcadeBrainIcon className="w-5 h-5" />;
  }
  if (
    target.includes("code") ||
    target.includes("program") ||
    target.includes("dsa") ||
    target.includes("javascript") ||
    target.includes("python")
  ) {
    return <ArcadeCodeIcon className="w-5 h-5" />;
  }
  if (target.includes("flask") || target.includes("science") || target.includes("physics")) {
    return <ArcadeFlaskIcon className="w-5 h-5" />;
  }
  if (target.includes("globe") || target.includes("gk") || target.includes("general")) {
    return <ArcadeGlobeIcon className="w-5 h-5" />;
  }
  return <ArcadeLightbulbIcon className="w-5 h-5" />;
}

export default function QuizzyHomePage() {
  const router = useRouter();
  const api = useApiClient();
  const { data: currentUser } = useCurrentUser();
  const isUserAuthenticated = Boolean(currentUser);

  // Backend API states (100% dynamic data from MongoDB)
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const [popularQuizzes, setPopularQuizzes] = useState<PopularQuiz[]>([]);
  const [loadingPopular, setLoadingPopular] = useState<boolean>(true);
  const [popularError, setPopularError] = useState<string | null>(null);

  // Interactive Quiz Configuration
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(10);
  const [activePlayModalQuiz, setActivePlayModalQuiz] = useState<{
    title: string;
    categorySlug: string;
    subjectSlug?: string | null;
    isMixedCategory: boolean;
    description: string;
    availableQuestions?: number;
  } | null>(null);

  const [startingSoloCardId, setStartingSoloCardId] = useState<string | null>(null);
  const [creatingRoomCardId, setCreatingRoomCardId] = useState<string | null>(null);
  const [roomError, setRoomError] = useState<string | null>(null);

  // Auth and Guest State
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [guestActive, setGuestActive] = useState<boolean>(false);
  const [guestUser, setGuestUser] = useState<any>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  const categoriesSectionRef = useRef<HTMLDivElement>(null);
  const mostPlayedSectionRef = useRef<HTMLDivElement>(null);

  // Synchronize guest auth
  useEffect(() => {
    const updateGuest = () => {
      const active = isGuestSessionActive();
      setGuestActive(active);
      if (active) {
        setGuestUser(getGuestUser());
      } else {
        setGuestUser(null);
      }
    };
    updateGuest();
    window.addEventListener("codearena:guest-auth-change", updateGuest);
    return () => {
      window.removeEventListener("codearena:guest-auth-change", updateGuest);
    };
  }, []);

  // Listen for Navbar search events
  useEffect(() => {
    const handleNavbarSearch = (e: any) => {
      setSearchQuery(e.detail || "");
    };
    window.addEventListener("quizzy:search", handleNavbarSearch as EventListener);
    return () => {
      window.removeEventListener("quizzy:search", handleNavbarSearch as EventListener);
    };
  }, []);

  const hasAccess = Boolean(isUserAuthenticated || guestActive);

  // Fetch real categories and real popular quizzes from backend APIs
  useEffect(() => {
    let isMounted = true;

    const fetchCategoriesData = async () => {
      try {
        setLoadingCategories(true);
        setCategoriesError(null);
        const res = await api.get<{ success: boolean; data: Category[] }>("/categories");
        if (isMounted && res.data && Array.isArray(res.data)) {
          setCategories(res.data);
        }
      } catch (err: any) {
        if (isMounted) setCategoriesError(err?.message || "Could not fetch categories.");
      } finally {
        if (isMounted) setLoadingCategories(false);
      }
    };

    const fetchPopularData = async () => {
      try {
        setLoadingPopular(true);
        setPopularError(null);
        const res = await api.get<{ success: boolean; data: PopularQuiz[] }>("/categories/popular?limit=5");
        if (isMounted && res.data && Array.isArray(res.data)) {
          setPopularQuizzes(res.data);
        }
      } catch (err: any) {
        if (isMounted) setPopularError(err?.message || "Could not fetch popular quizzes.");
      } finally {
        if (isMounted) setLoadingPopular(false);
      }
    };

    fetchCategoriesData();
    fetchPopularData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Launch Solo Quiz
  const handlePlaySolo = async (quiz: {
    categorySlug: string;
    subjectSlug?: string | null;
    isMixedCategory?: boolean;
    questionCount?: number;
  }) => {
    if (!hasAccess) {
      setIsGuestModalOpen(true);
      return;
    }

    const key = `${quiz.categorySlug}-${quiz.subjectSlug || "mixed"}`;
    setStartingSoloCardId(key);
    setRoomError(null);

    try {
      const res = await api.post<{ success: boolean; data: { roomCode: string; battleId: string } }>("/rooms/solo", {
        categoryId: quiz.categorySlug,
        subjectId: quiz.isMixedCategory ? null : quiz.subjectSlug,
        isMixedCategory: Boolean(quiz.isMixedCategory),
        questionCount: quiz.questionCount || selectedQuestionCount,
      });

      if (res.data?.roomCode) {
        router.push(`/battle/${res.data.roomCode}`);
      } else {
        throw new Error("Could not initialize solo battle.");
      }
    } catch (err: any) {
      setRoomError(err.message || "Failed to start solo quiz session.");
    } finally {
      setStartingSoloCardId(null);
    }
  };

  // Launch Multiplayer Quiz Room
  const handlePlayMultiplayer = async (quiz: {
    categorySlug: string;
    subjectSlug?: string | null;
    isMixedCategory?: boolean;
    questionCount?: number;
  }) => {
    if (!hasAccess) {
      setIsGuestModalOpen(true);
      return;
    }

    const key = `${quiz.categorySlug}-${quiz.subjectSlug || "mixed"}`;
    setCreatingRoomCardId(key);
    setRoomError(null);

    try {
      const res = await api.post<{ success: boolean; data: { roomCode: string } }>("/rooms", {
        categoryId: quiz.categorySlug,
        subjectId: quiz.isMixedCategory ? null : quiz.subjectSlug,
        isMixedCategory: Boolean(quiz.isMixedCategory),
        questionCount: quiz.questionCount || selectedQuestionCount,
      });

      if (res.data?.roomCode) {
        router.push(`/lobby/${res.data.roomCode}`);
      } else {
        throw new Error("Could not create multiplayer lobby.");
      }
    } catch (err: any) {
      setRoomError(err.message || "Failed to create multiplayer room.");
    } finally {
      setCreatingRoomCardId(null);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF7EE] text-stone-900 pb-20 select-none overflow-x-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-6 sm:space-y-8 pt-4">
        
        {/* Error notification banner if room creation encounters an issue */}
        {roomError && (
          <div className="p-4 rounded-2xl bg-red-100 border-[2.5px] border-black text-red-900 shadow-[4px_4px_0px_#000] flex items-center justify-between">
            <span className="font-extrabold text-sm sm:text-base">{roomError}</span>
            <button
              onClick={() => setRoomError(null)}
              className="bg-red-200 hover:bg-red-300 border-2 border-black rounded-lg px-3 py-1 font-black text-xs cursor-pointer shadow-[2px_2px_0px_#000]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION C: EXPLORE CATEGORIES (100% DYNAMIC FROM MONGODB) */}
        {/* ========================================================================= */}
        <section
          id="categories"
          ref={categoriesSectionRef}
          className="w-full bg-[#FAF7EE] border-[2.5px] border-black rounded-[32px] p-5 sm:p-7 lg:p-8 shadow-[6px_6px_0px_#000]"
        >
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            
            {/* Left Header with Lightning & Crown */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <ArcadeLightningIcon className="w-7 h-7 text-[#FFE600] shrink-0" />
              <h2 className="font-black text-xl sm:text-2xl text-black tracking-wide uppercase flex items-center gap-2">
                EXPLORE CATEGORIES
                <ArcadeCrownIcon className="w-6 h-5 inline-block" />
              </h2>
            </div>

            {/* Right Subtitle & Action Link */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs sm:text-sm font-bold text-stone-700 hidden md:inline">
                Choose a category to browse subjects and play live quiz rooms.
              </span>
              <Link
                href="/categories"
                className="inline-flex items-center gap-1.5 self-start sm:self-auto bg-[#FFE600] hover:bg-[#FACC15] active:translate-x-[1px] active:translate-y-[1px] text-black font-black text-xs sm:text-sm px-4 py-2 rounded-full border-2 border-black shadow-[3px_3px_0px_#000] transition-all cursor-pointer"
              >
                <span>View All Categories</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>

          </div>

          {/* Loading Skeletons */}
          {loadingCategories && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-48 rounded-[24px] border-[2.5px] border-black bg-white p-4 shadow-[4px_4px_0px_#000] animate-pulse space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-stone-200 rounded-xl" />
                    <div className="w-20 h-5 bg-stone-200 rounded-full" />
                  </div>
                  <div className="h-5 w-3/4 bg-stone-200 rounded" />
                  <div className="h-4 w-full bg-stone-200 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State: 0 categories in database */}
          {!loadingCategories && categories.length === 0 && (
            <div className="w-full bg-white border-[2.5px] border-black rounded-[24px] p-8 text-center shadow-[4px_4px_0px_#000] space-y-2">
              <p className="font-black text-base text-black uppercase">No categories available yet.</p>
              <p className="text-xs font-bold text-stone-600">
                Active categories will appear here once published in the database.
              </p>
            </div>
          )}

          {/* Dynamic Category Cards */}
          {!loadingCategories && categories.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat, idx) => {
                const theme = CATEGORY_THEMES[idx % CATEGORY_THEMES.length];
                return (
                  <Link
                    key={cat.id || cat.slug}
                    href={`/categories/${cat.slug}`}
                    className={`group relative rounded-[24px] border-[2.5px] border-black p-4 flex flex-col justify-between ${theme.bgColor} ${theme.hoverBg} shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] transition-all cursor-pointer`}
                  >
                    <div>
                      {/* Top: Illustrated Icon and Question Count Pill */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="shrink-0 p-1 bg-white/70 rounded-xl border-2 border-black shadow-[1.5px_1.5px_0px_#000]">
                          {getCategoryIcon(cat.slug, "w-10 h-10")}
                        </div>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black bg-white border-2 border-black text-stone-900 shadow-[1px_1px_0px_#000] whitespace-nowrap">
                          {cat.questionCount || 0} Questions
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-black text-base sm:text-lg text-black mb-1 group-hover:text-black leading-snug">
                        {cat.name}
                      </h3>

                      {/* Description */}
                      <p className="text-[12px] font-bold text-stone-700 leading-snug line-clamp-3">
                        {cat.description || `Explore subjects and challenge friends in ${cat.name}.`}
                      </p>
                    </div>

                    {/* Bottom Row: Action Label + Arrow */}
                    <div className="mt-4 pt-2 border-t-2 border-black/15 flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-stone-800">
                        Explore Subjects
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full ${theme.buttonColor} ${theme.buttonHover} text-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] group-hover:scale-110 active:translate-x-[1px] active:translate-y-[1px] transition-all`}
                      >
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* SECTION D: MOST PLAYED QUIZZES (GENUINE POPULARITY FROM MONGODB) */}
        {/* ========================================================================= */}
        <section
          id="quizzes"
          ref={mostPlayedSectionRef}
          className="w-full bg-[#FAF7EE] border-[2.5px] border-black rounded-[32px] p-5 sm:p-7 lg:p-8 shadow-[6px_6px_0px_#000]"
        >
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            
            {/* Left Header with Flame & Crown */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <ArcadeFlameIcon className="w-7 h-7 text-[#F97316] shrink-0" />
              <h2 className="font-black text-xl sm:text-2xl text-black tracking-wide uppercase flex items-center gap-2">
                MOST PLAYED QUIZZES
                <ArcadeCrownIcon className="w-6 h-5 inline-block" />
              </h2>
            </div>

            {/* Right Subtitle & Action Link */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs sm:text-sm font-bold text-stone-700 hidden md:inline">
                Real community-played quizzes ranked by completed matches!
              </span>
              <Link
                href="/categories"
                className="inline-flex items-center gap-1.5 self-start sm:self-auto bg-[#FFE600] hover:bg-[#FACC15] active:translate-x-[1px] active:translate-y-[1px] text-black font-black text-xs sm:text-sm px-4 py-2 rounded-full border-2 border-black shadow-[3px_3px_0px_#000] transition-all cursor-pointer"
              >
                <span>View All Quizzes</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>

          </div>

          {/* Loading Skeletons */}
          {loadingPopular && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-44 rounded-[24px] border-[2.5px] border-black bg-white p-4 shadow-[4px_4px_0px_#000] animate-pulse space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <div className="w-8 h-5 bg-stone-200 rounded" />
                    <div className="w-8 h-8 bg-stone-200 rounded-full" />
                  </div>
                  <div className="h-5 w-3/4 bg-stone-200 rounded" />
                  <div className="h-4 w-full bg-stone-200 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State: 0 completed matches in database */}
          {!loadingPopular && popularQuizzes.length === 0 && (
            <div className="w-full bg-white border-[2.5px] border-black rounded-[24px] p-8 text-center shadow-[4px_4px_0px_#000] space-y-3">
              <div className="w-12 h-12 bg-[#FEF08A] rounded-2xl border-2 border-black flex items-center justify-center mx-auto shadow-[2px_2px_0px_#000]">
                <Flame className="w-6 h-6 text-[#F97316]" />
              </div>
              <h3 className="font-black text-lg text-black uppercase">
                No popular quizzes yet. Be the first to play!
              </h3>
              <p className="text-xs font-bold text-stone-600 max-w-md mx-auto leading-relaxed">
                Complete multiplayer or solo matches across any category above to establish the platform&apos;s leaderboard.
              </p>
              <div className="pt-2">
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFE600] border-2 border-black font-black text-xs text-black shadow-[2px_2px_0px_#000] hover:bg-[#FACC15]"
                >
                  <span>Choose a Category to Play</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </Link>
              </div>
            </div>
          )}

          {/* Real Dynamic Popular Quizzes */}
          {!loadingPopular && popularQuizzes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {popularQuizzes.map((quiz, idx) => {
                const badgeColor = RANK_BADGE_COLORS[idx % RANK_BADGE_COLORS.length];
                const key = `${quiz.categorySlug}-${quiz.subjectSlug || "mixed"}`;
                const isStartingThisSolo = startingSoloCardId === key;
                const isCreatingThisRoom = creatingRoomCardId === key;
                const isBusy = isStartingThisSolo || isCreatingThisRoom;

                return (
                  <div
                    key={quiz.id}
                    className="group relative rounded-[24px] border-[2.5px] border-black bg-white p-4 flex flex-col justify-between shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] transition-all"
                  >
                    {/* Top: Rank Bookmark & Category Icon */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md border-2 border-black font-black text-xs shadow-[1px_1px_0px_#000] ${badgeColor}`}
                      >
                        #{quiz.rank}
                      </span>

                      <div className="w-9 h-9 rounded-full bg-[#FAF7EE] border-2 border-black flex items-center justify-center p-1 shadow-[1px_1px_0px_#000]">
                        {renderQuizIcon(quiz.icon, quiz.categorySlug)}
                      </div>
                    </div>

                    {/* Quiz Details */}
                    <div className="my-1">
                      <h3 className="font-black text-base text-black mb-1 leading-snug group-hover:text-black">
                        {quiz.title}
                      </h3>
                      <p className="text-[12px] font-bold text-stone-600 leading-snug line-clamp-2">
                        {quiz.description}
                      </p>
                    </div>

                    {/* Bottom Row: Real Play Count & Play Action Button */}
                    <div className="mt-4 pt-2 border-t-2 border-stone-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-stone-700 font-bold text-xs">
                        <Users className="w-3.5 h-3.5 text-stone-900 stroke-[2.5]" />
                        <span>
                          {quiz.playedCount} {quiz.playedCount === 1 ? "played" : "played"}
                        </span>
                      </div>

                      {/* Play Button Circle */}
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => {
                          setActivePlayModalQuiz({
                            title: quiz.title,
                            categorySlug: quiz.categorySlug,
                            subjectSlug: quiz.subjectSlug,
                            isMixedCategory: quiz.isMixedCategory,
                            description: quiz.description,
                            availableQuestions: quiz.questionCount,
                          });
                        }}
                        title={`Configure & Play ${quiz.title}`}
                        className="w-9 h-9 rounded-full bg-[#FFE600] hover:bg-[#FACC15] text-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] group-hover:scale-110 active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-black text-black ml-0.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>

      {/* ========================================================================= */}
      {/* QUICK LAUNCH & MATCH CONFIGURATION MODAL */}
      {/* ========================================================================= */}
      {activePlayModalQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#FAF7EE] border-[3px] border-black rounded-[28px] p-6 shadow-[8px_8px_0px_#000] relative">
            
            {/* Close Button */}
            <button
              onClick={() => setActivePlayModalQuiz(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center text-black hover:bg-stone-100 shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFE600] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
                <ArcadeCrownIcon className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                  Quiz Configuration
                </span>
                <h3 className="text-xl font-black text-black leading-tight mt-0.5">
                  {activePlayModalQuiz.title}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-bold text-stone-700 mb-5 leading-relaxed">
              {activePlayModalQuiz.description}
            </p>

            {/* Quiz Length Selector (10, 15, 20 questions) */}
            <div className="mb-6 bg-white border-2 border-black rounded-2xl p-4 shadow-[3px_3px_0px_#000]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-stone-900 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Select Questions Count
                </span>
                <span className="text-[11px] font-bold text-stone-500">
                  Available: {activePlayModalQuiz.availableQuestions || 10}+ Qs
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[10, 15, 20].map((count) => {
                  const isSelected = selectedQuestionCount === count;
                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setSelectedQuestionCount(count)}
                      className={`py-2 px-3 rounded-xl border-2 font-black text-xs sm:text-sm transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#FFE600] text-black border-black shadow-[2px_2px_0px_#000]"
                          : "bg-[#FAF7EE] text-stone-800 border-stone-300 hover:border-black"
                      }`}
                    >
                      {count} Questions
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons: Play Solo or Play Multiplayer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  handlePlaySolo({
                    categorySlug: activePlayModalQuiz.categorySlug,
                    subjectSlug: activePlayModalQuiz.subjectSlug,
                    isMixedCategory: activePlayModalQuiz.isMixedCategory,
                    questionCount: selectedQuestionCount,
                  });
                  setActivePlayModalQuiz(null);
                }}
                className="w-full bg-[#FFE600] hover:bg-[#FACC15] active:translate-x-[1px] active:translate-y-[1px] text-black font-black text-sm py-3 px-4 rounded-full border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Play className="w-4 h-4 fill-black text-black" />
                <span>Play Solo Now</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handlePlayMultiplayer({
                    categorySlug: activePlayModalQuiz.categorySlug,
                    subjectSlug: activePlayModalQuiz.subjectSlug,
                    isMixedCategory: activePlayModalQuiz.isMixedCategory,
                    questionCount: selectedQuestionCount,
                  });
                  setActivePlayModalQuiz(null);
                }}
                className="w-full bg-[#FF4D85] hover:bg-[#F43F5E] active:translate-x-[1px] active:translate-y-[1px] text-white font-black text-sm py-3 px-4 rounded-full border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Users className="w-4 h-4 text-white" />
                <span>Host Multiplayer</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Guest Authentication Modal integration */}
      <PlayAsGuestModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
      />
    </div>
  );
}
