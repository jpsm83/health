import { Metadata } from "next";
import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import Home from "@/pagesClient/Home";
import { ISerializedArticle } from "@/interfaces/article";
import ErrorBoundary from "@/components/ErrorBoundary";
import { getArticles } from "@/app/actions/article/getArticles";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePublicMetadata(locale, "", "metadata.home.title");
}

// Server Component - handles metadata generation
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let featuredArticles: ISerializedArticle[] = [];

  try {    
    const articlesResponse = await getArticles({
      locale,
      limit: 9, // Match the limit that was being used in the client component
    });

    // Extract the data array from the paginated response
    featuredArticles = articlesResponse.data;
  } catch (error) {
    console.error("Error fetching articles:", error);
  }

  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"Home component"}>
        <Home featuredArticles={featuredArticles} />
      </ErrorBoundary>
    </main>
  );
}
