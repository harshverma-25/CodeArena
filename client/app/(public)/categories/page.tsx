"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FolderTree,
  Search,
  ArrowRight,
  Sparkles,
  BookOpen,
  AlertCircle,
  RefreshCw,
  HelpCircle,
  Layers,
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
import { Category } from "@/types";

// Dynamic pastel theme palette for category cards
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
    bgColor: "bg-[#FFE4E6]", // Pastel pink / coral
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

export default function AllCategoriesPage() {
  const router = useRouter();
  const api = useApiClient();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<{ success: boolean; data: Category[] }>("/categories");
      if (res.data && Array.isArray(res.data)) {
        setCategories(res.data);
      } else {
        setCategories([]);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load categories from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        c.slug.toLowerCase().includes(q)
    );
  }, [categories, searchQuery]);

  const totalQuestions = useMemo(() => {
    return categories.reduce((sum, c) => sum + (c.questionCount || 0), 0);
  }, [categories]);

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-stone-900 flex flex-col font-sans select-none">
      {/* Top Navigation */}
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-28 pb-16 space-y-8">
        {/* Header Breadcrumb & Controls */}
        <div className="bg-[#FAF7EE] border-[2.5px] border-black rounded-[32px] p-6 sm:p-8 shadow-[6px_6px_0px_#000]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE600] border-2 border-black text-[11px] font-black uppercase tracking-wider mb-2 shadow-[2px_2px_0px_#000]">
                <Layers className="w-3.5 h-3.5" />
                Curriculum Explorer
              </div>
              <h1 className="font-black text-3xl sm:text-4xl text-black tracking-tight uppercase flex items-center gap-3">
                ALL QUIZ CATEGORIES
                <ArcadeCrownIcon className="w-8 h-7 hidden sm:inline-block" />
              </h1>
              <p className="text-xs sm:text-sm font-bold text-stone-700 mt-1 max-w-2xl leading-relaxed">
                Choose a category to explore its subjects, view available questions, and launch live 1–4 player quiz battles.
              </p>
            </div>

            {/* Quick Metrics Badges */}
            <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
              <div className="px-4 py-2.5 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_#000] text-center">
                <div className="text-[11px] font-black text-stone-600 uppercase">Categories</div>
                <div className="font-black text-xl text-black">{categories.length}</div>
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-[#FFE600] border-2 border-black shadow-[3px_3px_0px_#000] text-center">
                <div className="text-[11px] font-black text-stone-800 uppercase">Total Questions</div>
                <div className="font-black text-xl text-black">{totalQuestions.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="mt-6 pt-6 border-t-2 border-stone-300 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600 pointer-events-none" />
              <input
                type="text"
                placeholder="Search categories (e.g. Programming, Science, Aptitude)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-black rounded-2xl pl-11 pr-4 py-2.5 font-bold text-sm text-stone-900 placeholder:text-stone-500 shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
              />
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="px-4 py-2.5 rounded-2xl bg-stone-200 border-2 border-black font-black text-xs text-black shadow-[2px_2px_0px_#000] hover:bg-stone-300 transition-all cursor-pointer"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-64 rounded-[28px] border-[2.5px] border-black bg-white p-6 shadow-[4px_4px_0px_#000] animate-pulse space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 bg-stone-200 rounded-2xl" />
                  <div className="w-24 h-6 bg-stone-200 rounded-full" />
                </div>
                <div className="h-6 w-3/4 bg-stone-200 rounded" />
                <div className="h-4 w-full bg-stone-200 rounded" />
                <div className="h-4 w-2/3 bg-stone-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-white border-[2.5px] border-black rounded-[32px] p-8 text-center shadow-[6px_6px_0px_#000] space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 bg-rose-100 border-2 border-black rounded-2xl flex items-center justify-center mx-auto shadow-[2px_2px_0px_#000]">
              <AlertCircle className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="font-black text-xl text-black">Unable to Load Categories</h3>
            <p className="text-xs font-bold text-stone-600">{error}</p>
            <button
              onClick={fetchCategories}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFE600] border-2 border-black text-black font-black text-xs hover:bg-[#FACC15] shadow-[2px_2px_0px_#000] transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        )}

        {/* Empty State (when 0 categories exist in database) */}
        {!loading && !error && categories.length === 0 && (
          <div className="bg-white border-[2.5px] border-black rounded-[32px] p-12 text-center shadow-[6px_6px_0px_#000] space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-[#FEF08A] border-2 border-black rounded-3xl flex items-center justify-center mx-auto shadow-[3px_3px_0px_#000]">
              <FolderTree className="w-8 h-8 text-black" />
            </div>
            <h3 className="font-black text-2xl text-black uppercase">No Categories Available Yet</h3>
            <p className="text-xs sm:text-sm font-bold text-stone-600 leading-relaxed">
              There are currently no active categories published in the database. Please check back soon or visit the Admin Panel to import question banks.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFE600] border-2 border-black text-black font-black text-sm shadow-[3px_3px_0px_#000] hover:bg-[#FACC15] transition-all"
            >
              Back to Home
            </Link>
          </div>
        )}

        {/* No Search Results */}
        {!loading && !error && categories.length > 0 && filteredCategories.length === 0 && (
          <div className="bg-white border-[2.5px] border-black rounded-[32px] p-10 text-center shadow-[6px_6px_0px_#000] space-y-3 max-w-md mx-auto">
            <h3 className="font-black text-xl text-black">No Matching Categories</h3>
            <p className="text-xs font-bold text-stone-600">
              No categories found matching &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 rounded-full bg-[#FFE600] border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000]"
            >
              Show All Categories
            </button>
          </div>
        )}

        {/* Dynamic Category Cards Grid */}
        {!loading && !error && filteredCategories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCategories.map((cat, idx) => {
              const theme = CATEGORY_THEMES[idx % CATEGORY_THEMES.length];
              const isPlayable = (cat.questionCount || 0) >= 10;

              return (
                <Link
                  key={cat.id || cat.slug}
                  href={`/categories/${cat.slug}`}
                  className={`group rounded-[28px] border-[2.5px] border-black p-6 flex flex-col justify-between ${theme.bgColor} ${theme.hoverBg} shadow-[5px_5px_0px_#000] hover:-translate-y-1.5 hover:shadow-[7px_7px_0px_#000] transition-all cursor-pointer`}
                >
                  <div>
                    {/* Top Icon & Question Count Pill */}
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div className="shrink-0 p-1 bg-white/70 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000]">
                        {getCategoryIcon(cat.slug, "w-11 h-11")}
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-white border-2 border-black text-stone-900 shadow-[1px_1px_0px_#000] whitespace-nowrap">
                        {cat.questionCount || 0} Questions
                      </span>
                    </div>

                    {/* Category Title */}
                    <h3 className="font-black text-xl text-black mb-1.5 leading-snug group-hover:text-black">
                      {cat.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs font-bold text-stone-700 leading-relaxed line-clamp-3 mb-4">
                      {cat.description || `Explore subjects and questions in ${cat.name}.`}
                    </p>
                  </div>

                  {/* Bottom Row */}
                  <div className="pt-3 border-t-2 border-black/15 flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-stone-800">
                      Browse Subjects
                    </span>
                    <div
                      className={`w-9 h-9 rounded-full ${theme.buttonColor} ${theme.buttonHover} text-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] group-hover:scale-110 transition-transform`}
                    >
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
