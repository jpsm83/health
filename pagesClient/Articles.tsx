"use client";

import { useLocale, useTranslations } from "next-intl";
import { mainCategories } from "@/lib/constants";
import FeaturedArticles from "@/components/FeaturedArticles";
import CategoryCarousel from "@/components/CategoryCarousel";
import NewsletterSignup from "@/components/NewsletterSignup";
import Image from "next/image";
import { IArticle } from "@/interfaces/article";

interface ArticlesProps {
  articles: IArticle[];
  error?: string;
}

export default function Articles({ articles, category }: ArticlesProps) {
  const t = useTranslations("articles");
  const locale = useLocale();

  return (
    <div className="flex flex-col min-h-screen gap-8 md:gap-16">
      {/* Hero Section with Full-Width Image */}
      <section className="relative w-full h-[70vh] min-h-[500px] mt-8 md:mt-16">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/jpsm83/image/upload/v1756326380/health/awevko6cerrguoaer2u1.png"
            alt={t(`${articles[0].category}.heroImageAlt`)}
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
              {t(`${articles[0].category}.title`)}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
              {t(`${articles[0].category}.description`)}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Articles First Section */}
      <FeaturedArticles
        articles={articles.slice(0, 6)}
        title={t(`${articles[0].category}.featuredArticles.title`)}
        description={t(`${articles[0].category}.featuredArticles.description`)}
      />

      {/* Newsletter Signup Section */}
      <NewsletterSignup />

      {/* Featured Articles Second Section */}
      <section className="mb-6 md:mb-10">
        <FeaturedArticles
          articles={articles.slice(6)}
          title={t(`${articles[0].category}.featuredArticles.title`)}
          description={t(
            `${articles[0].category}.featuredArticles.description`
          )}
        />
      </section>
    </div>
  );
}
