import { Metadata } from "next";
import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import Home from "@/pagesClient/Home";
import { articleService } from "@/services/articleService";
import { IArticle } from "@/interfaces/article";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePublicMetadata(locale, "", "metadata.home.title");
}

// Server Component - handles metadata generation
export default async function HomePage() {
  let featuredArticles: IArticle[] = [];
  try {
    featuredArticles = await articleService.getArticles();
  } catch (error) {
    console.error("Error fetching articles:", error);
  }

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <main className="container mx-auto">
        <Home featuredArticles={featuredArticles} />
      </main>
    </div>
  );
}
