"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { isGuestSessionActive, getGuestUser, PlayAsGuestModal } from "@/features/auth";

// Category track data matching the Stitch approved design
const CATEGORIES = [
  { id: "programming", name: "Programming", icon: "terminal", iconColor: "text-primary", iconBg: "bg-primary-fixed/70" },
  { id: "aptitude", name: "Aptitude", icon: "psychology", iconColor: "text-secondary", iconBg: "bg-secondary-fixed/50" },
  { id: "gk", name: "General Knowledge", icon: "lightbulb", iconColor: "text-on-surface-variant", iconBg: "bg-surface-container-high" },
  { id: "art", name: "Art & Literature", icon: "palette", iconColor: "text-tertiary", iconBg: "bg-tertiary-fixed/50" },
  { id: "entertainment", name: "Entertainment", icon: "movie", iconColor: "text-on-tertiary-fixed-variant", iconBg: "bg-tertiary-fixed-dim/40" },
  { id: "geography", name: "Geography", icon: "public", iconColor: "text-primary", iconBg: "bg-primary-fixed/60" },
  { id: "history", name: "History", icon: "account_balance", iconColor: "text-on-surface-variant", iconBg: "bg-surface-container" },
  { id: "languages", name: "Languages", icon: "translate", iconColor: "text-secondary", iconBg: "bg-secondary-fixed-dim/40" },
  { id: "science", name: "Science & Nature", icon: "biotech", iconColor: "text-surface-tint", iconBg: "bg-primary-fixed/50" },
  { id: "sports", name: "Sports", icon: "sports_basketball", iconColor: "text-tertiary", iconBg: "bg-tertiary-fixed/40" },
  { id: "trivia", name: "Trivia", icon: "quiz", iconColor: "text-on-surface-variant", iconBg: "bg-surface-container-highest" },
];

// Recently Played items matching Stitch reference
const RECENTLY_PLAYED = [
  {
    id: "recent-1",
    title: "DBMS Fundamentals",
    category: "Programming",
    categoryColor: "text-primary",
    timeAgo: "2h ago",
    description: "Normalization, ACID properties, transaction concurrency, and indexing structures.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBV61m2E_JEOXJ2Sa5WW8DJFoy7XEQKnb4Xc8ZSHQRKgIdZXQ_RDcGZSBJp-vC6d93NFmcdD3MKZvUz1DTyH16ll9k3Qsyb6A3w-Iirt1ijNF3vSszsfGhgvhogopQZ6wzsOZh_5NrHCw2NObjvrgQWq57JbEMHKZhGwiCkp1lnfBHPWH7Jkf5Hm-AaV8KKPTtGon1lkcBws6g1irgz_BJ5yIqRa1CmhG8CN-MULuLVFDJNFU5i8J0",
    progress: 75,
    progressLabel: "75% Completed",
    progressColor: "bg-primary",
    progressTextColor: "text-primary",
    questionsCount: "15 of 20 Qs",
  },
  {
    id: "recent-2",
    title: "JavaScript ES6+ Basics",
    category: "Programming",
    categoryColor: "text-secondary",
    timeAgo: "Yesterday",
    description: "Closures, prototypes, async/await mechanics, and functional array paradigms.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAryxzmDQlEL2bCJY30MspNJrfiWgG_ivSWie7iU6qZANtQVFiNkwT8wBGB_g1-U08o9LTSLZO1ptjZn7mldQ4WRFQe6GIh3smYrLX6BBkzZi00go81n0LApbrc3RDqi9jSyIRIc0v4eoosmQEfNliCrtatQeiyblMF6-P_YdkE63urlYcxK2zluVIXJk7PZZYqqw7bwZQepoHFzGD3yF4HYgUNjjrFje0g60VmXNwjCBkhwV70HQs",
    progress: 40,
    progressLabel: "40% Completed",
    progressColor: "bg-tertiary",
    progressTextColor: "text-tertiary",
    questionsCount: "10 of 25 Qs",
  },
  {
    id: "recent-3",
    title: "World Geography & Capitals",
    category: "Geography",
    categoryColor: "text-primary",
    timeAgo: "3d ago",
    description: "National landmarks, border geometries, continental biomes, and island capitals.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAc_mpr6eXoOYdjsh97WYl8SCE1I2kh9aX0S3zNT9sUOFErTN2pt8g5Z7Nq-uJpojU_aMffWwMsunpF67cIVevMJKrK9FPo49mJZlY0gyAYRVGqjrA92nB-GTtDtFW1z7gcYv6PBZ8ggBEPaXsDe2JWUN3zlB3ZjpV2-kIk5QQsG31FqkqcoZVKvYrv8ahRg9J_YNSPtcPCP_4_j6FG7jwzMbl8LAbkhmGb4BlejLEX_nhe-fKtq0",
    progress: 90,
    progressLabel: "90% Completed",
    progressColor: "bg-secondary",
    progressTextColor: "text-secondary",
    questionsCount: "27 of 30 Qs",
  },
];

