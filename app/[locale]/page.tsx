import { Metadata } from "next";
import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import Home from "@/pagesClient/Home";
import { ISerializedArticle } from "@/types/article";
import ErrorBoundary from "@/components/ErrorBoundary";
import { getArticles } from "@/app/actions/article/getArticles";
import { getArticlesByCategory } from "@/app/actions/article/getArticlesByCategory";
import { mainCategories } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePublicMetadata(locale, "", "metadata.home.title");
}

// Force fresh data on every request to prevent caching empty results
export const revalidate = 0;

// Server Component - handles metadata generation
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let featuredArticles: ISerializedArticle[] = [];
  const categoryArticles: Record<string, ISerializedArticle[]> = {};

  try {
    console.log("Starting to fetch articles for locale:", locale);
    
    // Fetch featured articles and all category articles in parallel
    const [articlesResponse, ...categoryResponses] = await Promise.all([
      getArticles({
        locale,
        limit: 9, // Match the limit that was being used in the client component
      }),
      // Fetch articles for each category
      ...mainCategories.map((category) =>
        getArticlesByCategory({
          category,
          page: 1,
          limit: 6,
          sort: "createdAt",
          order: "desc",
          locale,
        })
      ),
    ]);
    
    console.log("Successfully fetched articles:", {
      featuredCount: articlesResponse.data.length,
      categoryCounts: categoryResponses.map((resp, index) => ({
        category: mainCategories[index],
        count: resp.data.length
      }))
    });

    // Extract the data array from the paginated response
    featuredArticles = articlesResponse.data;

    // Map category responses to category names
    mainCategories.forEach((category, index) => {
      categoryArticles[category] = categoryResponses[index].data;
    });
  } catch (error) {
    console.error("Error fetching articles:", error);

    // Log detailed error information for debugging
    console.error("Homepage error details:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      locale,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      userAgent: typeof window !== "undefined" ? window.navigator?.userAgent : "Server-side",
    });

    // Instead of silently failing, let's throw the error to see what's really happening
    // This will help us identify the root cause in production
    throw new Error(`Failed to load homepage data: ${error instanceof Error ? error.message : "Unknown error"}`);
  }

  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"Home component"}>
        <Home
          featuredArticles={featuredArticles}
          categoryArticles={categoryArticles}
        />
      </ErrorBoundary>
    </main>
  );
}
