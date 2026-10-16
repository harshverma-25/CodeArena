import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig, getAbsoluteUrl, VERIFIED_CATEGORIES } from "@/lib/site-config";
import { buildBreadcrumbJsonLd, buildCategoryDetailJsonLd } from "@/lib/json-ld";
import { CategoryDetailClient } from "@/components/categories/CategoryDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(VERIFIED_CATEGORIES).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryData = VERIFIED_CATEGORIES[slug];

  if (categoryData) {
    return {
      title: categoryData.seoTitle,
      description: categoryData.seoDescription,
      keywords: categoryData.keywords,
      alternates: {
        canonical: getAbsoluteUrl(`/categories/${slug}`),
      },
      openGraph: {
        title: categoryData.seoTitle,
        description: categoryData.seoDescription,
        url: getAbsoluteUrl(`/categories/${slug}`),
      },
      twitter: {
        title: categoryData.seoTitle,
        description: categoryData.seoDescription,
      },
    };
  }

  const capitalized = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
  return {
    title: `${capitalized} Quizzes`,
    description: `Practice ${capitalized} quizzes on QUIZZY. Test your knowledge in solo mode or challenge friends in real-time multiplayer battles.`,
    alternates: {
      canonical: getAbsoluteUrl(`/categories/${slug}`),
    },
  };
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const verifiedCategory = VERIFIED_CATEGORIES[slug];

  const displayName = verifiedCategory?.name || slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: getAbsoluteUrl("/") },
    { name: "Categories", url: getAbsoluteUrl("/categories") },
    { name: displayName, url: getAbsoluteUrl(`/categories/${slug}`) },
  ]);

  const detailJsonLd = verifiedCategory ? buildCategoryDetailJsonLd(verifiedCategory) : null;

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-stone-900 flex flex-col font-sans select-none pt-4">
      {/* Structured Data: BreadcrumbList and ItemPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {detailJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(detailJsonLd) }}
        />
      )}

      <CategoryDetailClient slug={slug} verifiedCategory={verifiedCategory} />
    </div>
  );
}
