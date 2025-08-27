'use client';

import { useTranslations, useLocale } from 'next-intl';
import { mainCategories } from '@/lib/constants';
import { getArticlesByCategory, getFeaturedArticles } from '@/lib/mockData';
import FeaturedArticles from '@/components/FeaturedArticles';
import CategoryCarousel from '@/components/CategoryCarousel';
import NewsletterSignup from '@/components/NewsletterSignup';
import Image from 'next/image';

export default function HomePage() {
  const t = useTranslations('home');
  const locale = useLocale();
  const featuredArticles = getFeaturedArticles();

  return (
    <div className="flex flex-col min-h-screen gap-8 md:gap-16">
      {/* Hero Section with Full-Width Image */}
      <section className="relative w-full h-[70vh] min-h-[500px] mt-8 md:mt-16">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/jpsm83/image/upload/v1756326380/health/awevko6cerrguoaer2u1.png"
            alt="Health and Wellness"
            className="w-full object-cover"
            fill
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {t('title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto leading-relaxed">
              {t('subtitle')}
            </p>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
              {t('description')}
            </p>
            
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
        <FeaturedArticles articles={featuredArticles} />

      {/* Newsletter Signup Section */}
      <NewsletterSignup />

      {/* Category Carousels */}
      <section>
      <div className="text-center mb-10 bg-gradient-to-r from-red-500 to-pink-500 p-4 md:p-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Explore by Category
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover expert insights and practical tips across all areas of health and wellness.
          </p>
        </div>

        {/* Render carousels for each category */}
        {mainCategories.map((category) => {
          const categoryArticles = getArticlesByCategory(category);
          if (categoryArticles.length === 0) return null;
          
          return (
            <CategoryCarousel
              key={category}
              category={category}
              articles={categoryArticles}
            />
          );
        })}
      </section>

    </div>
  );
}
