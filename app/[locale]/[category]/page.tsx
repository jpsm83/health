import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { mainCategories } from "@/lib/constants";
import Articles from "@/pagesClient/Articles";
import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import { ISerializedArticle } from "@/types/article";
import ErrorBoundary from "@/components/ErrorBoundary";
import { getArticlesByCategoryPaginated } from "@/app/actions/article/getArticlesByCategoryPaginated";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { category, locale } = await params;

  if (!mainCategories.includes(category)) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found",
    };
  }

  return generatePublicMetadata(
    locale,
    `/${category}`,
    `metadata.${category}.title`
  );
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category, locale } = await params;
  const { page = "1" } = await searchParams;

  // Check if category is valid - if not, trigger not-found page
  if (!mainCategories.includes(category)) {
    notFound();
  }

  const currentPage = Math.max(1, parseInt(page as string, 10) || 1);

  // Configuration - easily adjustable
  // Change these values to customize the number of articles displayed
  const FEATURED_ARTICLES_COUNT = 10; // Number of fixed articles in first section
  const ARTICLES_PER_PAGE = 10; // Number of articles per page in second section

  // Examples:
  // FEATURED_ARTICLES_COUNT = 3, ARTICLES_PER_PAGE = 4 → First section: 3 articles, Second section: 4 per page
  // FEATURED_ARTICLES_COUNT = 1, ARTICLES_PER_PAGE = 6 → First section: 1 article, Second section: 6 per page

  let featuredArticles: ISerializedArticle[] = []; // Fixed articles (first section)
  let paginatedArticles: ISerializedArticle[] = []; // Paginated articles (second section)
  let paginationData = {
    currentPage: 1,
    totalPages: 1,
    totalArticles: 0,
  };

  try {
    // Get the featured articles (fixed section - always the same)
    const featuredResult = await getArticlesByCategoryPaginated({
      category,
      locale,
      page: 1,
      sort: "createdAt",
      order: "desc",
      limit: FEATURED_ARTICLES_COUNT,
    });

    featuredArticles = featuredResult.data || [];

    // Get total count for pagination calculation
    const totalResult = await getArticlesByCategoryPaginated({
      category,
      locale,
      page: 1,
      sort: "createdAt",
      order: "desc",
      limit: 1000, // Get a large number to count total
    });

    const totalArticles = totalResult.totalDocs;
    const remainingArticles = totalArticles - FEATURED_ARTICLES_COUNT; // Subtract featured articles
    const totalPages = Math.ceil(remainingArticles / ARTICLES_PER_PAGE);

    // Redirect to page 1 if current page is greater than total pages
    if (currentPage > totalPages && totalPages > 0) {
      redirect(`/${locale}/${category}?page=1`);
    }

    // Get the paginated articles for the second section
    // Use excludeIds to skip the featured articles
    const featuredIds = featuredArticles
      .map((article) => article._id?.toString())
      .filter((id): id is string => Boolean(id));

    const paginatedResult = await getArticlesByCategoryPaginated({
      category,
      locale,
      page: currentPage,
      sort: "createdAt",
      order: "desc",
      limit: ARTICLES_PER_PAGE,
      excludeIds: featuredIds,
    });

    paginatedArticles = paginatedResult.data || [];

    paginationData = {
      currentPage,
      totalPages,
      totalArticles: remainingArticles, // Total articles minus the featured ones
    };
  } catch (error) {
    console.error("Error fetching articles:", error);
  }

  return (
    <main className="container mx-auto">
      <ErrorBoundary context={`Articles component for category ${category}`}>
        <Articles
          featuredArticles={featuredArticles}
          paginatedArticles={paginatedArticles}
          category={category}
          paginationData={paginationData}
        />
      </ErrorBoundary>
    </main>
  );
}
