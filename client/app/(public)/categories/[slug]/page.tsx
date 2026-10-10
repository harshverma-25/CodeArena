"use client";

import React, { useEffect, useState, use } from "react";
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
  FolderTree,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
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
import { isGuestSessionActive, getGuestUser } from "@/features/auth/guestAuth";
import { PlayAsGuestModal } from "@/features/auth/components/PlayAsGuestModal";
import { Category, Subject } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
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

export default function CategoryDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();
  const api = useApiClient();

  const { data: currentUser } = useCurrentUser();
  const [guestActive, setGuestActive] = useState<boolean>(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);

  const [category, setCategory] = useState<Category | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      setError(null);
      const res = await api.get<{
        success: boolean;
        data: { category: Category; subjects: Subject[] };
      }>(`/categories/${slug}/subjects`);

      if (res.data?.category) {
        setCategory(res.data.category);
        setSubjects(res.data.subjects || []);
      } else {
        throw new Error("Category not found");
      }
    } catch (err: any) {
      setError(err?.message || `Unable to find category '${slug}'.`);
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

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-stone-900 flex flex-col font-sans select-none">
      {/* Guest Authentication Modal */}
      <PlayAsGuestModal
        isOpen={isGuestModalOpen}
        onClose={() => {
          setIsGuestModalOpen(false);
          setGuestActive(isGuestSessionActive());
        }}
      />

      {/* Top Navigation */}
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-28 pb-16 space-y-8">
        {/* Breadcrumb Row */}
        <nav className="flex items-center gap-2 text-xs font-black uppercase text-stone-600">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
          <Link href="/categories" className="hover:text-black transition-colors">
            Categories
          </Link>
          <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
          <span className="text-black">{category?.name || slug}</span>
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
        {!loading && (error || !category) && (
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
        {!loading && category && (
          <>
            {/* Global Launch Error Banner */}
            {launchError && (
              <div className="p-4 rounded-2xl bg-rose-100 border-2 border-black text-rose-900 font-bold text-xs sm:text-sm shadow-[3px_3px_0px_#000] flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0 stroke-[2.5]" />
                <span>{launchError}</span>
              </div>
            )}

            {/* TOP HERO: Category Banner with Mixed Quick Play */}
            <div className="bg-white border-[2.5px] border-black rounded-[32px] p-6 sm:p-8 lg:p-10 shadow-[6px_6px_0px_#000]">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                {/* Left: Category Icon, Name & Description */}
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-[#FEF08A] rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] shrink-0">
                      {getCategoryIcon(category.slug, "w-12 h-12")}
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#DCFCE7] border-2 border-black text-[11px] font-black uppercase text-emerald-900 shadow-[1px_1px_0px_#000] mb-1">
                        Active Category
                      </div>
                      <h1 className="font-black text-3xl sm:text-4xl text-black tracking-tight uppercase">
                        {category.name}
                      </h1>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-stone-700 leading-relaxed">
                    {category.description || `Browse subjects and challenge friends in ${category.name} quizzes.`}
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <span className="px-3.5 py-1.5 rounded-full bg-white border-2 border-black font-black text-xs text-black shadow-[2px_2px_0px_#000]">
                      {category.questionCount} Questions Available
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-stone-100 border-2 border-black font-black text-xs text-stone-800 shadow-[2px_2px_0px_#000]">
                      {subjects.length} {subjects.length === 1 ? "Subject" : "Subjects"}
                    </span>
                  </div>
                </div>

                {/* Right: Quick Launch Mixed Quiz Card */}
                <div className="bg-[#FAF7EE] border-[2.5px] border-black rounded-[26px] p-5 sm:p-6 shadow-[4px_4px_0px_#000] space-y-4 min-w-[300px] lg:max-w-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm uppercase text-black flex items-center gap-1.5">
                      <ArcadeLightningIcon className="w-5 h-5 text-[#F59E0B]" />
                      Mixed {category.name} Quiz
                    </span>
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-[#FFE600] border border-black shadow-[1px_1px_0px_#000]">
                      All Topics
                    </span>
                  </div>

                  {/* Question Count Picker */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-stone-600">
                      Length: {selectedQuestionCount} Questions
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[10, 15, 20].map((count) => {
                        const isSelected = selectedQuestionCount === count;
                        const isAvailable = (category.questionCount || 0) >= count;
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
                      disabled={
                        launchingCardKey !== null ||
                        (category.questionCount || 0) < selectedQuestionCount
                      }
                      onClick={() => handlePlaySolo(null, true)}
                      className="py-2.5 px-3 rounded-xl bg-white hover:bg-stone-50 border-2 border-black font-black text-xs text-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>{launchingCardKey === "solo-mixed" ? "Starting..." : "Solo Play"}</span>
                    </button>
                    <button
                      type="button"
                      disabled={
                        launchingCardKey !== null ||
                        (category.questionCount || 0) < selectedQuestionCount
                      }
                      onClick={() => handlePlayMultiplayer(null, true)}
                      className="py-2.5 px-3 rounded-xl bg-[#FFE600] hover:bg-[#FACC15] border-2 border-black font-black text-xs text-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Users className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{launchingCardKey === "multi-mixed" ? "Creating..." : "Multiplayer"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: SUBJECTS LIST */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-black text-2xl sm:text-3xl text-black tracking-tight uppercase flex items-center gap-2.5">
                    <BookOpen className="w-6 h-6 text-black" />
                    Subjects in {category.name}
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-stone-600 mt-0.5">
                    Pick a specific subject to launch tailored 1–4 player quiz battles.
                  </p>
                </div>
                <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white border-2 border-black font-black text-xs text-black shadow-[2px_2px_0px_#000]">
                  {subjects.length} {subjects.length === 1 ? "Subject" : "Subjects"}
                </span>
              </div>

              {/* Empty Subjects State */}
              {subjects.length === 0 && (
                <div className="bg-white border-[2.5px] border-black rounded-[32px] p-10 text-center shadow-[6px_6px_0px_#000] space-y-3 max-w-lg mx-auto">
                  <div className="w-12 h-12 bg-amber-100 border-2 border-black rounded-2xl flex items-center justify-center mx-auto shadow-[2px_2px_0px_#000]">
                    <FolderTree className="w-6 h-6 text-amber-800" />
                  </div>
                  <h3 className="font-black text-xl text-black uppercase">
                    No Subjects Available Yet
                  </h3>
                  <p className="text-xs font-bold text-stone-600">
                    No subjects have been published under {category.name} yet. Check back soon or visit the Admin Panel.
                  </p>
                </div>
              )}

              {/* Subjects Grid */}
              {subjects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subjects.map((subj) => {
                    const isPlayable = (subj.questionCount || 0) >= 10;
                    const soloKey = `solo-${subj.slug}`;
                    const multiKey = `multi-${subj.slug}`;
                    const isLaunchingSolo = launchingCardKey === soloKey;
                    const isLaunchingMulti = launchingCardKey === multiKey;

                    return (
                      <div
                        key={subj.id || subj.slug}
                        className="bg-white rounded-[26px] border-[2.5px] border-black p-5 sm:p-6 shadow-[5px_5px_0px_#000] hover:-translate-y-1 hover:shadow-[7px_7px_0px_#000] transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Subject Header */}
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="p-2 bg-[#FAF7EE] rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000]">
                              <BookOpen className="w-6 h-6 text-black" />
                            </div>
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black border-2 border-black shadow-[1px_1px_0px_#000] ${
                                isPlayable
                                  ? "bg-[#DCFCE7] text-emerald-950"
                                  : "bg-stone-100 text-stone-600"
                              }`}
                            >
                              {subj.questionCount || 0} Questions
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="font-black text-lg sm:text-xl text-black mb-1.5 leading-snug">
                            {subj.name}
                          </h3>

                          {/* Description */}
                          <p className="text-xs font-bold text-stone-600 leading-relaxed line-clamp-3 mb-4">
                            {subj.description || `Specialized quiz questions on ${subj.name}.`}
                          </p>
                        </div>

                        {/* Actions Row */}
                        <div className="pt-4 border-t-2 border-stone-200">
                          {isPlayable ? (
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                disabled={launchingCardKey !== null}
                                onClick={() => handlePlaySolo(subj.slug, false)}
                                className="py-2.5 px-3 rounded-xl bg-white hover:bg-stone-50 border-2 border-black font-black text-xs text-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <Play className="w-3.5 h-3.5 fill-black" />
                                <span>{isLaunchingSolo ? "Starting..." : "Solo Play"}</span>
                              </button>
                              <button
                                type="button"
                                disabled={launchingCardKey !== null}
                                onClick={() => handlePlayMultiplayer(subj.slug, false)}
                                className="py-2.5 px-3 rounded-xl bg-[#FFE600] hover:bg-[#FACC15] border-2 border-black font-black text-xs text-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <Users className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>{isLaunchingMulti ? "Creating..." : "Multiplayer"}</span>
                              </button>
                            </div>
                          ) : (
                            <div className="py-2.5 px-3 rounded-xl bg-stone-100 border-2 border-stone-300 text-center font-bold text-xs text-stone-500">
                              Requires 10 questions to play (has {subj.questionCount || 0})
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