// Popular Quizzes items matching Stitch reference
const POPULAR_QUIZZES = [
  {
    id: "quiz-1",
    title: "General Knowledge Challenge",
    category: "General Knowledge",
    categoryBg: "bg-surface-container-high/90",
    categoryText: "text-on-surface",
    rating: "4.9",
    plays: "48.2k plays",
    duration: "15 mins",
    questions: "20 Questions",
    description: "Test your grasp on global affairs, historical inventions, fine arts, and world curiosities.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVmbYkyYSejdach0N_uMaKtaP_1PW1sKMRbZEGXp0k3Fb-lBfOPntgjFt_U1stpT-aqBqvxUR6UbZm9kopkHplNLhrdXZHjyaZMl87dEgRKn0m2gEnKmhcFa5JjJ3J0OaCT3Zg9EPUxYXMe-diwjjgmz0Wi8kAALsA0_4ejdNBxcP8KoW539a2b-jSBja2d2qcGXEApHEqee4WayZd48J9TN7-soi8wg9UpqKicbxm-A_sHMRIjPE",
    filter: "trending",
  },
  {
    id: "quiz-2",
    title: "World Geography Masters",
    category: "Geography",
    categoryBg: "bg-primary-fixed/80",
    categoryText: "text-on-primary-fixed",
    rating: "4.8",
    plays: "34.5k plays",
    duration: "10 mins",
    questions: "15 Questions",
    description: "From mountainous archipelagoes to desert boundaries, discover how thoroughly you know the planet.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6jka6Gx78ks3_uSl5nzhZNCQm5EAdaKMysoDqWBzVSSw6yRZg2vJYonoA0G7fjnLunvotNng6ydQRLv5TD0Ln31p3Rwk3a_O_pJrxFRCcMM-UZqfDKMnzskit_3T01v4xJzxaALbw2RFop2NnsLgu7PauZbsOtATE3N5oCbSjpMlMflBaFYHaDBZ1iNqv-ZeBk4jIwf6DUQYBqpdIJL9qleIJozWQhBAD71Q6J27-JvBT7VesvHM",
    filter: "trending",
  },
  {
    id: "quiz-3",
    title: "Science Facts & Phenomena",
    category: "Science & Nature",
    categoryBg: "bg-primary-fixed-dim/50",
    categoryText: "text-primary",
    rating: "4.9",
    plays: "29.1k plays",
    duration: "12 mins",
    questions: "18 Questions",
    description: "Quantum quirks, astronomical marvels, and organic chemistry wonders explained simply.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1InTQQ_YhvuSUBrmFb1X7T31s88GbHm5QyI3Pngy8M7byxkBVhmhdq-4-cX1xduI8BiMLg5KhSBPiG3lkLFB8vscgPQfQHQViCj0AM_CFhx7EI1huwAYF1p5dCywSo35RyptRqp5SHMAJ_kUIpHheeD0DH5IstECQw0E7s-l2cgEdKp2iN2YmhVi3903eX8hlnixl14_Y3Gy9KdmRdbflKGKV4nxvcRP44u3qAvbXTeRBkBcWeu4",
    filter: "favorites",
  },
  {
    id: "quiz-4",
    title: "Modern Web Development",
    category: "Programming",
    categoryBg: "bg-secondary-fixed/80",
    categoryText: "text-on-secondary-fixed",
    rating: "4.9",
    plays: "22.8k plays",
    duration: "20 mins",
    questions: "25 Questions",
    description: "CSS Grid layout nuances, HTTP/3 networking, React component lifecycles, and TypeScript tricks.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfbJXTnMNsDj68ofqQIdTe2n2j6tBtv2Uuga3ntQfEPNGqTXNIltLIbhI6JYrV2rE3NmbHAWukEjeolqFAtt6ThaAdJOZURZs_hUfOg02QjQtVmvZ9_WCgBEte1g_NItFoGF4MvV_9NouyS18TgwCblF0xmkNIzlzl1DHWgbHQsTZ9Gvlg1cSiftpkBrRFwCUdWflzcEBXAl0L5GKPBgAbMmQXYO60VrqSAvMHPgxw71LXPUkEZ48",
    filter: "trending",
  },
  {
    id: "quiz-5",
    title: "Classic Cinema & Directors",
    category: "Entertainment",
    categoryBg: "bg-tertiary-fixed/80",
    categoryText: "text-on-tertiary-fixed",
    rating: "4.7",
    plays: "19.4k plays",
    duration: "8 mins",
    questions: "12 Questions",
    description: "Recognize iconic shot compositions, auteur signatures, Oscar records, and soundtrack motifs.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVPHE9aLYxPuPhEAYOmekPzyJh6XY3H0RbacM2g_bI2YqpYmsOa6y3tTMTlLx8z_Io7cvkEBF_cji9UxDDafhIgWYEKWzsFte1g6UkU90HmDGcQ2kXcB8ORVsWwKMzvV1SfWITHwWMLfg0MdNkt5VBbJvMRaEJAxboyYiGyCHcikTvRmAZjLSU8BxT88YKsxuLvNImP-pjdtT5EzuI7-QwVUVCPRLn2-c-wisYqzF01CkKQ9aawjA",
    filter: "quick",
  },
  {
    id: "quiz-6",
    title: "World Sports & Olympic History",
    category: "Sports",
    categoryBg: "bg-tertiary-fixed-dim/40",
    categoryText: "text-on-tertiary-fixed-variant",
    rating: "4.8",
    plays: "16.7k plays",
    duration: "10 mins",
    questions: "15 Questions",
    description: "Historic record breakers, legendary championship showdowns, and tactical game rules.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYHQM1PpAnyDCklfiDE892A8W5QQRsAQ7j9GpJjKMJJHkf7Ed4Qzs8Ax0JSk12FrbyG-y9Rkl767ZVdfh5pibnKUp-JufJxn4y2g-WVXJp7uqvjJNTwhHYnx1mOZpl76fuZQ6VovKBfSy4l89juYDSI1S4YFAKdqIc8AuXpL-oz6bZZWW2g1PzPEEaJAzJdTh4MgQh6Fm0MSn2zvz6EUmWRU8tBFwryy8NNCvlVr9aK_j0Q1fpuS8",
    filter: "quick",
  },
];

