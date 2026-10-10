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
import { Category, Subject } from "@/types";

interface FeaturedQuiz {
  id: string;
  rank: number;
  badgeColor: string;
  title: string;
  description: string;
  categorySlug: string;
  subjectSlug?: string | null;
  isMixedCategory: boolean;
  iconType: "brain" | "globe" | "code" | "flask" | "news";
  buttonColor: string;
  playedCount: string;
}

export default function QuizzyHomePage() {
  const router = useRouter();
  const api = useApiClient();
  const { data: currentUser } = useCurrentUser();
  const isUserAuthenticated = Boolean(currentUser);

  // Backend API states
  const [categories, setCategories] = useState<Category[]>([]);
  const [gkSubjects, setGkSubjects] = useState<Subject[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

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

  // Fetch real categories from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchCategoriesData = async () => {
      try {
        const res = await api.get<{ success: boolean; data: Category[] }>("/categories");
        if (isMounted && res.data && Array.isArray(res.data)) {
          setCategories(res.data);
        }
      } catch (err) {
        console.warn("Could not fetch categories:", err);
      } finally {
        if (isMounted) setLoadingCategories(false);
      }
    };

    const fetchGkSubjects = async () => {
      try {
        const res = await api.get<{ success: boolean; data: { category: any; subjects: Subject[] } }>(
          "/categories/general-knowledge/subjects"
        );
        if (isMounted && res.data?.subjects) {
          setGkSubjects(res.data.subjects);
        }
      } catch (err) {
        console.warn("Could not fetch GK subjects:", err);
      }
    };

    fetchCategoriesData();
    fetchGkSubjects();

    return () => {
      isMounted = false;
    };
  }, []);

  // Question counts from live backend (or fallback to accurate defaults)
  const aptitudeCount = categories.find((c) => c.slug === "aptitude")?.questionCount ?? 130;
  const gkCount = categories.find((c) => c.slug === "general-knowledge")?.questionCount ?? 320;
  const programmingCount = categories.find((c) => c.slug === "programming")?.questionCount ?? 406;
  const scienceCount = gkSubjects.find((s) => s.slug === "science")?.questionCount ?? 280;
  const currentAffairsCount = gkSubjects.find((s) => s.slug === "current-affairs")?.questionCount ?? 150;

  // 5 Explore Categories matching the screenshot layout
  const exploreCategoriesList = [
    {
      id: "aptitude",
      name: "Aptitude",
      description: "Logical reasoning, quantitative analysis, verbal skills, and data interpretation",
      questionCount: aptitudeCount,
      bgColor: "bg-[#DCFCE7]", // Pastel mint green
      hoverBg: "hover:bg-[#BBF7D0]",
      buttonColor: "bg-[#0D9488]", // Teal
      buttonHover: "hover:bg-[#0F766E]",
      icon: <ArcadeBrainIcon className="w-12 h-12" />,
      categorySlug: "aptitude",
      subjectSlug: null,
      isMixedCategory: true,
    },
    {
      id: "general-knowledge",
      name: "General Knowledge",
      description: "History, geography, science, current affairs, and more",
      questionCount: gkCount,
      bgColor: "bg-[#FEF9C3]", // Pastel yellow
      hoverBg: "hover:bg-[#FEF08A]",
      buttonColor: "bg-[#F59E0B]", // Orange
      buttonHover: "hover:bg-[#D97706]",
      icon: <ArcadeLightbulbIcon className="w-12 h-12" />,
      categorySlug: "general-knowledge",
      subjectSlug: null,
      isMixedCategory: true,
    },
    {
      id: "programming",
      name: "Programming",
      description: "DSA, web development, databases, and more",
      questionCount: programmingCount,
      bgColor: "bg-[#EDE9FE]", // Pastel lavender / purple
      hoverBg: "hover:bg-[#DDD6FE]",
      buttonColor: "bg-[#7C3AED]", // Purple
      buttonHover: "hover:bg-[#6D28D9]",
      icon: <ArcadeCodeIcon className="w-12 h-12" />,
      categorySlug: "programming",
      subjectSlug: null,
      isMixedCategory: true,
    },
    {
      id: "science",
      name: "Science",
      description: "Physics, chemistry, biology, and more",
      questionCount: scienceCount,
      bgColor: "bg-[#FFE4E6]", // Pastel soft coral / pink
      hoverBg: "hover:bg-[#FECDD3]",
      buttonColor: "bg-[#EC4899]", // Magenta / Pink
      buttonHover: "hover:bg-[#DB2777]",
      icon: <ArcadeFlaskIcon className="w-12 h-12" />,
      categorySlug: "general-knowledge",
      subjectSlug: "science",
      isMixedCategory: false,
    },
    {
      id: "current-affairs",
      name: "Current Affairs",
      description: "Latest news and global events",
      questionCount: currentAffairsCount,
      bgColor: "bg-[#CFFAFE]", // Pastel sky blue
      hoverBg: "hover:bg-[#BAE6FD]",
      buttonColor: "bg-[#0284C7]", // Sky blue
      buttonHover: "hover:bg-[#0369A1]",
      icon: <ArcadeGlobeIcon className="w-12 h-12" />,
      categorySlug: "general-knowledge",
      subjectSlug: "current-affairs",
      isMixedCategory: false,
    },
  ];

  // 5 Most Played Quizzes matching the screenshot
  const mostPlayedQuizzes: FeaturedQuiz[] = [
    {
      id: "mixed-aptitude",
      rank: 1,
      badgeColor: "bg-[#FFE600] text-black", // Yellow banner #1
      title: "Mixed Aptitude",
      description: "A mix of questions covering all aptitude topics.",
      categorySlug: "aptitude",
      subjectSlug: null,
      isMixedCategory: true,
      iconType: "brain",
      buttonColor: "bg-[#10B981] hover:bg-[#059669]", // Green circle play button
      playedCount: "1.2K played",
    },
    {
      id: "general-knowledge-mix",
      rank: 2,
      badgeColor: "bg-[#2DD4BF] text-black", // Teal banner #2
      title: "General Knowledge",
      description: "Test your knowledge about the world around you.",
      categorySlug: "general-knowledge",
      subjectSlug: null,
      isMixedCategory: true,
      iconType: "globe",
      buttonColor: "bg-[#F59E0B] hover:bg-[#D97706]", // Yellow/Amber circle play button
      playedCount: "980 played",
    },
    {
      id: "programming-basics",
      rank: 3,
      badgeColor: "bg-[#FB923C] text-black", // Orange banner #3
      title: "Programming Basics",
      description: "Fundamentals of programming and computer science.",
      categorySlug: "programming",
      subjectSlug: "dsa",
      isMixedCategory: false,
      iconType: "code",
      buttonColor: "bg-[#7C3AED] hover:bg-[#6D28D9]", // Purple circle play button
      playedCount: "860 played",
    },
    {
      id: "science-mix",
      rank: 4,
      badgeColor: "bg-[#F472B6] text-black", // Pink banner #4
      title: "Science Mix",
      description: "Physics, chemistry and biology questions.",
      categorySlug: "general-knowledge",
      subjectSlug: "science",
      isMixedCategory: false,
      iconType: "flask",
      buttonColor: "bg-[#EC4899] hover:bg-[#DB2777]", // Pink circle play button
      playedCount: "720 played",
    },
    {
      id: "current-affairs-2026",
      rank: 5,
      badgeColor: "bg-[#38BDF8] text-black", // Sky blue banner #5
      title: "Current Affairs 2026",
      description: "Latest news and global events.",
      categorySlug: "general-knowledge",
      subjectSlug: "current-affairs",
      isMixedCategory: false,
      iconType: "news",
      buttonColor: "bg-[#0284C7] hover:bg-[#0369A1]", // Blue circle play button
      playedCount: "650 played",
    },
  ];

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

  const renderQuizIcon = (type: string) => {
    switch (type) {
      case "brain":
        return <ArcadeBrainIcon className="w-8 h-8" />;
      case "globe":
        return <ArcadeGlobeIcon className="w-8 h-8" />;
      case "code":
        return <ArcadeCodeIcon className="w-8 h-8" />;
      case "flask":
        return <ArcadeFlaskIcon className="w-8 h-8" />;
      case "news":
        return <ArcadeNewsIcon className="w-8 h-8" />;
      default:
        return <ArcadeBrainIcon className="w-8 h-8" />;
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
        {/* SECTION C: EXPLORE CATEGORIES (FULL WIDTH, 5 CARDS ON DESKTOP) */}
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

            {/* Right Subtitle & Action Button */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs sm:text-sm font-bold text-stone-700 hidden md:inline">
                Choose a category to browse subjects and play live quiz rooms.
              </span>
              <button
                type="button"
                onClick={() => {
                  mostPlayedSectionRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1.5 self-start sm:self-auto bg-[#FFE600] hover:bg-[#FACC15] active:translate-x-[1px] active:translate-y-[1px] text-black font-black text-xs sm:text-sm px-4 py-2 rounded-full border-2 border-black shadow-[3px_3px_0px_#000] transition-all cursor-pointer"
              >
                <span>View All Categories</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

          </div>

          {/* 5 Full-Width Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {exploreCategoriesList.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  setActivePlayModalQuiz({
                    title: cat.name,
                    categorySlug: cat.categorySlug,
                    subjectSlug: cat.subjectSlug,
                    isMixedCategory: cat.isMixedCategory,
                    description: cat.description,
                    availableQuestions: cat.questionCount,
                  });
                }}
                className={`group relative rounded-[24px] border-[2.5px] border-black p-4 flex flex-col justify-between ${cat.bgColor} ${cat.hoverBg} shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] transition-all cursor-pointer`}
              >
                <div>
                  {/* Top: Illustrated Icon and Question Count Pill */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="shrink-0 p-1">
                      {cat.icon}
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black bg-white border-2 border-black text-stone-900 shadow-[1px_1px_0px_#000] whitespace-nowrap">
                      {cat.questionCount} Questions
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-black text-base sm:text-lg text-black mb-1 group-hover:text-black leading-snug">
                    {cat.name}
                  </h3>

                  {/* Description */}
                  <p className="text-[12px] font-bold text-stone-700 leading-snug line-clamp-3">
                    {cat.description}
                  </p>
                </div>

                {/* Bottom Row: Circular Action Button */}
                <div className="mt-4 pt-2 flex items-center justify-end">
                  <button
                    aria-label={`Select ${cat.name} Category`}
                    type="button"
                    className={`w-8 h-8 rounded-full ${cat.buttonColor} ${cat.buttonHover} text-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] group-hover:scale-110 active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer`}
                  >
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION D: MOST PLAYED QUIZZES (DIRECTLY BELOW EXPLORE CATEGORIES) */}
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

            {/* Right Subtitle & Action Button */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs sm:text-sm font-bold text-stone-700 hidden md:inline">
                See what others are playing — join a quiz and compete now!
              </span>
              <button
                type="button"
                onClick={() => {
                  categoriesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1.5 self-start sm:self-auto bg-[#FFE600] hover:bg-[#FACC15] active:translate-x-[1px] active:translate-y-[1px] text-black font-black text-xs sm:text-sm px-4 py-2 rounded-full border-2 border-black shadow-[3px_3px_0px_#000] transition-all cursor-pointer"
              >
                <span>View All Quizzes</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

          </div>

          {/* 5 Quiz Cards matching the screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {mostPlayedQuizzes.map((quiz) => {
              const key = `${quiz.categorySlug}-${quiz.subjectSlug || "mixed"}`;
              const isStartingThisSolo = startingSoloCardId === key;
              const isCreatingThisRoom = creatingRoomCardId === key;
              const isBusy = isStartingThisSolo || isCreatingThisRoom;

              return (
                <div
                  key={quiz.id}
                  className="group relative rounded-[24px] border-[2.5px] border-black bg-white p-4 flex flex-col justify-between shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] transition-all"
                >
                  {/* Top-left Rank Bookmark / Badge (#1, #2, #3, #4, #5) */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md border-2 border-black font-black text-xs shadow-[1px_1px_0px_#000] ${quiz.badgeColor}`}
                    >
                      #{quiz.rank}
                    </span>

                    {/* Small category / subject icon badge */}
                    <div className="w-9 h-9 rounded-full bg-[#FAF7EE] border-2 border-black flex items-center justify-center p-1 shadow-[1px_1px_0px_#000]">
                      {renderQuizIcon(quiz.iconType)}
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

                  {/* Bottom Row: Play Count & Circular Play Button */}
                  <div className="mt-4 pt-2 border-t-2 border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-stone-700 font-bold text-xs">
                      <Users className="w-3.5 h-3.5 text-stone-900 stroke-[2.5]" />
                      <span>{quiz.playedCount}</span>
                    </div>

                    {/* Play Button Circle */}
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => {
                        handlePlaySolo({
                          categorySlug: quiz.categorySlug,
                          subjectSlug: quiz.subjectSlug,
                          isMixedCategory: quiz.isMixedCategory,
                          questionCount: selectedQuestionCount,
                        });
                      }}
                      title={`Play ${quiz.title} (Solo)`}
                      className={`w-9 h-9 rounded-full ${quiz.buttonColor} text-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] group-hover:scale-110 active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer`}
                    >
                      <Play className="w-4 h-4 fill-white stroke-white ml-0.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
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
