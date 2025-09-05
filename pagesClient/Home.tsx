"use client";

import { useTranslations, useLocale } from "next-intl";
import CategoryCarousel from "@/components/CategoryCarousel";
import NewsletterSignup from "@/components/NewsletterSignup";
import Image from "next/image";
import { IArticle } from "@/interfaces/article";
import { mainCategories } from "@/lib/constants";
import FeaturedArticles from "@/components/FeaturedArticles";
import { articleService } from "@/services/articleService";
import { useState, useEffect } from "react";

export default function Home({
  featuredArticles
}: {
  featuredArticles: IArticle[];
}) {
  const t = useTranslations("home");
  const locale = useLocale();
  const [articles, setArticles] = useState<IArticle[]>(featuredArticles);

  // Fetch articles when locale changes
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const fetchedArticles = await articleService.getArticles({
          locale,
          limit: 9,
        });
        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
        // Keep existing articles if fetch fails
      }
    };

    fetchArticles();
  }, [locale]);

  return (
    <div className="flex flex-col h-full gap-8 md:gap-16">
      {/* Hero Section with Full-Width Image */}
      <section className="relative w-full h-[70vh] min-h-[500px] mt-8 md:mt-16">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/jpsm83/image/upload/v1756326380/health/awevko6cerrguoaer2u1.png"
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t("title")}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto">
              {t("subtitle")}
            </p>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <FeaturedArticles articles={articles} title={t("featuredArticles.title")} description={t("featuredArticles.description")} />

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
            />
          );
        })}
      </section>
    </div>
  );
}
