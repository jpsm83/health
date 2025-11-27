import { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/app/api/v1/auth/[...nextauth]/auth";
import ErrorBoundary from "@/components/ErrorBoundary";
import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import ProductsBanner from "@/components/ProductsBanner";
import HeroSection from "@/components/server/HeroSection";
import FeaturedArticles from "@/components/FeaturedArticles";
import PaginationSection from "@/components/server/PaginationSection";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getUserLikedArticles } from "@/app/actions/user/getUserLikedArticles";
import { ArticlesWithPaginationSkeleton } from "@/components/skeletons/ArticlesWithPaginationSkeleton";
import { HeroSkeleton } from "@/components/skeletons/HeroSkeleton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePrivateMetadata(
    locale,
    "/favorites",
    "metadata.favorites.title"
  );
}

export const revalidate = 3600; // User page, cache for 1 hour

export default async function FavoritesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const { page = "1" } = await searchParams;

  // Server-side auth check
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/signin`);
  }

  const t = await getTranslations({ locale, namespace: "favorites" });

  // Static hero text - section will handle results display
  const heroTitle = t("title");
  const heroDescription = t("subtitle", { count: 0 });

  return (
    <main className="container mx-auto my-7 md:my-14">
      <ErrorBoundary context={"Favorites page"}>
        <div className="flex flex-col h-full gap-8 md:gap-16">
          {/* Products Banner */}
          <ProductsBanner size="970x90" affiliateCompany="amazon" />

          {/* Hero Section */}
          <Suspense fallback={<HeroSkeleton />}>
            <HeroSection
              locale={locale}
              title={heroTitle}
              description={heroDescription}
              alt={t("heroImageAlt")}
              imageKey="favorites"
            />
          </Suspense>

          {/* Favorites Section with Pagination */}
          <Suspense fallback={<ArticlesWithPaginationSkeleton />}>
            <FavoritesContent locale={locale} page={page as string} />
          </Suspense>

          {/* Newsletter Signup Section */}
          <NewsletterSignup />

          {/* Products Banner */}
          <ProductsBanner size="970x240" affiliateCompany="amazon" />
        </div>
      </ErrorBoundary>
    </main>
  );
}

// Favorites Content Component
async function FavoritesContent({
  locale,
  page,
}: {
  locale: string;
  page: string;
}) {
  const ARTICLES_PER_PAGE = 10;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  // Check auth inside component
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  try {
    const result = await getUserLikedArticles(
      session.user.id,
      currentPage,
      ARTICLES_PER_PAGE,
      locale
    );

    if (!result.success) {
      return null;
    }

    const articles = result.data || [];
    const totalPages = result.totalPages || 1;

    return (
      <>
        {articles && articles.length > 0 && (
          <FeaturedArticles articles={articles} />
        )}
        {totalPages > 1 && (
          <PaginationSection
            type="favorites"
            locale={locale}
            page={page}
            totalPages={totalPages}
          />
        )}
      </>
    );
  } catch (error) {
    console.error("Error fetching favorite articles:", error);
    return null;
  }
}
