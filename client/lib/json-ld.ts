import { siteConfig, getAbsoluteUrl, VerifiedCategoryData } from "./site-config";

/**
 * Technical SEO JSON-LD Structured Data Generators
 *
 * Implements strictly verified Schema.org objects according to Google's structured-data guidelines.
 * - No unsupported Quiz rich result hacks that trigger Google Search Console errors.
 * - No fake ratings, fake aggregate reviews, or fake FAQs.
 * - Real BreadcrumbList only on pages with actual visual breadcrumbs.
 */

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: ["Quizzy", "Quizzy Arena"],
    url: siteConfig.url,
    description: siteConfig.defaultDescription,
    inLanguage: "en-US",
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: getAbsoluteUrl("/images/quizzy-hero-logo.jpg"),
    sameAs: [],
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; url?: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

export function buildCategoryCollectionJsonLd(
  categories: Array<{ name: string; slug: string; description?: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "All Quiz Categories | QUIZZY",
    description:
      "Explore comprehensive quiz categories covering programming, quantitative aptitude, general knowledge, and science.",
    url: getAbsoluteUrl("/categories"),
    inLanguage: "en-US",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: categories.map((cat, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: cat.name,
        url: getAbsoluteUrl(`/categories/${cat.slug}`),
        description: cat.description,
      })),
    },
  };
}

export function buildCategoryDetailJsonLd(category: VerifiedCategoryData) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    name: category.seoTitle,
    description: category.seoDescription,
    url: getAbsoluteUrl(`/categories/${category.slug}`),
    inLanguage: "en-US",
    about: {
      "@type": "Thing",
      name: category.name,
      description: category.description,
    },
    mainEntity: {
      "@type": "ItemList",
      name: `${category.name} Curriculum Topics`,
      description: `Comprehensive practice modules available in the ${category.name} quiz track.`,
      itemListElement: category.subjects.map((sub, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: sub.name,
        description: sub.focus,
      })),
    },
  };
}