// Explore categories matching Stitch reference
const EXPLORE_CATEGORIES = [
  {
    id: "exp-1",
    title: "Programming & Dev",
    count: "142 Quizzes",
    description: "Master full-stack frameworks, runtime patterns, and algorithmic optimization.",
    tags: "Algorithms • Web Dev • Databases",
    icon: "code",
    cardBg: "bg-primary-fixed/30 hover:bg-primary-fixed/50",
    iconColor: "text-primary",
  },
  {
    id: "exp-2",
    title: "Logical Aptitude",
    count: "98 Quizzes",
    description: "Quantitative analysis, spatial deduction, speed-math, and critical logic puzzles.",
    tags: "Probability • Series • Venn Logic",
    icon: "calculate",
    cardBg: "bg-secondary-fixed/40 hover:bg-secondary-fixed/60",
    iconColor: "text-secondary",
  },
  {
    id: "exp-3",
    title: "Science & Nature",
    count: "115 Quizzes",
    description: "Astrophysics, ecology, human anatomy, and groundbreaking inventions.",
    tags: "Genetics • Astronomy • Chemistry",
    icon: "eco",
    cardBg: "bg-primary-fixed-dim/30 hover:bg-primary-fixed-dim/50",
    iconColor: "text-primary",
  },
  {
    id: "exp-4",
    title: "World Geography",
    count: "84 Quizzes",
    description: "Explore global flags, mountain systems, territorial treaties, and major rivers.",
    tags: "Flags • Capitals • Continental Drift",
    icon: "explore",
    cardBg: "bg-surface-container hover:bg-surface-container-high",
    iconColor: "text-on-surface",
  },
  {
    id: "exp-5",
    title: "World History",
    count: "126 Quizzes",
    description: "Ancient dynasties, maritime revolutions, the Enlightenment, and modern diplomacy.",
    tags: "Antiquity • Renaissance • Modernity",
    icon: "hourglass_top",
    cardBg: "bg-tertiary-fixed/30 hover:bg-tertiary-fixed/50",
    iconColor: "text-tertiary",
  },
  {
    id: "exp-6",
    title: "Art & Literature",
    count: "73 Quizzes",
    description: "Modernist novels, Renaissance frescoes, typographic lore, and poetry movements.",
    tags: "Sculpture • Modern Fiction • Bauhaus",
    icon: "draw",
    cardBg: "bg-secondary-fixed-dim/30 hover:bg-secondary-fixed-dim/50",
    iconColor: "text-secondary",
  },
];

