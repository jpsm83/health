"use client";

import { useTranslations } from "next-intl";
import CategoryCarousel from "@/components/CategoryCarousel";
import NewsletterSignup from "@/components/NewsletterSignup";
import Image from "next/image";
import { ISerializedArticle } from "@/types/article";
import { mainCategories } from "@/lib/constants";
import FeaturedArticles from "@/components/FeaturedArticles";

export default function Home({
  featuredArticles,
  categoryArticles,
}: {
  featuredArticles: ISerializedArticle[];
  categoryArticles: Record<string, ISerializedArticle[]>;
}) {
  const t = useTranslations("home");

  return (
    <div className="flex flex-col h-full gap-8 md:gap-16">
      {/* Hero Section with Full-Width Image */}
      <section className="relative w-full h-[70vh] min-h-[500px] mt-8 md:mt-16">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/jpsm83/image/upload/v1760114436/health/xgy4rvnd9egnwzlvsfku.png"
            alt={t("heroImageAlt")}
            className="w-full h-full object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-2xl" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)'}}>
              {t("title")}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto drop-shadow-xl" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.5)'}}>
              {t("subtitle")}
            </p>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow-lg" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.4)'}}>
              {t("description")}
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

      {/* Category Carousels */}
      <section>
        <div className="text-center mb-10 bg-gradient-to-r from-red-500 to-pink-500 p-4 md:p-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t("exploreByCategory.title")}
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
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
  );
}
