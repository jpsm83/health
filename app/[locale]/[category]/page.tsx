import { Metadata } from "next";
import { mainCategories } from "@/lib/constants";
import Articles from "@/pagesClient/Articles";
import { articleService } from "@/services/articleService";
import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import { IArticle } from "@/interfaces/article";
import ErrorBoundary from "@/components/ErrorBoundary";

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

  return generatePublicMetadata(locale, "", `metadata.${category}.title`);
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { category, locale } = await params;

  let articlesByCategory: IArticle[] | [] = [];

  try {
    // Fetch both category articles and featured articles in parallel
    articlesByCategory = await articleService.getArticlesByCategory({
      category,
      locale,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
  }

  return (
    <div className="min-h-full">
      <main className="mx-auto sm:px-8 md:px-12 lg:px-24 xl:px-36 min-h-full">
        <ErrorBoundary context={`Articles component for category ${category}`}>
          <Articles articles={articlesByCategory} category={category} />
        </ErrorBoundary>
      </main>
    </div>
  );
}
