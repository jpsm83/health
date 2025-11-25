import { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/app/api/v1/auth/[...nextauth]/auth";
import { ISerializedArticle } from "@/types/article";
import ErrorBoundary from "@/components/ErrorBoundary";
import Favorites from "@/components/Favorites";
import { FavoritesSkeleton } from "@/components/skeletons/FavoritesSkeleton";
import { getUserLikedArticles } from "@/app/actions/user/getUserLikedArticles";
import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import ProductsBanner from "@/components/ProductsBanner";

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

  const currentPage = Math.max(1, parseInt(page as string, 10) || 1);

  // Configuration - easily adjustable
  const ARTICLES_PER_PAGE = 10; // Number of articles per page

  let favoriteArticles: ISerializedArticle[] = [];
  let paginationData = {
    currentPage: 1,
    totalPages: 1,
    totalArticles: 0,
  };

  try {
    // Get user's liked articles with pagination
    const result = await getUserLikedArticles(
      session.user.id,
      currentPage,
      ARTICLES_PER_PAGE,
      locale
    );

    if (result.success && result.data) {
      favoriteArticles = result.data;
      paginationData = {
        currentPage: result.currentPage || currentPage,
        totalPages: result.totalPages || 1,
        totalArticles: result.totalDocs || 0,
      };

      // Redirect to page 1 if current page is greater than total pages
      if (
        currentPage > paginationData.totalPages &&
        paginationData.totalPages > 0
      ) {
        redirect(`/${locale}/favorites?page=1`);
      }
    }
  } catch (error) {
    console.error("Error fetching favorite articles:", error);
  }

  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"Favorites page"}>
        {/* Products Banner - Client Component, can be direct */}
        <ProductsBanner size="970x90" affiliateCompany="amazon" />
        
        <Suspense fallback={<FavoritesSkeleton />}>
        <Favorites
            locale={locale}
          favoriteArticles={favoriteArticles}
          paginationData={paginationData}
        />
        </Suspense>

        {/* Products Banner - Client Component, can be direct */}
        <ProductsBanner size="970x240" affiliateCompany="amazon" />
      </ErrorBoundary>
    </main>
  );
}
