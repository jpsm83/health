import { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { mainCategories } from "@/lib/constants";
import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import ErrorBoundary from "@/components/ErrorBoundary";
import HeroSection from "@/components/server/HeroSection";
import NewsletterSection from "@/components/server/NewsletterSection";
import FeaturedArticles from "@/components/FeaturedArticles";
import PaginationSection from "@/components/server/PaginationSection";
import { getArticlesByCategoryPaginated } from "@/app/actions/article/getArticlesByCategoryPaginated";
import { FieldProjectionType } from "@/app/api/utils/fieldProjections";
import { ArticlesWithPaginationSkeleton } from "@/components/skeletons/ArticlesWithPaginationSkeleton";
import { translateCategoryToEnglish, isEnglishCategory, translateCategoryToLocale } from "@/lib/utils/routeTranslation";
import { getUserRegion } from "@/app/actions/geolocation/getUserRegion";

// Lazy load below-fold banners (they're not critical for initial render)
const ProductsBanner = dynamic(() => import("@/components/ProductsBanner"));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { category, locale } = await params;

  // Translate category from URL to English for validation
  const englishCategory = translateCategoryToEnglish(category);

  // If locale is not English, reject English category names
  if (locale !== "en" && isEnglishCategory(category)) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found",
    };
  }

  if (!mainCategories.includes(englishCategory)) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found",
    };
  }

  return generatePublicMetadata(
    locale,
    `/${category}`,
    `metadata.${englishCategory}.title`
  );
}

export const revalidate = 3600; // 1 hour

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category, locale } = await params;
  const { page = "1" } = await searchParams;

  // Translate category from URL to English for validation
  const englishCategory = translateCategoryToEnglish(category);

  // If locale is not English, reject English category names ONLY if they differ from the locale translation
  // This allows categories like "fitness" that are the same in multiple languages
  if (locale !== "en" && isEnglishCategory(category)) {
    const expectedLocaleCategory = translateCategoryToLocale(englishCategory, locale);
    // Only reject if the English category is different from what's expected in this locale
    if (category.toLowerCase() !== expectedLocaleCategory.toLowerCase()) {
      notFound();
    }
  }

  // Check if category is valid - if not, trigger not-found page
  if (!mainCategories.includes(englishCategory)) {
    notFound();
  }

  const region = await getUserRegion(); // Detect region once on server

  return (
    <main className="container mx-auto my-7 md:my-14">
      <ErrorBoundary context={`Articles component for category ${category}`}>
        <div className="flex flex-col h-full gap-8 md:gap-16">
            {/* Products Banner */}
            <ProductsBanner
              size="970x90"
              affiliateCompany="amazon"
              category={englishCategory}
              region={region}
            />

          {/* Hero Section */}
          <HeroSection category={englishCategory} locale={locale} />

          {/* Paginated Articles Section with Pagination */}
          <Suspense fallback={<ArticlesWithPaginationSkeleton />}>
            <CategoryArticlesContent
              category={englishCategory}
              locale={locale}
              page={page as string}
              originalCategory={category}
            />
          </Suspense>

          {/* Newsletter Section */}
          <NewsletterSection />

          {/* Bottom banner - lazy loaded */}
          <ProductsBanner size="970x240" affiliateCompany="amazon" region={region} />
        </div>
      </ErrorBoundary>
    </main>
  );
}

// Category Articles Content Component
async function CategoryArticlesContent({
  category,
  locale,
  page,
  originalCategory,
}: {
  category: string;
  locale: string;
  page: string;
  originalCategory: string;
}) {
  const ARTICLES_PER_PAGE = 10;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  try {
    const paginatedResult = await getArticlesByCategoryPaginated({
      category,
      locale,
      page: currentPage,
      sort: "createdAt",
      order: "desc",
      limit: ARTICLES_PER_PAGE,
      fields: "featured" as FieldProjectionType,
      skipCount: false, // Get totalPages for pagination
    });

    const articles = paginatedResult.data || [];
    const totalPages = paginatedResult.totalPages || 1;

    return (
      <>
        {articles && articles.length > 0 && (
          <FeaturedArticles articles={articles} />
        )}
        {totalPages > 1 && (
          <PaginationSection
            type="category"
            category={originalCategory}
            locale={locale}
            page={page}
            totalPages={totalPages}
          />
        )}
      </>
    );
  } catch (error) {
    console.error("Error fetching category articles:", error);
    return null;
  }
}
