import { redirect } from "next/navigation";
import { auth } from "@/app/api/v1/auth/[...nextauth]/route";
import Favorites from "@/pagesClient/Favorites";
import { ISerializedArticle } from "@/types/article";
import ErrorBoundary from "@/components/ErrorBoundary";
import { getUserLikedArticles } from "@/app/actions/user/getUserLikedArticles";
import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";

export async function generateMetadata({
  params,
}: {
  params: { locale: string } | Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return generatePrivateMetadata(
    locale,
    "/favorites",
    "metadata.favorites.title"
  );
}

export default async function FavoritesPage({
  params,
  searchParams,
}: {
  params: { locale: string } | Promise<{ locale: string }>;
  searchParams: { [key: string]: string | string[] | undefined } | Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const { page = "1" } = await searchParams;

  // Check if user is authenticated
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect(`/${locale}/signin`);
  }

  const currentPage = Math.max(1, parseInt(page as string, 10) || 1);

  // Configuration - easily adjustable
  const ARTICLES_PER_PAGE = 6; // Number of articles per page

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
      if (currentPage > paginationData.totalPages && paginationData.totalPages > 0) {
        redirect(`/${locale}/favorites?page=1`);
      }
    }
  } catch (error) {
    console.error("Error fetching favorite articles:", error);
  }

  return (
    <main className="container mx-auto">
      <ErrorBoundary context="Favorites component">
        <Favorites
          favoriteArticles={favoriteArticles}
          paginationData={paginationData}
        />
      </ErrorBoundary>
    </main>
  );
}
