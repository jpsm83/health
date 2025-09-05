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
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  try {
    const featuredArticles: IArticle[] | [] = await articleService.getArticles({
      locale,
    });
    return (
      <div className="h-full bg-[#f9fafb]">
        <main className="container mx-auto">
          <Home featuredArticles={featuredArticles} />
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error fetching articles:", error);
    return (
      <div className="bg-gray-50">
        <main className="mx-auto sm:px-8 md:px-12 lg:px-24 xl:px-36">
          <div className="flex justify-center items-center py-20">
            <div className="text-lg text-red-600">Error loading Home Page</div>
          </div>
        </main>
      </div>
    );
  }
}
