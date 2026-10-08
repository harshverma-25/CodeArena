"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Gamepad2,
  ArrowRight,
  Search,
  X,
  User,
  ChevronLeft,
  ChevronRight,
  Clock,
  History,
  Hourglass,
  AlertCircle,
  Play,
  Users,
  Trophy,
  Layers,
  Code2,
  Brain,
  Lightbulb,
  Palette,
  Film,
  Globe,
  Landmark,
  Languages,
  Atom,
  HelpCircle,
  LogOut,
  Shield,
  Check,
  Sparkles,
} from "lucide-react";

import { isGuestSessionActive, getGuestUser, clearGuestSession, PlayAsGuestModal, useCurrentUser } from "@/features/auth";
import { clearNativeSession, getNativeUser } from "@/features/auth/nativeAuth";
import { useApiClient } from "@/hooks/useApiClient";
import { Category, Subject } from "@/types";

// Category color palettes for visual richness
const COLOR_PALETTES = [
  { iconColor: "text-[#317a63]", iconBg: "bg-[#e8f5ee]", categoryBg: "bg-[#e8f5ee]/80", categoryText: "text-[#1e6a54]" },
  { iconColor: "text-[#d97706]", iconBg: "bg-[#fef3c7]", categoryBg: "bg-[#fef3c7]/80", categoryText: "text-[#92400e]" },
  { iconColor: "text-[#4f46e5]", iconBg: "bg-[#e0e7ff]", categoryBg: "bg-[#e0e7ff]/80", categoryText: "text-[#3730a3]" },
  { iconColor: "text-[#db2777]", iconBg: "bg-[#fce7f3]", categoryBg: "bg-[#fce7f3]/80", categoryText: "text-[#9d174d]" },
  { iconColor: "text-[#0284c7]", iconBg: "bg-[#e0f2fe]", categoryBg: "bg-[#e0f2fe]/80", categoryText: "text-[#0369a1]" },
];

const getCategoryLucideIcon = (category: Category) => {
  const slug = (category.slug || category.name || "").toLowerCase();
  if (slug.includes("prog") || slug.includes("code")) return Code2;
  if (slug.includes("apt") || slug.includes("logic")) return Brain;
  if (slug.includes("gk") || slug.includes("gen") || slug.includes("know")) return Lightbulb;
  if (slug.includes("art") || slug.includes("lit")) return Palette;
  if (slug.includes("ent") || slug.includes("mov")) return Film;
  if (slug.includes("geo")) return Globe;
  if (slug.includes("his")) return Landmark;
  if (slug.includes("lang")) return Languages;
  if (slug.includes("sci")) return Atom;
  if (slug.includes("sport")) return Trophy;
  return HelpCircle;
};

