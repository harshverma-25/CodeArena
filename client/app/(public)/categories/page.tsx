import React from "react";
import type { Metadata } from "next";
import { siteConfig, getAbsoluteUrl, VERIFIED_CATEGORIES } from "@/lib/site-config";
import { buildBreadcrumbJsonLd, buildCategoryCollectionJsonLd } from "@/lib/json-ld";
import { AllCategoriesClient } from "@/components/categories/AllCategoriesClient";

export const metadata: Metadata = {
  title: "All Quiz Categories — Programming, Aptitude, Science & GK",
  description:
    "Browse all quiz categories on QUIZZY. Test your skills in coding MCQs, quantitative aptitude, verbal logic, natural sciences, and global trivia in solo drills or live multiplayer battles.",
  alternates: {
    canonical: getAbsoluteUrl("/categories"),
  },
  openGraph: {
    title: "All Quiz Categories — Programming, Aptitude, Science & GK | QUIZZY",
    description:
      "Explore comprehensive quiz tracks across programming, aptitude, science, and general knowledge. Timed questions and dynamic speed scoring.",
    url: getAbsoluteUrl("/categories"),
  },
  twitter: {
    title: "All Quiz Categories — Programming, Aptitude, Science & GK | QUIZZY",
    description:
      "Explore comprehensive quiz tracks across programming, aptitude, science, and general knowledge. Timed questions and dynamic speed scoring.",
  },
};

export default function AllCategoriesPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: getAbsoluteUrl("/") },
    { name: "Categories", url: getAbsoluteUrl("/categories") },
  ]);

  const categoriesList = Object.values(VERIFIED_CATEGORIES).map((c) => ({
    name: c.name,
    slug: c.slug,
    description: c.description,
  }));
  const collectionJsonLd = buildCategoryCollectionJsonLd(categoriesList);

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-stone-900 flex flex-col font-sans select-none pt-4">
      {/* Structured Data: BreadcrumbList & CollectionPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <AllCategoriesClient />
    </div>
  );
}