export default function StitchHomePage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const [pinValue, setPinValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("programming");
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

  const hasAccess = Boolean(isSignedIn || guestActive);
  const displayName = isSignedIn
    ? user?.fullName || user?.firstName || user?.username || "Player"
    : guestActive && guestUser
    ? guestUser.displayName || guestUser.username || "Guest Player"
    : "Alex Rivera";

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

  // Generic play button handler
  const handlePlayQuiz = (quizTitle: string) => {
    if (!hasAccess) {
      setIsGuestModalOpen(true);
      return;
    }
    router.push("/dashboard");
  };

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
                {isSignedIn && user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
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
                    Daily Brain Boost Active
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                    Welcome back, {displayName.split(" ")[0]}!{" "}
                    <span className="font-normal text-on-surface-variant">
                      Ready to challenge your intellect?
                    </span>
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Explore curated topic paths, retain new knowledge, and keep your
                    cognitive momentum running strong.
                  </p>
                </div>
              </div>
            </section>

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
              <div
                ref={categoryTrackRef}
                className="flex items-center gap-space-sm overflow-x-auto pb-2 scroll-smooth no-scrollbar select-none"
              >
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
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
                        className={`w-7 h-7 rounded-full ${cat.iconBg} ${cat.iconColor} flex items-center justify-center text-[16px] material-symbols-outlined`}
                      >
                        {cat.icon}
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
                })}
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
                  View History
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                {RECENTLY_PLAYED.map((card) => (
                  <div
                    key={card.id}
                    className="bg-surface-container-lowest rounded-[24px] p-space-md shadow-[0_2px_8px_-2px_rgba(60,52,42,0.04),0_1px_3px_-1px_rgba(60,52,42,0.03)] hover:shadow-[0_8px_24px_-6px_rgba(60,52,42,0.07)] transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative w-full h-44 rounded-[20px] overflow-hidden bg-surface-container mb-space-md">
                        <img
                          alt={`${card.title} thumbnail`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          src={card.image}
                        />
                        <div
                          className={`absolute top-3 left-3 px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md font-label-sm text-label-sm font-semibold ${card.categoryColor}`}
                        >
                          {card.category}
                        </div>
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-inverse-surface/80 backdrop-blur-md text-inverse-on-surface font-label-sm text-label-sm flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            schedule
                          </span>{" "}
                          {card.timeAgo}
                        </div>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface tracking-tight mb-space-xs group-hover:text-primary transition-colors">
                        {card.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md line-clamp-2">
                        {card.description}
                      </p>
                    </div>
                    <div className="pt-space-sm space-y-space-md">
                      <div>
                        <div className="flex items-center justify-between text-label-sm font-label-sm mb-1.5 font-medium">
                          <span className="text-on-surface-variant">Progress</span>
                          <span className={`${card.progressTextColor} font-bold`}>
                            {card.progressLabel}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                          <div
                            className={`h-full ${card.progressColor} rounded-full transition-all duration-700`}
                            style={{ width: `${card.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          {card.questionsCount}
                        </span>
                        <button
                          onClick={() => handlePlayQuiz(card.title)}
                          className="px-5 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold transition-all shadow-sm transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                          type="button"
                        >
                          Resume
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 4: POPULAR QUIZZES */}
            <section className="mb-space-2xl">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                    Community Loved
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-0.5">
                    Popular Quizzes
                  </h2>
                </div>
                {/* Filter Segmented Pills */}
                <div className="inline-flex p-1 bg-surface-container rounded-full self-start md:self-auto overflow-x-auto max-w-full">
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                      activeFilter === "all"
                        ? "bg-surface-container-lowest text-on-surface shadow-sm font-bold"
                        : "text-on-surface-variant font-semibold hover:text-on-surface"
                    }`}
                    type="button"
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveFilter("trending")}
                    className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                      activeFilter === "trending"
                        ? "bg-surface-container-lowest text-on-surface shadow-sm font-bold"
                        : "text-on-surface-variant font-semibold hover:text-on-surface"
                    }`}
                    type="button"
                  >
                    Trending This Week
                  </button>
                  <button
                    onClick={() => setActiveFilter("quick")}
                    className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                      activeFilter === "quick"
                        ? "bg-surface-container-lowest text-on-surface shadow-sm font-bold"
                        : "text-on-surface-variant font-semibold hover:text-on-surface"
                    }`}
                    type="button"
                  >
                    Quick 5-min
                  </button>
                  <button
                    onClick={() => setActiveFilter("favorites")}
                    className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                      activeFilter === "favorites"
                        ? "bg-surface-container-lowest text-on-surface shadow-sm font-bold"
                        : "text-on-surface-variant font-semibold hover:text-on-surface"
                    }`}
                    type="button"
                  >
                    Community Favorites
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                {POPULAR_QUIZZES.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="bg-surface-container-lowest rounded-[28px] p-space-md shadow-[0_2px_8px_-2px_rgba(60,52,42,0.04),0_1px_3px_-1px_rgba(60,52,42,0.03)] hover:shadow-[0_8px_24px_-6px_rgba(60,52,42,0.07)] transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative w-full h-48 rounded-[22px] overflow-hidden bg-surface-container mb-space-md">
                        <img
                          alt={`${quiz.title} thumbnail`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          src={quiz.image}
                        />
                        <div
                          className={`absolute top-3 left-3 px-3 py-1 rounded-full ${quiz.categoryBg} backdrop-blur-md ${quiz.categoryText} font-label-sm text-label-sm font-semibold`}
                        >
                          {quiz.category}
                        </div>
                        <button
                          aria-label="Bookmark quiz"
                          onClick={() => toggleBookmark(quiz.id)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur-md hover:bg-surface-container-lowest flex items-center justify-center text-on-surface-variant hover:text-tertiary transition-colors shadow-sm cursor-pointer"
                          type="button"
                        >
                          <span
                            className="material-symbols-outlined text-[18px]"
                            style={{
                              fontVariationSettings: bookmarkedIds[quiz.id] ? "'FILL' 1" : "'FILL' 0",
                              color: bookmarkedIds[quiz.id] ? "#9f2b1d" : undefined,
                            }}
                          >
                            bookmark
                          </span>
                        </button>
                      </div>
                      <div className="flex items-center gap-space-sm font-label-sm text-label-sm text-on-surface-variant mb-space-xs">
                        <span className="flex items-center gap-0.5 text-on-surface font-bold">
                          <span
                            className="material-symbols-outlined text-[16px] text-tertiary"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                          {quiz.rating}
                        </span>
                        <span>•</span>
                        <span>{quiz.plays}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            timer
                          </span>{" "}
                          {quiz.duration}
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface tracking-tight mb-space-xs group-hover:text-primary transition-colors">
                        {quiz.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                        {quiz.description}
                      </p>
                    </div>
                    <div className="pt-space-md mt-space-sm flex items-center justify-between">
                      <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                        {quiz.questions}
                      </span>
                      <button
                        onClick={() => handlePlayQuiz(quiz.title)}
                        className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold transition-all shadow-sm transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 cursor-pointer"
                        type="button"
                      >
                        <span>Play Quiz</span>
                        <span className="material-symbols-outlined text-[16px]">
                          play_arrow
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 5: EXPLORE CATEGORIES */}
            <section>
              <div className="mb-space-lg">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                  Comprehensive Library
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-0.5">
                  Explore Categories
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Find quizzes suited to your passions, technical career growth, or
                  trivia night readiness.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                {EXPLORE_CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      if (!hasAccess) {
                        setIsGuestModalOpen(true);
                      } else {
                        router.push("/dashboard");
                      }
                    }}
                    className={`group rounded-[28px] p-space-lg ${cat.cardBg} transition-all flex flex-col justify-between shadow-[0_2px_8px_-2px_rgba(60,52,42,0.03)] transform hover:-translate-y-1 cursor-pointer`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-space-md">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-surface-container-lowest ${cat.iconColor} flex items-center justify-center shadow-sm`}
                        >
                          <span className="material-symbols-outlined text-[26px]">
                            {cat.icon}
                          </span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full bg-surface-container-lowest font-label-sm text-label-sm font-bold ${cat.iconColor} shadow-sm`}
                        >
                          {cat.count}
                        </span>
                      </div>
                      <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight group-hover:text-primary transition-colors">
                        {cat.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5">
                        {cat.description}
                      </p>
                    </div>
                    <div className="mt-space-lg pt-space-sm flex items-center justify-between text-on-surface-variant">
                      <span className="font-label-sm text-label-sm font-semibold truncate pr-2">
                        {cat.tags}
                      </span>
                      <span className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-sm">
                        <span className={`material-symbols-outlined text-[18px] ${cat.iconColor}`}>
                          arrow_forward
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
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