const formatTimeAgo = (dateInput?: string | Date): string => {
  if (!dateInput) return "Recently";
  const date = new Date(dateInput);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 5) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export default function StitchHomePage() {
  const router = useRouter();
  const api = useApiClient();
  const { data: currentUser } = useCurrentUser();
  const isUserAuthenticated = Boolean(currentUser);

  // Backend API states
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState<boolean>(false);

  const [recentHistory, setRecentHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  const [creatingRoomCardId, setCreatingRoomCardId] = useState<string | null>(null);
  const [startingSoloCardId, setStartingSoloCardId] = useState<string | null>(null);
  const [roomError, setRoomError] = useState<string | null>(null);

  // Form & UI state
  const [pinValue, setPinValue] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [guestActive, setGuestActive] = useState<boolean>(false);
  const [guestUser, setGuestUser] = useState<any>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Profile menu dropdown state
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const categoryTrackRef = useRef<HTMLDivElement>(null);

  // Synchronize authentication status
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

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasAccess = Boolean(isUserAuthenticated || guestActive);
  const displayName = isUserAuthenticated && currentUser
    ? currentUser.displayName || currentUser.username || "Player"
    : guestActive && guestUser
    ? guestUser.displayName || guestUser.username || "Guest Player"
    : "Player";

  // Handle Logout
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore errors
    }
    clearNativeSession();
    clearGuestSession();
    setIsProfileMenuOpen(false);
    router.push("/");
  };

  // 1. Fetch categories from backend API
  useEffect(() => {
    let isMounted = true;
    let timerId: ReturnType<typeof setTimeout>;

    const fetchCategories = async (retryCount = 0) => {
      if (retryCount === 0) setLoadingCategories(true);
      try {
        const res = await api.get<{ success: boolean; data: Category[] }>("/categories");
        if (isMounted && res.data && Array.isArray(res.data)) {
          setCategories(res.data);
          if (res.data.length > 0) {
            setSelectedCategoryId(res.data[0].id || res.data[0].slug);
          }
          setLoadingCategories(false);
          return;
        }
      } catch (err) {
        if (retryCount < 3) {
          timerId = setTimeout(() => {
            if (isMounted) fetchCategories(retryCount + 1);
          }, 1500);
          return;
        }
        console.warn("Could not fetch categories:", err);
      }
      if (isMounted) {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
    return () => {
      isMounted = false;
      clearTimeout(timerId);
    };
  }, []);

  // 2. Fetch subjects whenever selected category changes
  useEffect(() => {
    if (!selectedCategoryId) return;
    let isMounted = true;
    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      try {
        const res = await api.get<{ success: boolean; data: Subject[] }>(
          `/categories/${selectedCategoryId}/subjects`
        );
        if (isMounted && res.data && Array.isArray(res.data)) {
          setSubjects(res.data);
        }
      } catch (err) {
        console.warn("Could not fetch subjects:", err);
        if (isMounted) setSubjects([]);
      } finally {
        if (isMounted) setLoadingSubjects(false);
      }
    };
    fetchSubjects();
    return () => { isMounted = false; };
  }, [selectedCategoryId]);

  // 3. Fetch recently played history if user is logged in
  useEffect(() => {
    if (!hasAccess) {
      setRecentHistory([]);
      return;
    }
    let isMounted = true;
    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const res = await api.get<{ success: boolean; data: { matches: any[] } }>("/history?limit=3");
        if (isMounted && res.data?.matches) {
          setRecentHistory(res.data.matches);
        }
      } catch (err) {
        if (isMounted) setRecentHistory([]);
      } finally {
        if (isMounted) setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [hasAccess]);

  // Category horizontal scroll controls
  const handleScrollLeft = () => {
    if (categoryTrackRef.current) {
      categoryTrackRef.current.scrollBy({ left: -260, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (categoryTrackRef.current) {
      categoryTrackRef.current.scrollBy({ left: 260, behavior: "smooth" });
    }
  };

  // Join quiz by PIN form submission
  const handleJoinPin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinValue.trim().toUpperCase();
    if (!cleanPin) return;

    if (!hasAccess) {
      setIsGuestModalOpen(true);
      return;
    }

    router.push(`/lobby/${cleanPin}`);
  };

  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(10);

  // Launch direct solo quiz session without multiplayer lobby
  const handlePlaySoloQuiz = async (quiz: {
    cardId: string;
    categoryId: string;
    subjectId?: string | null;
    isMixedCategory?: boolean;
  }) => {
    if (!hasAccess) {
      setIsGuestModalOpen(true);
      return;
    }

    setStartingSoloCardId(quiz.cardId);
    setRoomError(null);

    try {
      const res = await api.post<{ success: boolean; data: { roomCode: string; battleId: string } }>("/rooms/solo", {
        categoryId: quiz.categoryId,
        subjectId: quiz.isMixedCategory ? null : quiz.subjectId,
        isMixedCategory: Boolean(quiz.isMixedCategory),
        questionCount: selectedQuestionCount,
      });

      if (res.data?.roomCode) {
        router.push(`/battle/${res.data.roomCode}`);
      } else {
        throw new Error("Failed to start solo quiz session.");
      }
    } catch (err: any) {
      setRoomError(err.message || "Failed to start solo quiz. Please try again.");
    } finally {
      setStartingSoloCardId(null);
    }
  };

  // Launch quiz room with real backend payload
  const handlePlayQuizCard = async (quiz: {
    cardId: string;
    categoryId: string;
    subjectId?: string | null;
    isMixedCategory?: boolean;
  }) => {
    if (!hasAccess) {
      setIsGuestModalOpen(true);
      return;
    }

    setCreatingRoomCardId(quiz.cardId);
    setRoomError(null);

    try {
      const res = await api.post<{ success: boolean; data: { roomCode: string } }>("/rooms", {
        categoryId: quiz.categoryId,
        subjectId: quiz.isMixedCategory ? null : quiz.subjectId,
        isMixedCategory: Boolean(quiz.isMixedCategory),
        questionCount: selectedQuestionCount,
      });

      if (res.data?.roomCode) {
        router.push(`/lobby/${res.data.roomCode}`);
      } else {
        throw new Error("Failed to retrieve valid room code from server.");
      }
    } catch (err: any) {
      setRoomError(err.message || "Failed to create quiz room. Please try again.");
    } finally {
      setCreatingRoomCardId(null);
    }
  };

  // Derive current category metadata and derived quiz cards
  const currentCategory = categories.find(
    (c) => c.id === selectedCategoryId || c.slug === selectedCategoryId
  ) || (categories.length > 0 ? categories[0] : null);

  const getAvailableLengths = (count: number) => {
    const lengths: number[] = [];
    if (count >= 10) lengths.push(10);
    if (count >= 15) lengths.push(15);
    if (count >= 20) lengths.push(20);
    return lengths;
  };

  const mixedQuizCard = currentCategory
    ? {
        cardId: `mixed-${currentCategory.id}`,
        title: `Mixed ${currentCategory.name}`,
        category: currentCategory.name,
        description: `Randomized mix of questions covering all subjects in ${currentCategory.name}.`,
        questionCount: currentCategory.questionCount || 0,
        availableLengths: currentCategory.availableLengths ?? getAvailableLengths(currentCategory.questionCount || 0),
        isPlayable: currentCategory.isPlayable ?? ((currentCategory.questionCount || 0) >= 10),
        isMixedCategory: true,
        categoryId: currentCategory.id,
        subjectId: null,
      }
    : null;

  const subjectQuizCards = subjects.map((sub) => ({
    cardId: sub.id,
    title: sub.name,
    category: currentCategory?.name || "Subject",
    description: sub.description || `Test your grasp on ${sub.name} concepts and problems.`,
    questionCount: sub.questionCount || 0,
    availableLengths: sub.availableLengths ?? getAvailableLengths(sub.questionCount || 0),
    isPlayable: sub.isPlayable ?? ((sub.questionCount || 0) >= 10),
    isMixedCategory: false,
    categoryId: sub.categoryId || currentCategory?.id || selectedCategoryId,
    subjectId: sub.id,
  }));

  const allQuizCards = [
    ...(mixedQuizCard ? [mixedQuizCard] : []),
    ...subjectQuizCards,
  ];

  // Apply filters (type filter + real-time search query)
  const filteredQuizCards = allQuizCards.filter((card) => {
    if (activeFilter === "mixed" && !card.isMixedCategory) return false;
    if (activeFilter === "subjects" && card.isMixedCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = card.title.toLowerCase().includes(q);
      const matchDesc = card.description.toLowerCase().includes(q);
      const matchCat = card.category.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchCat;
    }

    return true;
  });

  // Calculate highest question count available in currently filtered view
  const maxQuestionsInView = filteredQuizCards.reduce(
    (max, card) => Math.max(max, card.questionCount),
    0
  );

  // Auto-correct selectedQuestionCount when category, subjects, or filter changes
  useEffect(() => {
    if (maxQuestionsInView >= 20) {
      return;
    }
    if (maxQuestionsInView >= 15) {
      if (selectedQuestionCount > 15) {
        setSelectedQuestionCount(15);
      }
      return;
    }
    if (maxQuestionsInView >= 10) {
      if (selectedQuestionCount > 10) {
        setSelectedQuestionCount(10);
      }
      return;
    }
    if (selectedQuestionCount !== 10) {
      setSelectedQuestionCount(10);
    }
  }, [maxQuestionsInView, selectedQuestionCount]);

  return (
    <div className="stitch-scope min-h-screen bg-surface font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* 1. FIXED NAVBAR WITH BLUR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff8f0]/90 backdrop-blur-xl border-b border-[#ede7de] shadow-[0_2px_8px_-2px_rgba(60,52,42,0.04)]">
        <div className="h-20 w-full max-w-[1240px] mx-auto px-margin-sm lg:px-margin flex items-center justify-between gap-space-md">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-space-md shrink-0">
            <Link className="flex items-center gap-2 group" href="/">
              <img
                alt="Quizzy Logo"
                className="h-9 w-auto object-contain"
                src="/images/quizzy-logo.png"
              />
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors">
                Quizzy
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1.5 ml-space-md p-1 bg-surface-container-low rounded-full">
              <Link
                href="/"
                className="px-3.5 py-1.5 transition-colors bg-[#317a63] text-white font-bold text-xs rounded-full shadow-sm flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                Quizzes
              </Link>
              <Link
                href="/leaderboard"
                className="px-3.5 py-1.5 transition-colors text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-bold text-xs rounded-full flex items-center gap-1.5"
              >
                <Trophy className="w-3.5 h-3.5" />
                Leaderboard
              </Link>
              <Link
                href="/history"
                className="px-3.5 py-1.5 transition-colors text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-bold text-xs rounded-full flex items-center gap-1.5"
              >
                <History className="w-3.5 h-3.5" />
                History
              </Link>
            </nav>
          </div>

          {/* Center: PIN Joining Interface */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-[380px]">
            <form
              onSubmit={handleJoinPin}
              className="w-full flex items-center justify-between bg-tertiary-fixed/40 border border-tertiary-fixed-dim/60 rounded-full pl-3.5 pr-1.5 py-1.5 shadow-[0_2px_8px_-2px_rgba(60,52,42,0.04)]"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Gamepad2 className="w-5 h-5 text-tertiary shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-on-tertiary-fixed-variant leading-none uppercase tracking-wider font-bold">
                    Join Room
                  </span>
                  <span className="text-xs text-on-surface leading-tight font-semibold">
                    Enter PIN
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  className="w-24 px-2.5 py-1 bg-surface-container-lowest rounded-full text-xs text-on-surface placeholder:text-outline text-center tracking-wider focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-surface-container-highest uppercase font-bold"
                  maxLength={6}
                  placeholder="123 456"
                  type="text"
                  value={pinValue}
                  onChange={(e) => setPinValue(e.target.value)}
                />
                <button
                  aria-label="Join Quiz by PIN"
                  className="h-8 w-8 rounded-full bg-primary hover:bg-primary-container text-on-primary flex items-center justify-center transition-all transform hover:-translate-y-0.5 shadow-sm active:translate-y-0 cursor-pointer"
                  type="submit"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Right: Functional Search & Profile Section */}
          <div className="flex items-center gap-space-sm shrink-0">
            {/* Functional Real-Time Search Bar / Toggle */}
            {isSearchActive ? (
              <div className="flex items-center gap-1.5 bg-surface-container-lowest border border-primary/50 rounded-full px-3 py-1 shadow-sm transition-all animate-in fade-in duration-150">
                <Search className="w-4 h-4 text-primary shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search quizzes..."
                  className="w-32 sm:w-44 bg-transparent text-xs text-on-surface focus:outline-none font-medium"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchActive(false);
                  }}
                  className="text-on-surface-variant hover:text-on-surface cursor-pointer p-0.5"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                aria-label="Search quizzes"
                onClick={() => setIsSearchActive(true)}
                className="h-10 w-10 rounded-full bg-surface-container-lowest border border-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:border-outline-variant transition-colors cursor-pointer shadow-sm"
                type="button"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Profile Section & Dropdown Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => {
                  if (!hasAccess) {
                    setIsGuestModalOpen(true);
                  } else {
                    setIsProfileMenuOpen((prev) => !prev);
                  }
                }}
                className="flex items-center gap-2 pl-1 pr-3 py-1 bg-surface-container-lowest border border-surface-container-highest rounded-full shadow-sm cursor-pointer hover:border-primary/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                  {isUserAuthenticated && currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-on-primary" />
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left pr-1">
                  <span className="font-label-md text-label-md text-on-surface leading-none font-semibold truncate max-w-[120px]">
                    {displayName}
                  </span>
                  {guestActive && (
                    <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">
                      Guest
                    </span>
                  )}
                </div>
              </button>

              {/* Profile Dropdown Popover */}
              {isProfileMenuOpen && hasAccess && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#ede7de] shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-[#ede7de]">
                    <p className="text-xs font-bold text-on-surface truncate">{displayName}</p>
                    <p className="text-[11px] text-on-surface-variant truncate">
                      {isUserAuthenticated ? currentUser?.email || "Registered Player" : "Guest Session Active"}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-on-surface hover:bg-[#f9f3ea] transition-colors"
                    >
                      <User className="w-4 h-4 text-[#317a63]" />
                      My Profile
                    </Link>
                    <Link
                      href="/history"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-on-surface hover:bg-[#f9f3ea] transition-colors"
                    >
                      <History className="w-4 h-4 text-[#317a63]" />
                      Match History
                    </Link>
                    <Link
                      href="/leaderboard"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-on-surface hover:bg-[#f9f3ea] transition-colors"
                    >
                      <Trophy className="w-4 h-4 text-[#317a63]" />
                      Leaderboard
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-[#ede7de]">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#9f2b1d] hover:bg-[#ffdad6]/40 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      {guestActive ? "Exit Guest Mode" : "Log Out"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN PAGE CONTENT */}
      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-180px)]">
        <div className="flex flex-col w-full">
          <div className="w-full max-w-[1240px] mx-auto px-margin-sm lg:px-margin pb-space-2xl">
            {/* SECTION 1: TOP HERO / WELCOME BANNER */}
            <section className="mt-space-md mb-space-xl">
              <div className="bg-surface-container-lowest rounded-[28px] p-space-lg lg:p-space-xl shadow-[0_2px_12px_-3px_rgba(60,52,42,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-space-lg relative overflow-hidden border border-surface-container-highest">
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10 space-y-space-xs max-w-2xl">
                  <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm tracking-wide uppercase">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    ⚡ Real-Time Multiplayer Trivia
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                    Welcome to Quizzy, {displayName.split(" ")[0]}! 🎮
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Pick a category, test yourself solo, or challenge friends to an instant quiz showdown!
                  </p>
                </div>
              </div>
            </section>

            {/* Error Notification banner if room creation fails */}
            {roomError && (
              <div className="mb-space-md p-space-md rounded-2xl bg-error/10 border border-error/30 text-error flex items-center justify-between">
                <span className="font-body-md text-body-md font-semibold">{roomError}</span>
                <button
                  onClick={() => setRoomError(null)}
                  className="text-error font-bold text-sm px-2 py-1 hover:bg-error/20 rounded-lg cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* SECTION 2: CATEGORY NAVIGATION BAR */}
            <section className="mb-space-2xl">
              <div className="flex items-center justify-between gap-space-md mb-space-sm">
                <span className="font-label-md text-label-md font-bold uppercase tracking-wider text-on-surface-variant">
                  Categories
                </span>
                <div className="flex items-center gap-1 text-on-surface-variant">
                  <button
                    aria-label="Scroll categories left"
                    className="w-8 h-8 rounded-full bg-surface-container-lowest hover:bg-surface-container-high flex items-center justify-center transition-colors shadow-sm cursor-pointer border border-surface-container-highest"
                    onClick={handleScrollLeft}
                    type="button"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    aria-label="Scroll categories right"
                    className="w-8 h-8 rounded-full bg-surface-container-lowest hover:bg-surface-container-high flex items-center justify-center transition-colors shadow-sm cursor-pointer border border-surface-container-highest"
                    onClick={handleScrollRight}
                    type="button"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Horizontal Category Pill Track */}
              <div
                ref={categoryTrackRef}
                className="flex items-center gap-space-sm overflow-x-auto pb-2 scroll-smooth no-scrollbar select-none"
              >
                {loadingCategories ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="shrink-0 h-11 w-36 rounded-full bg-surface-container-low animate-pulse"
                    />
                  ))
                ) : (
                  categories.map((cat, idx) => {
                    const isSelected =
                      selectedCategoryId === cat.id || selectedCategoryId === cat.slug;
                    const palette = COLOR_PALETTES[idx % COLOR_PALETTES.length];
                    const IconComponent = getCategoryLucideIcon(cat);

                    return (
                      <button
                        key={cat.id || cat.slug}
                        onClick={() => setSelectedCategoryId(cat.id || cat.slug)}
                        className={`shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-full transition-all transform hover:-translate-y-0.5 cursor-pointer ${
                          isSelected
                            ? "bg-surface-container-lowest shadow-[0_4px_14px_-2px_rgba(49,122,99,0.18)] border border-primary/40"
                            : "bg-surface-container-lowest hover:bg-surface-container-low shadow-sm border border-surface-container-highest"
                        }`}
                        type="button"
                      >
                        {isSelected && (
                          <span className="w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary-fixed animate-pulse"></span>
                        )}
                        <span
                          className={`w-7 h-7 rounded-full ${palette.iconBg} ${palette.iconColor} flex items-center justify-center`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </span>
                        <span
                          className={`font-label-md text-label-md ${
                            isSelected ? "text-primary font-bold" : "text-on-surface font-semibold"
                          }`}
                        >
                          {cat.name}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </section>

            {/* SECTION 3: RECENTLY PLAYED */}
            <section className="mb-space-2xl">
              <div className="flex items-end justify-between mb-space-lg">
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                    Pick up where you left off
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-0.5 font-bold">
                    Recent Games
                  </h2>
                </div>
                <Link
                  className="font-label-md text-label-md text-primary font-bold hover:text-primary-container flex items-center gap-1 transition-colors"
                  href="/history"
                >
                  View Full History
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {loadingHistory ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-48 rounded-[24px] bg-surface-container-low animate-pulse"
                    />
                  ))}
                </div>
              ) : recentHistory.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                  {recentHistory.map((item) => {
                    const topicName = item.topic || "Quiz";
                    const timeStr = formatTimeAgo(item.endedAt || item.startedAt);
                    const userScore = item.userScore ?? 0;
                    const resultText = item.result || "COMPLETED";

                    return (
                      <div
                        key={item._id}
                        className="bg-surface-container-lowest rounded-[24px] p-space-md shadow-[0_2px_8px_-2px_rgba(60,52,42,0.04)] hover:shadow-[0_8px_24px_-6px_rgba(60,52,42,0.07)] transition-all flex flex-col justify-between group border border-surface-container-highest"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-space-xs">
                            <span className="px-3 py-1 rounded-full bg-primary-fixed/60 text-primary font-label-sm text-label-sm font-semibold">
                              {topicName}
                            </span>
                            <span className="text-label-sm font-label-sm text-on-surface-variant flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> {timeStr}
                            </span>
                          </div>
                          <h3 className="font-headline-sm text-headline-sm text-on-surface tracking-tight mt-space-sm mb-space-xs group-hover:text-primary transition-colors font-bold">
                            {topicName} Quiz
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                            Room: <span className="font-mono font-bold">{item.roomCode || "N/A"}</span> • {item.questionCount || 10} Questions
                          </p>
                        </div>
                        <div className="pt-space-sm space-y-space-md border-t border-surface-container-low">
                          <div className="flex items-center justify-between text-label-sm font-label-sm">
                            <span className="text-on-surface-variant">Result</span>
                            <span className="font-bold text-primary">{userScore} Pts ({resultText})</span>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                              {item.difficulty || "Standard"}
                            </span>
                            <button
                              onClick={() => router.push(`/results/${item._id}`)}
                              className="px-5 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold transition-all shadow-sm cursor-pointer"
                              type="button"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full bg-surface-container-lowest rounded-[24px] p-space-xl text-center border border-dashed border-surface-container-highest">
                  <History className="w-10 h-10 text-on-surface-variant mb-2 opacity-60 mx-auto" />
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    No Recent Games
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mt-1">
                    Select a quiz below to start your first game!
                  </p>
                </div>
              )}
            </section>

            {/* SECTION 4: QUIZ DISCOVERY & SUBJECT CARDS */}
            <section className="mb-space-2xl">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                    Choose a Quiz
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-0.5 font-bold">
                    {searchQuery.trim()
                      ? `Search Results for "${searchQuery}"`
                      : currentCategory
                      ? `Quizzes in ${currentCategory.name}`
                      : "Available Quizzes"}
                  </h2>
                </div>
                {/* Segmented Filter Controls & Question Count Selector */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-sm self-start md:self-auto max-w-full">
                  {/* Category / Subject Filter */}
                  <div className="inline-flex p-1 bg-surface-container rounded-full overflow-x-auto max-w-full">
                    <button
                      onClick={() => setActiveFilter("all")}
                      className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                        activeFilter === "all"
                          ? "bg-surface-container-lowest text-on-surface shadow-sm font-bold"
                          : "text-on-surface-variant font-semibold hover:text-on-surface"
                      }`}
                      type="button"
                    >
                      All ({filteredQuizCards.length})
                    </button>
                    <button
                      onClick={() => setActiveFilter("subjects")}
                      className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                        activeFilter === "subjects"
                          ? "bg-surface-container-lowest text-on-surface shadow-sm font-bold"
                          : "text-on-surface-variant font-semibold hover:text-on-surface"
                      }`}
                      type="button"
                    >
                      Subjects ({subjectQuizCards.length})
                    </button>
                    <button
                      onClick={() => setActiveFilter("mixed")}
                      className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                        activeFilter === "mixed"
                          ? "bg-surface-container-lowest text-on-surface shadow-sm font-bold"
                          : "text-on-surface-variant font-semibold hover:text-on-surface"
                      }`}
                      type="button"
                    >
                      Mixed Mode
                    </button>
                  </div>

                  {/* Question Count Selector (10, 15, 20) */}
                  <div className="inline-flex items-center gap-1 p-1 bg-tertiary-fixed/30 border border-tertiary-fixed-dim/40 rounded-full">
                    <span className="text-xs font-bold text-tertiary px-2 uppercase font-mono">Length:</span>
                    {[10, 15, 20].map((countOption) => {
                      const isOptionAvailable = maxQuestionsInView >= countOption;
                      return (
                        <button
                          key={countOption}
                          disabled={!isOptionAvailable}
                          onClick={() => isOptionAvailable && setSelectedQuestionCount(countOption)}
                          className={`px-3 py-1 rounded-full font-label-sm text-label-sm transition-all ${
                            !isOptionAvailable
                              ? "opacity-40 cursor-not-allowed text-on-surface-variant line-through"
                              : selectedQuestionCount === countOption
                              ? "bg-tertiary text-on-tertiary shadow-sm font-bold cursor-pointer"
                              : "text-on-surface-variant hover:text-on-surface font-semibold cursor-pointer"
                          }`}
                          title={
                            !isOptionAvailable
                              ? `Requires at least ${countOption} published questions (max available: ${maxQuestionsInView})`
                              : `Set quiz length to ${countOption} questions`
                          }
                          type="button"
                        >
                          {countOption} Qs
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {loadingSubjects ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-56 rounded-[28px] bg-surface-container-low animate-pulse" />
                  ))}
                </div>
              ) : filteredQuizCards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                  {filteredQuizCards.map((quiz) => {
                    const isCreatingThis = creatingRoomCardId === quiz.cardId;
                    const isStartingThisSolo = startingSoloCardId === quiz.cardId;
                    const isBusy = isCreatingThis || isStartingThisSolo;
                    const hasEnoughQuestions = quiz.questionCount >= selectedQuestionCount;

                    return (
                      <div
                        key={quiz.cardId}
                        className={`bg-surface-container-lowest rounded-[28px] p-space-md shadow-[0_2px_8px_-2px_rgba(60,52,42,0.04)] hover:shadow-[0_8px_24px_-6px_rgba(60,52,42,0.07)] transition-all flex flex-col justify-between group border ${
                          quiz.isMixedCategory
                            ? "border-primary/40 bg-gradient-to-br from-surface-container-lowest to-primary-fixed/10"
                            : "border-surface-container-highest"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-space-md">
                            <span
                              className={`px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold ${
                                quiz.questionCount === 0
                                  ? "bg-surface-container-high text-on-surface-variant/80 border border-surface-container-highest"
                                  : quiz.questionCount < 10
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                  : quiz.isMixedCategory
                                  ? "bg-primary text-on-primary"
                                  : "bg-surface-container-high text-on-surface-variant"
                              }`}
                            >
                              {quiz.questionCount === 0
                                ? "Coming Soon"
                                : quiz.questionCount < 10
                                ? "Not Enough Questions"
                                : quiz.isMixedCategory
                                ? "Mixed Pool"
                                : quiz.category}
                            </span>
                          </div>

                          <h3 className="font-headline-sm text-headline-sm text-on-surface tracking-tight mb-space-xs group-hover:text-primary transition-colors font-bold">
                            {quiz.title}
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                            {quiz.description}
                          </p>
                        </div>

                        <div className="pt-space-md mt-space-sm flex flex-col gap-2.5 border-t border-surface-container-low">
                          <div className="flex items-center justify-between text-xs">
                            {quiz.questionCount === 0 ? (
                              <>
                                <span className="font-label-md text-label-md text-on-surface-variant font-medium flex items-center gap-1">
                                  <Hourglass className="w-3.5 h-3.5" />
                                  Coming Soon
                                </span>
                                <span className="font-semibold text-on-surface-variant">
                                  0 Questions
                                </span>
                              </>
                            ) : quiz.questionCount < 10 ? (
                              <>
                                <span className="font-label-md text-label-md text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  Not enough questions yet
                                </span>
                                <span className="font-semibold text-on-surface-variant">
                                  {quiz.questionCount}/10 Qs
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                                  {quiz.questionCount} Qs Available
                                </span>
                                {!hasEnoughQuestions ? (
                                  <span className="font-bold text-error">
                                    Requires {selectedQuestionCount} Qs
                                  </span>
                                ) : (
                                  <span className="font-medium text-primary text-xs">
                                    Supports {quiz.availableLengths.join('/')} Qs
                                  </span>
                                )}
                              </>
                            )}
                          </div>

                          {quiz.questionCount === 0 ? (
                            <div className="grid grid-cols-1">
                              <button
                                disabled
                                className="w-full px-3 py-2 rounded-full font-label-md text-label-md font-semibold bg-surface-container-high text-on-surface-variant/60 cursor-not-allowed text-center"
                                type="button"
                              >
                                Coming Soon (0 Questions)
                              </button>
                            </div>
                          ) : quiz.questionCount < 10 ? (
                            <div className="grid grid-cols-1">
                              <button
                                disabled
                                className="w-full px-3 py-2 rounded-full font-label-md text-label-md font-semibold bg-surface-container-high text-on-surface-variant/60 cursor-not-allowed text-center"
                                type="button"
                              >
                                Not enough questions yet ({quiz.questionCount}/10 Qs)
                              </button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              {/* Solo Quiz (Direct Gameplay) */}
                              <button
                                disabled={isBusy || !hasEnoughQuestions}
                                onClick={() => handlePlaySoloQuiz(quiz)}
                                className={`px-3 py-2 rounded-full font-label-md text-label-md font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                                  hasEnoughQuestions
                                    ? "bg-primary hover:bg-primary-container text-on-primary hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                                    : "bg-surface-container-high text-on-surface-variant opacity-60 cursor-not-allowed"
                                }`}
                                type="button"
                                title={
                                  hasEnoughQuestions
                                    ? "Start solo quiz directly without a lobby"
                                    : `This quiz has only ${quiz.questionCount} questions. Select a smaller quiz length (${quiz.availableLengths.join(' or ')})`
                                }
                              >
                                <Play className="w-4 h-4 fill-current" />
                                <span>
                                  {isStartingThisSolo ? "Starting..." : "Solo Quiz"}
                                </span>
                              </button>

                              {/* Multiplayer (Room Lobby) */}
                              <button
                                disabled={isBusy || !hasEnoughQuestions}
                                onClick={() => handlePlayQuizCard(quiz)}
                                className={`px-3 py-2 rounded-full font-label-md text-label-md font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                                  hasEnoughQuestions
                                    ? "bg-surface-container-high hover:bg-surface-container-highest text-on-surface hover:-translate-y-0.5 active:translate-y-0 border border-outline-variant/40 cursor-pointer"
                                    : "bg-surface-container-high text-on-surface-variant opacity-60 cursor-not-allowed"
                                }`}
                                type="button"
                                title={
                                  hasEnoughQuestions
                                    ? "Create 1–4 player room to invite friends"
                                    : `This quiz has only ${quiz.questionCount} questions. Select a smaller quiz length (${quiz.availableLengths.join(' or ')})`
                                }
                              >
                                <Users className="w-4 h-4" />
                                <span>
                                  {isCreatingThis ? "Creating..." : "Multiplayer"}
                                </span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full bg-surface-container-lowest rounded-[24px] p-space-xl text-center border border-dashed border-surface-container-highest">
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {searchQuery.trim()
                      ? `No quizzes matched "${searchQuery}". Try a different keyword.`
                      : "No subjects found for this category yet. Select another category from above."}
                  </p>
                </div>
              )}
            </section>

            {/* SECTION 5: EXPLORE ALL CATEGORIES */}
            <section>
              <div className="mb-space-lg">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                  All Topics
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-0.5 font-bold">
                  Explore Categories
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Choose a category to browse individual subjects and play live quiz rooms.
                </p>
              </div>

              {loadingCategories ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-44 rounded-[28px] bg-surface-container-low animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                  {categories.map((cat, idx) => {
                    const palette = COLOR_PALETTES[idx % COLOR_PALETTES.length];
                    const IconComponent = getCategoryLucideIcon(cat);

                    return (
                      <div
                        key={cat.id || cat.slug}
                        onClick={() => {
                          setSelectedCategoryId(cat.id || cat.slug);
                          window.scrollTo({ top: 380, behavior: "smooth" });
                        }}
                        className={`group rounded-[28px] p-space-lg bg-surface-container-lowest hover:bg-surface-container-low transition-all flex flex-col justify-between shadow-[0_2px_8px_-2px_rgba(60,52,42,0.03)] transform hover:-translate-y-1 cursor-pointer border border-surface-container-highest`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-space-md">
                            <div
                              className={`w-12 h-12 rounded-2xl ${palette.iconBg} ${palette.iconColor} flex items-center justify-center shadow-sm`}
                            >
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full bg-surface-container-lowest font-label-sm text-label-sm font-bold ${palette.iconColor} shadow-sm border border-surface-container-highest`}
                            >
                              {cat.questionCount || 0} Questions
                            </span>
                          </div>
                          <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight group-hover:text-primary transition-colors font-bold">
                            {cat.name}
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 line-clamp-2">
                            {cat.description || `Browse subjects and mixed question pools in ${cat.name}.`}
                          </p>
                        </div>
                        <div className="mt-space-lg pt-space-sm flex items-center justify-between text-on-surface-variant">
                          <span className="font-label-sm text-label-sm font-semibold text-primary">
                            Explore Subjects
                          </span>
                          <span className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-sm border border-surface-container-highest">
                            <ArrowRight className={`w-4 h-4 ${palette.iconColor}`} />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* 3. FOOTER */}
      <footer className="w-full bg-surface-container-low border-t border-surface-container-highest py-space-xl mt-space-2xl">
        <div className="max-w-[1240px] mx-auto px-margin-sm lg:px-margin flex flex-col md:flex-row items-center justify-between gap-space-lg">
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-xs">
              <img
                alt="Quizzy Logo"
                className="h-7 w-auto object-contain"
                src="/images/quizzy-logo.png"
              />
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Quizzy
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant hidden sm:block">
              — Fast, fun multiplayer quizzes with friends.
            </p>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-space-lg text-on-surface-variant font-label-md text-label-md">
            <Link className="hover:text-on-surface transition-colors" href="/">
              Quizzes
            </Link>
            <Link className="hover:text-on-surface transition-colors" href="/leaderboard">
              Leaderboard
            </Link>
            <Link className="hover:text-on-surface transition-colors" href="/history">
              History
            </Link>
            <Link className="hover:text-on-surface transition-colors" href="/profile">
              Profile
            </Link>
          </nav>
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            © 2025 Quizzy. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Guest Authentication Modal integration */}
      <PlayAsGuestModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
      />
    </div>
  );
}
