"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ISerializedArticle } from "@/types/article";
import { mainCategories } from "@/lib/constants";
import ProductsBanner from "@/components/ProductsBanner";
const FeaturedArticles = dynamic(
  () => import("@/components/FeaturedArticles"),
  { loading: () => null }
);

const NewsletterSignup = dynamic(
  () => import("@/components/NewsletterSignup"),
  { ssr: false, loading: () => null }
);

const CategoryCarousel = dynamic(
  () => import("@/components/CategoryCarousel"),
  { ssr: false, loading: () => null }
);

export default function Home({
  featuredArticles,
  categoryArticles,
}: {
  featuredArticles: ISerializedArticle[];
  categoryArticles: Record<string, ISerializedArticle[]>;
}) {
  const t = useTranslations("home");

  return (
    <div className="mb-8 md:mb-16">
      <div className="flex flex-col h-full gap-8 md:gap-16 my-4 md:my-8">
        {/* Products Banner */}
        <ProductsBanner size="970x90" affiliateCompany="amazon" />

        {/* Hero Section with Full-Width Image */}
        <section className="relative w-full h-[55vh] min-h-[360px] md:h-[70vh] md:min-h-[500px] cv-auto">
          <div className="absolute inset-0">
            <Image
              src="https://res.cloudinary.com/jpsm83/image/upload/v1761366390/health/dh6wlgqj1iuumg9utub1.jpg"
              alt={t("heroImageAlt")}
              className="w-full h-full object-cover"
              fill
              sizes="100vw"
              quality={60}
              fetchPriority="high"
              priority
            />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 flex items-center justify-center h-full mx-3">
            <div className="text-center text-white max-w-4xl mx-auto px-4 md:px-6 bg-black/50 shadow-2xl py-4 md:py-8">
              <h1
                className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-2xl"
                style={{
                  textShadow:
                    "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)",
                }}
              >
                {t("title")}
              </h1>
              <p
                className="text-xl md:text-2xl mb-8 text-white max-w-3xl mx-auto drop-shadow-xl"
                style={{
                  textShadow:
                    "1px 1px 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.5)",
                }}
              >
                {t("subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Featured Articles Section */}
        <FeaturedArticles
          articles={featuredArticles}
          title={t("featuredArticles.title")}
          description={t("featuredArticles.description")}
        />

        {/* Newsletter Signup Section */}
        <NewsletterSignup />

        {/* Products Banner */}
        <ProductsBanner size="970x90" affiliateCompany="amazon" />

        {/* Category Carousels */}
        <section className="cv-auto">
          <div className="text-center mb-10 bg-gradient-left-right p-4 md:p-8">
            <h2
              className="text-3xl font-bold text-white mb-4"
              style={{
                textShadow:
                  "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.4)",
              }}
            >
              {t("exploreByCategory.title")}
            </h2>
            <p className="text-lg text-white max-w-2xl mx-auto">
              {t("exploreByCategory.description")}
            </p>
          </div>

          {/* Render carousels for each category */}
          {mainCategories.map((category) => {
            return (
              <CategoryCarousel
                key={category}
                category={category}
                initialArticles={categoryArticles[category] || []}
              />
            );
          })}
        </section>
      </div>

      {/* Products Banner */}
      <ProductsBanner size="970x240" affiliateCompany="amazon" />
    </div>
  );
}
