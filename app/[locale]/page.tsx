import { Metadata } from "next";
import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import Home from "@/pagesClient/Home";
import { articleService } from "@/services/articleService";
import { IArticle } from "@/interfaces/article";
import ErrorBoundary from "@/components/ErrorBoundary";

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

  let featuredArticles: IArticle[] | [] = [];

  try {
    featuredArticles = await articleService.getArticles({
      locale,
    });
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
