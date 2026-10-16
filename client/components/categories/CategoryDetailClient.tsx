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
          <div className="h-48 rounded-[32px] border-[2.5px] border-black bg-white p-8 shadow-[6px_6px_0px_#000]" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-56 rounded-[28px] border-[2.5px] border-black bg-white p-6 shadow-[4px_4px_0px_#000]"
              />
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

          {/* TOP ROW: Separated Category Hero Banner (Left) + Mixed Quiz Quick Launch Card (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Side: Category Details Banner */}
            <div className="lg:col-span-7 xl:col-span-8 bg-white border-[2.5px] border-black rounded-[32px] p-6 sm:p-8 shadow-[6px_6px_0px_#000] flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-[#FEF08A] rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] shrink-0">
                    {getCategoryIcon(slug, "w-10 h-10 sm:w-12 sm:h-12")}
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#DCFCE7] border-2 border-black text-[11px] font-black uppercase text-emerald-900 shadow-[1px_1px_0px_#000] mb-1">
                      Verified Curriculum
                    </div>
                    <h1 className="font-black text-2xl sm:text-3xl lg:text-4xl text-black tracking-tight uppercase">
                      {displayName}
                    </h1>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-bold text-stone-700 leading-relaxed max-w-2xl">
                  {category?.description || verifiedCategory?.description || `Browse subjects and challenge friends in ${displayName} quizzes.`}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t-2 border-stone-100 flex-wrap">
                <span className="px-3.5 py-1.5 rounded-full bg-[#FEF9C3] border-2 border-black font-black text-xs text-black shadow-[2px_2px_0px_#000]">
                  {category?.questionCount || 0} Questions Available
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-white border-2 border-black font-black text-xs text-stone-800 shadow-[2px_2px_0px_#000]">
                  {subjects.length > 0 ? subjects.length : verifiedCategory?.subjects.length || 0} Topics
                </span>
              </div>
            </div>

            {/* Right Side: Separate Mixed Quiz Card */}
            <div className="lg:col-span-5 xl:col-span-4 bg-[#FAF7EE] border-[2.5px] border-black rounded-[32px] p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-base uppercase text-black flex items-center gap-2">
                    <ArcadeLightningIcon className="w-5 h-5 text-[#F59E0B]" />
                    Mixed {displayName} Quiz
                  </span>
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-[#FFE600] border-2 border-black shadow-[1.5px_1.5px_0px_#000]">
                    All Topics
                  </span>
                </div>
                <p className="text-xs font-bold text-stone-600">
                  A randomized mix pulling questions from across all subjects in {displayName}.
                </p>
              </div>

              {/* Question Count Picker */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase text-stone-600">
                  Quiz Length: {selectedQuestionCount} Questions
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 15, 20].map((count) => {
                    const isSelected = selectedQuestionCount === count;
                    const isAvailable = (category?.questionCount || 20) >= count;
                    return (
                      <button
                        key={count}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => setSelectedQuestionCount(count)}
                        className={`py-1.5 rounded-xl border-2 font-black text-xs transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#FFE600] text-black border-black shadow-[2px_2px_0px_#000]"
                            : isAvailable
                            ? "bg-white text-stone-800 border-stone-300 hover:border-black"
                            : "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed"
                        }`}
                      >
                        {count} Qs
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  disabled={launchingCardKey !== null}
                  onClick={() => handlePlaySolo(null, true)}
                  className="py-2.5 px-3 rounded-xl bg-white hover:bg-stone-50 border-2 border-black font-black text-xs text-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>{launchingCardKey === "solo-mixed" ? "Starting..." : "Solo Play"}</span>
                </button>
                <button
                  type="button"
                  disabled={launchingCardKey !== null}
                  onClick={() => handlePlayMultiplayer(null, true)}
                  className="py-2.5 px-3 rounded-xl bg-[#FFE600] hover:bg-[#FACC15] border-2 border-black font-black text-xs text-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
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
          {/* SECTION: SUBJECT BREAKDOWN & DRILL CARDS */}
          {/* ========================================================================= */}
          {subjects.length > 0 && (
            <section aria-labelledby="subjects-heading" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2
                  id="subjects-heading"
                  className="font-black text-xl sm:text-2xl text-black uppercase tracking-tight flex items-center gap-2"
                >
                  <BookOpen className="w-6 h-6" />
                  Subject-Specific Quizzes
                </h2>
                <span className="text-xs font-bold text-stone-600">
                  Target a specific topic for focused drills
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {subjects.map((sub) => {
                  const soloKey = `solo-${sub.slug}`;
                  const multiKey = `multi-${sub.slug}`;
                  const isSoloLoading = launchingCardKey === soloKey;
                  const isMultiLoading = launchingCardKey === multiKey;

                  return (
                    <div
                      key={sub.id || sub.slug}
                      className="bg-white border-[2.5px] border-black rounded-[28px] p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-black text-lg text-black leading-snug">
                            {sub.name}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#FEF9C3] border-2 border-black text-black shrink-0">
                            {sub.questionCount || 0} Qs
                          </span>
                        </div>
                        <p className="text-xs font-bold text-stone-600 leading-relaxed line-clamp-2">
                          {sub.description || `Focused questions covering ${sub.name} principles.`}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t-2 border-stone-100">
                        <button
                          type="button"
                          disabled={launchingCardKey !== null}
                          onClick={() => handlePlaySolo(sub.slug, false)}
                          className="py-2 px-3 rounded-xl bg-white hover:bg-stone-50 border-2 border-black font-black text-xs text-black shadow-[2px_2px_0px_#000] transition-all cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
                        >
                          <Play className="w-3 h-3 fill-black" />
                          <span>{isSoloLoading ? "Starting..." : "Solo Drill"}</span>
                        </button>
                        <button
                          type="button"
                          disabled={launchingCardKey !== null}
                          onClick={() => handlePlayMultiplayer(sub.slug, false)}
                          className="py-2 px-3 rounded-xl bg-[#FFE600] hover:bg-[#FACC15] border-2 border-black font-black text-xs text-black shadow-[2px_2px_0px_#000] transition-all cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
                        >
                          <Users className="w-3 h-3" />
                          <span>{isMultiLoading ? "Hosting..." : "Multiplayer"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
