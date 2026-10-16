import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Home, Layers, Sparkles, HelpCircle } from "lucide-react";
import { ArcadeBrainIcon } from "@/components/ui/ArcadeIcons";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The requested quiz page or round could not be found.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF7EE] text-stone-900 flex flex-col justify-center items-center p-4 sm:p-6 font-sans select-none">
      <div className="w-full max-w-lg bg-white border-[3px] border-black rounded-[32px] p-8 sm:p-10 shadow-[8px_8px_0px_#000] text-center space-y-6">
        
        {/* Arcade Badge & Icon */}
        <div className="relative inline-block mx-auto">
          <div className="w-20 h-20 bg-[#FFE600] border-[2.5px] border-black rounded-3xl flex items-center justify-center shadow-[4px_4px_0px_#000]">
            <ArcadeBrainIcon className="w-12 h-12 text-black" />
          </div>
          <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-rose-500 text-white border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000]">
            404
          </span>
        </div>

        {/* Heading & Text */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF08A] border-2 border-black text-[11px] font-black uppercase text-amber-950 shadow-[2px_2px_0px_#000]">
            <HelpCircle className="w-3.5 h-3.5" />
            Route Missing
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight uppercase">
            Question Not Found
          </h1>
          <p className="text-xs sm:text-sm font-bold text-stone-600 leading-relaxed max-w-sm mx-auto">
            The page or quiz room you were looking for does not exist or has been moved. Don&apos;t worry, the arena has plenty more rounds waiting for you!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FFE600] hover:bg-[#FACC15] text-black font-black text-sm px-6 py-3 rounded-full border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            <Home className="w-4 h-4 stroke-[2.5]" />
            <span>Return to Arena Home</span>
          </Link>

          <Link
            href="/categories"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-100 text-black font-black text-sm px-6 py-3 rounded-full border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4 stroke-[2.5]" />
            <span>Browse Categories</span>
          </Link>
        </div>

        {/* Footer Hint */}
        <div className="pt-4 border-t-2 border-stone-200">
          <p className="text-[11px] font-bold text-stone-500">
            Tip: Check the URL for typos or choose a subject from our active categories.
          </p>
        </div>

      </div>
    </div>
  );
}
