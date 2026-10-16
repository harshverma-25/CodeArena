"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Users,
  Play,
  Sparkles,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  X,
  SlidersHorizontal,
} from "lucide-react";
import {
  ArcadeBrainIcon,
  ArcadeCodeIcon,
  ArcadeFlaskIcon,
  ArcadeGlobeIcon,
  ArcadeLightbulbIcon,
  ArcadeCrownIcon,
  ArcadeLightningIcon,
} from "@/components/ui/ArcadeIcons";
import { CompactQuizCard } from "@/components/shared/CompactQuizCard";
import { useApiClient } from "@/hooks/useApiClient";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { isGuestSessionActive } from "@/features/auth/guestAuth";
import { PlayAsGuestModal } from "@/features/auth/components/PlayAsGuestModal";
import { Category, Subject } from "@/types";
import { VerifiedCategoryData } from "@/lib/site-config";

interface CategoryDetailClientProps {
  slug: string;
  verifiedCategory?: VerifiedCategoryData;
}

function getCategoryIcon(slug: string, className = "w-14 h-14") {
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

export function CategoryDetailClient({ slug, verifiedCategory }: CategoryDetailClientProps) {
  const router = useRouter();
  const api = useApiClient();

  const { data: currentUser } = useCurrentUser();
  const [guestActive, setGuestActive] = useState<boolean>(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);

  const [category, setCategory] = useState<Category | null>(() => {
    if (verifiedCategory) {
      return {
        id: verifiedCategory.slug,
        name: verifiedCategory.name,
        slug: verifiedCategory.slug,
        description: verifiedCategory.description,
        isActive: true,
        questionCount: 0,
        availableLengths: [10, 15, 20],
        isPlayable: true,
      };
    }
    return null;
  });

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(!verifiedCategory);
  const [error, setError] = useState<string | null>(null);

  // Configuration for quick launch
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(10);
  const [launchingCardKey, setLaunchingCardKey] = useState<string | null>(null);
  const [launchError, setLaunchError] = useState<string | null>(null);

  // Active quiz modal configuration (matching homepage design)
  const [activePlayModalQuiz, setActivePlayModalQuiz] = useState<{
    title: string;
    categorySlug: string;
    subjectSlug?: string | null;
    isMixedCategory: boolean;
    description: string;
    availableQuestions?: number;
  } | null>(null);

  useEffect(() => {
    setGuestActive(isGuestSessionActive());
  }, []);

  const hasAccess = Boolean(currentUser || guestActive);

  const fetchCategoryAndSubjects = async () => {
    try {
      if (!category) setLoading(true);
      setError(null);
      const res = await api.get<{
        success: boolean;
        data: { category: Category; subjects: Subject[] };
      }>(`/categories/${slug}/subjects`);

      if (res.data?.category) {
        setCategory(res.data.category);
        setSubjects(res.data.subjects || []);
      } else {
        throw new Error("Category not found in database.");
      }
    } catch (err: any) {
      if (!verifiedCategory) {
        setError(err?.message || `Unable to find category '${slug}'.`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryAndSubjects();
  }, [slug]);

  // Handle Solo Play launch
  const handlePlaySolo = async (subjectSlug: string | null, isMixed: boolean) => {
    if (!hasAccess) {
      setIsGuestModalOpen(true);
      return;
    }

    const key = `solo-${subjectSlug || "mixed"}`;
    setLaunchingCardKey(key);
    setLaunchError(null);

    try {
      const res = await api.post<{
        success: boolean;
        data: { roomCode: string; battleId: string };
      }>("/rooms/solo", {
        categoryId: category?.slug || slug,
        subjectId: isMixed ? null : subjectSlug,
        isMixedCategory: isMixed,
        questionCount: selectedQuestionCount,
      });

      if (res.data?.roomCode) {
        router.push(`/battle/${res.data.roomCode}`);
      } else {
        throw new Error("Could not initialize solo battle.");
      }
    } catch (err: any) {
      setLaunchError(err?.message || "Failed to start solo battle.");
    } finally {
      setLaunchingCardKey(null);
    }
  };

  // Handle Multiplayer Room launch
  const handlePlayMultiplayer = async (subjectSlug: string | null, isMixed: boolean) => {
    if (!hasAccess) {
      setIsGuestModalOpen(true);
      return;
    }

    const key = `multi-${subjectSlug || "mixed"}`;
    setLaunchingCardKey(key);
    setLaunchError(null);

    try {
      const res = await api.post<{
        success: boolean;
        data: { roomCode: string };
      }>("/rooms", {
        categoryId: category?.slug || slug,
        subjectId: isMixed ? null : subjectSlug,
        isMixedCategory: isMixed,
        questionCount: selectedQuestionCount,
      });

      if (res.data?.roomCode) {
        router.push(`/lobby/${res.data.roomCode}`);
      } else {
        throw new Error("Could not create multiplayer lobby.");
      }
    } catch (err: any) {
      setLaunchError(err?.message || "Failed to create multiplayer room.");
    } finally {
      setLaunchingCardKey(null);
    }
  };

  const displayName = category?.name || verifiedCategory?.name || slug;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pb-16 space-y-6">
      {/* Guest Authentication Modal */}
      <PlayAsGuestModal
        isOpen={isGuestModalOpen}
        onClose={() => {
          setIsGuestModalOpen(false);
          setGuestActive(isGuestSessionActive());
        }}
      />

      {/* Breadcrumb Row with Semantic ARIA */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-black uppercase text-stone-600">
        <Link href="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
        <Link href="/categories" className="hover:text-black transition-colors">
          Categories
        </Link>
        <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
        <span className="text-black" aria-current="page">{displayName}</span>
      </nav>

      {/* Loading State */}
      {loading && (
        <div className="space-y-6 animate-pulse">
          <div className="h-24 rounded-[28px] border-[2.5px] border-black bg-white p-6 shadow-[5px_5px_0px_#000]" />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-xl sm:rounded-2xl border-[1.5px] sm:border-2 border-black bg-white p-1.5 sm:p-2 shadow-[2px_2px_0px_#000] space-y-1.5"
              >
                <div className="w-full aspect-square rounded-lg sm:rounded-xl bg-stone-200" />
                <div className="h-3 sm:h-3.5 w-4/5 bg-stone-200 rounded mt-1" />
                <div className="flex justify-between items-center pt-1 border-t border-stone-100">
                  <div className="h-2.5 w-6 bg-stone-200 rounded" />
                  <div className="h-2.5 w-10 bg-stone-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error / Not Found State */}
      {!loading && (error || (!category && !verifiedCategory)) && (
        <div className="bg-white border-[2.5px] border-black rounded-[32px] p-10 text-center shadow-[6px_6px_0px_#000] space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 bg-rose-100 border-2 border-black rounded-2xl flex items-center justify-center mx-auto shadow-[2px_2px_0px_#000]">
            <AlertCircle className="w-8 h-8 text-rose-600 stroke-[2.5]" />
          </div>
          <h2 className="font-black text-2xl text-black uppercase">Category Not Found</h2>
          <p className="text-xs sm:text-sm font-bold text-stone-600 leading-relaxed">
            The category &quot;{slug}&quot; does not exist or is currently inactive in the database.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              href="/categories"
              className="px-5 py-2.5 rounded-full bg-[#FFE600] border-2 border-black text-black font-black text-xs hover:bg-[#FACC15] shadow-[2px_2px_0px_#000] transition-all"
            >
              Browse All Categories
            </Link>
            <button
              type="button"
              onClick={fetchCategoryAndSubjects}
              className="px-5 py-2.5 rounded-full bg-white border-2 border-black text-black font-black text-xs hover:bg-stone-100 shadow-[2px_2px_0px_#000] transition-all cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Category Loaded Successfully */}
      {(category || verifiedCategory) && (
        <>
          {/* Global Launch Error Banner */}
          {launchError && (
            <div className="p-4 rounded-2xl bg-rose-100 border-2 border-black text-rose-900 font-bold text-xs sm:text-sm shadow-[3px_3px_0px_#000] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 stroke-[2.5]" />
              <span>{launchError}</span>
            </div>
          )}

          {/* Mixed Category Quiz Quick Launch Banner */}
          <div className="bg-white border-[2.5px] border-black rounded-[28px] p-5 sm:p-6 shadow-[5px_5px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <ArcadeLightningIcon className="w-5 h-5 text-[#F59E0B] shrink-0" />
                <h2 className="font-black text-base sm:text-lg uppercase text-black tracking-tight">
                  Mixed {displayName} Quiz
                </h2>
                <span className="text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#FFE600] border-2 border-black shadow-[1.5px_1.5px_0px_#000]">
                  All Topics
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-stone-600 leading-relaxed">
                A randomized mix pulling questions from across all subjects in {displayName}.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              {/* Question Count Picker */}
              <div className="flex items-center justify-between sm:justify-start gap-1.5 bg-[#FAF7EE] p-1.5 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000]">
                {[10, 15, 20].map((count) => {
                  const isSelected = selectedQuestionCount === count;
                  const isAvailable = (category?.questionCount || 20) >= count;
                  return (
                    <button
                      key={count}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedQuestionCount(count)}
                      className={`py-1.5 px-3 rounded-xl border-2 font-black text-xs transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#FFE600] text-black border-black shadow-[1.5px_1.5px_0px_#000]"
                          : isAvailable
                          ? "bg-white text-stone-800 border-stone-200 hover:border-black"
                          : "bg-stone-100 text-stone-400 border-transparent cursor-not-allowed"
                      }`}
                    >
                      {count} Qs
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                <button
                  type="button"
                  disabled={launchingCardKey !== null}
                  onClick={() => handlePlaySolo(null, true)}
                  className="py-2.5 px-4 rounded-xl bg-white hover:bg-stone-50 border-2 border-black font-black text-xs text-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>{launchingCardKey === "solo-mixed" ? "Starting..." : "Solo Play"}</span>
                </button>
                <button
                  type="button"
                  disabled={launchingCardKey !== null}
                  onClick={() => handlePlayMultiplayer(null, true)}
                  className="py-2.5 px-4 rounded-xl bg-[#FFE600] hover:bg-[#FACC15] border-2 border-black font-black text-xs text-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{launchingCardKey === "multi-mixed" ? "Creating..." : "Host Room"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION: EDUCATIONAL STUDY TOPICS (ENHANCES SEARCH COMPREHENSION) */}
          {/* ========================================================================= */}
          {verifiedCategory && verifiedCategory.subjects.length > 0 && (
            <section
              aria-labelledby="topics-heading"
              className="bg-white border-[2.5px] border-black rounded-[32px] p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-4"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-black" />
                <h2
                  id="topics-heading"
                  className="font-black text-xl text-black uppercase tracking-tight"
                >
                  Curriculum & Topics Covered in {displayName}
                </h2>
              </div>
              <p className="text-xs sm:text-sm font-bold text-stone-600 max-w-3xl leading-relaxed">
                Our questions are curated to reinforce foundational principles, technical interview readiness, and exam preparation. Review the core focus areas below before jumping into a live battle:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {verifiedCategory.subjects.map((sub, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#FAF7EE] border-2 border-black shadow-[2px_2px_0px_#000] space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <h3 className="font-black text-sm text-black leading-snug">{sub.name}</h3>
                    </div>
                    <p className="text-[11px] font-bold text-stone-600 pl-6 leading-relaxed">
                      {sub.focus}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION: SUBJECT-SPECIFIC QUIZZES (Compact Square Image Cards) */}
          {/* ========================================================================= */}
          <section aria-labelledby="subjects-heading" className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-black shrink-0" />
                <h1
                  id="subjects-heading"
                  className="font-black text-lg sm:text-xl text-black tracking-wide uppercase"
                >
                  {displayName} Quizzes
                </h1>
              </div>
              <span className="text-xs font-bold text-stone-600 hidden sm:inline">
                {subjects.length} {subjects.length === 1 ? "Quiz" : "Quizzes"} Available
              </span>
            </div>

            {/* Empty State */}
            {!loading && subjects.length === 0 && (
              <div className="w-full bg-white border-2 border-black rounded-2xl p-8 text-center shadow-[4px_4px_0px_#000] space-y-2">
                <p className="font-black text-base text-black uppercase">
                  No subject quizzes found for this category yet.
                </p>
                <p className="text-xs font-bold text-stone-600">
                  You can still play the Mixed Quiz above or check back soon for dedicated topics!
                </p>
              </div>
            )}

            {/* Compact Square Quiz Cards (6 columns on desktop, 3 on mobile) */}
            {subjects.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
                {subjects.map((sub) => (
                  <CompactQuizCard
                    key={sub.id || sub.slug}
                    id={sub.id || sub.slug}
                    title={sub.name}
                    categorySlug={category?.slug || slug}
                    subjectSlug={sub.slug}
                    isMixedCategory={false}
                    thumbnailUrl={sub.thumbnailUrl}
                    questionCount={sub.questionCount}
                    playedCount={0}
                    onPlay={() => {
                      setActivePlayModalQuiz({
                        title: sub.name,
                        categorySlug: category?.slug || slug,
                        subjectSlug: sub.slug,
                        isMixedCategory: false,
                        description: sub.description || `Focused questions covering ${sub.name} principles.`,
                        availableQuestions: sub.questionCount,
                      });
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}

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
                disabled={launchingCardKey !== null}
                onClick={() => {
                  handlePlaySolo(activePlayModalQuiz.subjectSlug || null, activePlayModalQuiz.isMixedCategory);
                  setActivePlayModalQuiz(null);
                }}
                className="w-full bg-[#FFE600] hover:bg-[#FACC15] active:translate-x-[1px] active:translate-y-[1px] text-black font-black text-sm py-3 px-4 rounded-full border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-black text-black" />
                <span>{launchingCardKey?.startsWith("solo-") ? "Starting..." : "Play Solo Now"}</span>
              </button>

              <button
                type="button"
                disabled={launchingCardKey !== null}
                onClick={() => {
                  handlePlayMultiplayer(activePlayModalQuiz.subjectSlug || null, activePlayModalQuiz.isMixedCategory);
                  setActivePlayModalQuiz(null);
                }}
                className="w-full bg-[#FF4D85] hover:bg-[#F43F5E] active:translate-x-[1px] active:translate-y-[1px] text-white font-black text-sm py-3 px-4 rounded-full border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <Users className="w-4 h-4 text-white" />
                <span>{launchingCardKey?.startsWith("multi-") ? "Creating..." : "Host Multiplayer"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
