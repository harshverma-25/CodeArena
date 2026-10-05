"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isGuestSessionActive, getGuestUser, PlayAsGuestModal, useCurrentUser } from "@/features/auth";
import { useApiClient } from "@/hooks/useApiClient";
import { Category, Subject } from "@/types";

// Category color palettes for visual richness
const COLOR_PALETTES = [
  { iconColor: "text-primary", iconBg: "bg-primary-fixed/70", categoryBg: "bg-primary-fixed/80", categoryText: "text-on-primary-fixed" },
  { iconColor: "text-secondary", iconBg: "bg-secondary-fixed/50", categoryBg: "bg-secondary-fixed/80", categoryText: "text-on-secondary-fixed" },
  { iconColor: "text-on-surface-variant", iconBg: "bg-surface-container-high", categoryBg: "bg-surface-container-high/90", categoryText: "text-on-surface" },
  { iconColor: "text-tertiary", iconBg: "bg-tertiary-fixed/50", categoryBg: "bg-tertiary-fixed/80", categoryText: "text-on-tertiary-fixed" },
  { iconColor: "text-on-tertiary-fixed-variant", iconBg: "bg-tertiary-fixed-dim/40", categoryBg: "bg-tertiary-fixed-dim/40", categoryText: "text-on-tertiary-fixed-variant" },
];

const getCategoryIcon = (category: Category): string => {
  if (category.icon) return category.icon;
  const slug = (category.slug || category.name || "").toLowerCase();
  if (slug.includes("prog") || slug.includes("code")) return "terminal";
  if (slug.includes("apt") || slug.includes("logic")) return "psychology";
  if (slug.includes("gk") || slug.includes("gen") || slug.includes("know")) return "lightbulb";
  if (slug.includes("art") || slug.includes("lit")) return "palette";
  if (slug.includes("ent") || slug.includes("mov")) return "movie";
  if (slug.includes("geo")) return "public";
  if (slug.includes("his")) return "account_balance";
  if (slug.includes("lang")) return "translate";
  if (slug.includes("sci")) return "biotech";
  if (slug.includes("sport")) return "sports_basketball";
  return "quiz";
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
  const [roomError, setRoomError] = useState<string | null>(null);

  // Form & UI state
  const [pinValue, setPinValue] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [guestActive, setGuestActive] = useState<boolean>(false);
  const [guestUser, setGuestUser] = useState<any>(null);

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

  const hasAccess = Boolean(isUserAuthenticated || guestActive);
  const displayName = isUserAuthenticated && currentUser
    ? currentUser.displayName || currentUser.username || "Player"
    : guestActive && guestUser
    ? guestUser.displayName || guestUser.username || "Guest Player"
    : "Player";

  // 1. Fetch categories from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await api.get<{ success: boolean; data: Category[] }>("/categories");
        if (isMounted && res.data && Array.isArray(res.data)) {
          setCategories(res.data);
          if (res.data.length > 0) {
            setSelectedCategoryId(res.data[0].id || res.data[0].slug);
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        if (isMounted) setLoadingCategories(false);
      }
    };
    fetchCategories();
    return () => { isMounted = false; };
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
        console.error("Failed to fetch subjects:", err);
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

  // Toggle bookmark icon
  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(10);

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
      setRoomError(err.message || "Failed to create battle room. Please try again.");
    } finally {
      setCreatingRoomCardId(null);
    }
  };

  // Derive current category metadata and derived quiz cards
  const currentCategory = categories.find(
    (c) => c.id === selectedCategoryId || c.slug === selectedCategoryId
  ) || (categories.length > 0 ? categories[0] : null);

  const mixedQuizCard = currentCategory
    ? {
        cardId: `mixed-${currentCategory.id}`,
        title: `Mixed ${currentCategory.name}`,
        category: currentCategory.name,
        description: `Randomized mix of questions covering all subjects in ${currentCategory.name}.`,
        questionCount: currentCategory.questionCount || 0,
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
    isMixedCategory: false,
    categoryId: sub.categoryId || currentCategory?.id || selectedCategoryId,
    subjectId: sub.id,
  }));

  const allQuizCards = [
    ...(mixedQuizCard ? [mixedQuizCard] : []),
    ...subjectQuizCards,
  ];

  const filteredQuizCards = allQuizCards.filter((card) => {
    if (activeFilter === "mixed") return card.isMixedCategory;
    if (activeFilter === "subjects") return !card.isMixedCategory;
    return true;
  });

  return (
    <div className="stitch-scope min-h-screen bg-surface font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* 1. FIXED NAVBAR WITH BLUR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl border-b border-surface-container-highest shadow-[0_2px_8px_-2px_rgba(60,52,42,0.04),0_1px_3px_-1px_rgba(60,52,42,0.03)]">
        <div className="h-20 w-full max-w-[1240px] mx-auto px-margin-sm lg:px-margin flex items-center justify-between gap-space-md">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-space-md shrink-0">
            <Link className="flex items-center gap-space-sm group" href="/">
              <img
                alt="QUIZLY Logo"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgDEsPLQBloC1SCsTjeMY8iNfAntP-gtvWG7vrtWlb0wHUwicLrhHmojhzyqRWIYO35NkBi3uMb_akJemMNbzLSEFN7mU0bDfz8EePPJ_eW_PUC10ZZeJz1eM-5YG5Ml4g3N_KUgQzBOj9xL31lbZA6NRoD66cQUZ2v2JboFw6zc4Eu5HkYc0In59NmCtV8lOEt3gQrCKxHkFHFeQn3BqD1ru9s18jHp_gw4KE9KtOpiPBnUWhmBU"
              />
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors">
                QUIZLY
              </span>
            </Link>

            <nav className="hidden xl:flex items-center gap-space-xs ml-space-md p-1 bg-surface-container-low rounded-full">
              <span
                aria-current="page"
                className="px-space-md py-1.5 transition-colors bg-surface-container-high text-on-surface font-semibold rounded-full select-none cursor-default"
              >
                Explore
              </span>
            </nav>
          </div>

          {/* Center: PIN Joining Interface */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-[440px]">
            <form
              onSubmit={handleJoinPin}
              className="w-full flex items-center justify-between bg-tertiary-fixed/40 border border-tertiary-fixed-dim/60 rounded-full pl-space-md pr-1.5 py-1.5 shadow-[0_2px_8px_-2px_rgba(60,52,42,0.04)]"
            >
              <div className="flex items-center gap-space-sm overflow-hidden">
                <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0">
                  sports_esports
                </span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-tertiary-fixed-variant leading-none uppercase tracking-wider font-bold">
                    Join Quiz
                  </span>
                  <span className="font-label-md text-label-md text-on-surface leading-tight font-semibold">
                    Enter PIN
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-space-xs">
                <input
                  className="w-24 px-space-sm py-1 bg-surface-container-lowest rounded-full font-label-md text-label-md text-on-surface placeholder:text-outline text-center tracking-wider focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-surface-container-highest uppercase"
                  maxLength={6}
                  placeholder="123 456"
                  type="text"
                  value={pinValue}
                  onChange={(e) => setPinValue(e.target.value)}
                />
                <button
                  aria-label="Join Quiz by PIN"
                  className="h-9 w-9 rounded-full bg-primary hover:bg-primary-container text-on-primary flex items-center justify-center transition-all transform hover:-translate-y-0.5 shadow-sm active:translate-y-0 cursor-pointer"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Search, Notifications & Profile */}
          <div className="flex items-center gap-space-sm shrink-0">
            <button
              aria-label="Search quizzes"
              className="h-10 w-10 rounded-full bg-surface-container-lowest border border-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:border-outline-variant transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
            <button
              aria-label="Notifications"
              className="relative h-10 w-10 rounded-full bg-surface-container-lowest border border-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:border-outline-variant transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">
                notifications
              </span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-tertiary ring-2 ring-surface"></span>
            </button>
            <div
              onClick={() => {
                if (!hasAccess) {
                  setIsGuestModalOpen(true);
                } else {
                  router.push("/profile");
                }
              }}
              className="flex items-center gap-space-sm pl-1 pr-3 py-1 bg-surface-container-lowest border border-surface-container-highest rounded-full shadow-[0_1px_3px_-1px_rgba(60,52,42,0.03)] cursor-pointer hover:border-outline-variant transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                {isUserAuthenticated && currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-on-primary text-[18px]">
                    person
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left pr-1">
                <span className="font-label-md text-label-md text-on-surface leading-none font-semibold truncate max-w-[120px]">
                  {displayName}
                </span>
              </div>
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
              <div className="bg-surface-container-lowest rounded-[28px] p-space-lg lg:p-space-xl shadow-[0_2px_12px_-3px_rgba(60,52,42,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-space-lg relative overflow-hidden">
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10 space-y-space-xs max-w-2xl">
                  <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm tracking-wide uppercase">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    Live Quiz Engine Active
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                    Welcome back, {displayName.split(" ")[0]}!{" "}
                    <span className="font-normal text-on-surface-variant">
                      Ready to test your technical mastery?
                    </span>
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Select a topic or specific subject below to start a 1–4 player multiplayer quiz room.
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
                  className="text-error font-bold text-sm px-2 py-1 hover:bg-error/20 rounded-lg"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* SECTION 2: CATEGORY NAVIGATION BAR */}
            <section className="mb-space-2xl">
              <div className="flex items-center justify-between gap-space-md mb-space-sm">
                <span className="font-label-md text-label-md font-bold uppercase tracking-wider text-on-surface-variant">
                  Top Knowledge Domains
                </span>
                <div className="flex items-center gap-1 text-on-surface-variant">
                  <button
                    aria-label="Scroll categories left"
                    className="w-8 h-8 rounded-full bg-surface-container-lowest hover:bg-surface-container-high flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                    onClick={handleScrollLeft}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_left
                    </span>
                  </button>
                  <button
                    aria-label="Scroll categories right"
                    className="w-8 h-8 rounded-full bg-surface-container-lowest hover:bg-surface-container-high flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                    onClick={handleScrollRight}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_right
                    </span>
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
                    const iconName = getCategoryIcon(cat);

                    return (
                      <button
                        key={cat.id || cat.slug}
                        onClick={() => setSelectedCategoryId(cat.id || cat.slug)}
                        className={`shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-full transition-all transform hover:-translate-y-0.5 cursor-pointer ${
                          isSelected
                            ? "bg-surface-container-lowest shadow-[0_4px_14px_-2px_rgba(49,122,99,0.18)]"
                            : "bg-surface-container-lowest hover:bg-surface-container-low shadow-sm"
                        }`}
                        type="button"
                      >
                        {isSelected && (
                          <span className="w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary-fixed animate-pulse"></span>
                        )}
                        <span
                          className={`w-7 h-7 rounded-full ${palette.iconBg} ${palette.iconColor} flex items-center justify-center text-[16px] material-symbols-outlined`}
                        >
                          {iconName}
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
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-0.5">
                    Recently Played
                  </h2>
                </div>
                <Link
                  className="font-label-md text-label-md text-primary font-bold hover:text-primary-container flex items-center gap-1 transition-colors"
                  href="/history"
                >
                  View Full History
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
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
                    const topicName = item.topic || "Quiz Battle";
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
                              <span className="material-symbols-outlined text-[14px]">
                                schedule
                              </span>{" "}
                              {timeStr}
                            </span>
                          </div>
                          <h3 className="font-headline-sm text-headline-sm text-on-surface tracking-tight mt-space-sm mb-space-xs group-hover:text-primary transition-colors">
                            {topicName} Battle
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                            Room Code: <span className="font-mono font-bold">{item.roomCode || "N/A"}</span> • {item.questionCount || 10} Questions
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
                              onClick={() => router.push(`/history/battles/${item._id}`)}
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
                  <span className="material-symbols-outlined text-on-surface-variant text-[40px] mb-2 opacity-60">
                    history_edu
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    No Recent Quiz Activity
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mt-1">
                    Select a subject or mixed quiz below to launch your first 1–4 player quiz battle!
                  </p>
                </div>
              )}
            </section>

            {/* SECTION 4: QUIZ DISCOVERY & SUBJECT CARDS */}
            <section className="mb-space-2xl">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                    Domain Discovery
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-0.5">
                    {currentCategory ? `Quizzes in ${currentCategory.name}` : "Available Quizzes"}
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
                      All ({allQuizCards.length})
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
                    {[10, 15, 20].map((countOption) => (
                      <button
                        key={countOption}
                        onClick={() => setSelectedQuestionCount(countOption)}
                        className={`px-3 py-1 rounded-full font-label-sm text-label-sm transition-all cursor-pointer ${
                          selectedQuestionCount === countOption
                            ? "bg-tertiary text-on-tertiary shadow-sm font-bold"
                            : "text-on-surface-variant hover:text-on-surface font-semibold"
                        }`}
                        type="button"
                      >
                        {countOption} Qs
                      </button>
                    ))}
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
                                quiz.isMixedCategory
                                  ? "bg-primary text-on-primary"
                                  : "bg-surface-container-high text-on-surface-variant"
                              }`}
                            >
                              {quiz.isMixedCategory ? "Mixed Pool" : quiz.category}
                            </span>
                            <button
                              aria-label="Bookmark quiz"
                              onClick={() => toggleBookmark(quiz.cardId)}
                              className="w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur-md hover:bg-surface-container-lowest flex items-center justify-center text-on-surface-variant hover:text-tertiary transition-colors shadow-sm cursor-pointer"
                              type="button"
                            >
                              <span
                                className="material-symbols-outlined text-[18px]"
                                style={{
                                  fontVariationSettings: bookmarkedIds[quiz.cardId] ? "'FILL' 1" : "'FILL' 0",
                                  color: bookmarkedIds[quiz.cardId] ? "#9f2b1d" : undefined,
                                }}
                              >
                                bookmark
                              </span>
                            </button>
                          </div>

                          <h3 className="font-headline-sm text-headline-sm text-on-surface tracking-tight mb-space-xs group-hover:text-primary transition-colors font-bold">
                            {quiz.title}
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                            {quiz.description}
                          </p>
                        </div>

                        <div className="pt-space-md mt-space-sm flex items-center justify-between border-t border-surface-container-low">
                          <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                            {quiz.questionCount} Qs Available
                          </span>
                          <button
                            disabled={isCreatingThis || !hasEnoughQuestions}
                            onClick={() => handlePlayQuizCard(quiz)}
                            className={`px-5 py-2.5 rounded-full font-label-md text-label-md font-bold transition-all shadow-sm transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 cursor-pointer ${
                              hasEnoughQuestions
                                ? "bg-primary hover:bg-primary-container text-on-primary"
                                : "bg-surface-container-high text-on-surface-variant opacity-60 cursor-not-allowed"
                            }`}
                            type="button"
                          >
                            <span>
                              {isCreatingThis
                                ? "Creating..."
                                : hasEnoughQuestions
                                ? `Play ${selectedQuestionCount} Qs`
                                : `< ${selectedQuestionCount} Qs`}
                            </span>
                            {!isCreatingThis && hasEnoughQuestions && (
                              <span className="material-symbols-outlined text-[16px]">
                                play_arrow
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full bg-surface-container-lowest rounded-[24px] p-space-xl text-center border border-dashed border-surface-container-highest">
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    No subjects found for this category yet. Select another category from above.
                  </p>
                </div>
              )}
            </section>

            {/* SECTION 5: EXPLORE CATEGORIES */}
            <section>
              <div className="mb-space-lg">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                  Comprehensive Library
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-0.5">
                  Explore All Categories
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Discover categories backed by live backend questions and real-time multiplayer arenas.
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
                    const iconName = getCategoryIcon(cat);

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
                              <span className="material-symbols-outlined text-[26px]">
                                {iconName}
                              </span>
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
                            <span className={`material-symbols-outlined text-[18px] ${palette.iconColor}`}>
                              arrow_forward
                            </span>
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
                alt="QUIZLY Logo"
                className="h-6 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgDEsPLQBloC1SCsTjeMY8iNfAntP-gtvWG7vrtWlb0wHUwicLrhHmojhzyqRWIYO35NkBi3uMb_akJemMNbzLSEFN7mU0bDfz8EePPJ_eW_PUC10ZZeJz1eM-5YG5Ml4g3N_KUgQzBOj9xL31lbZA6NRoD66cQUZ2v2JboFw6zc4Eu5HkYc0In59NmCtV8lOEt3gQrCKxHkFHFeQn3BqD1ru9s18jHp_gw4KE9KtOpiPBnUWhmBU"
              />
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                QUIZLY
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant hidden sm:block">
              — Intellectual curiosity meets playful competition.
            </p>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-space-lg text-on-surface-variant font-label-md text-label-md">
            <a className="hover:text-on-surface transition-colors" href="#">
              Browse Categories
            </a>
            <a className="hover:text-on-surface transition-colors" href="#">
              Arena Schedule
            </a>
            <a className="hover:text-on-surface transition-colors" href="#">
              Rankings
            </a>
            <a className="hover:text-on-surface transition-colors" href="#">
              Honor Code
            </a>
            <a className="hover:text-on-surface transition-colors" href="#">
              Privacy &amp; Terms
            </a>
          </nav>
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            © 2025 QUIZLY Inc. All rights reserved.
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
