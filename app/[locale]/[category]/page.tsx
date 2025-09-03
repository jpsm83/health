import { Metadata } from "next";
import { mainCategories } from "@/lib/constants";
import { getArticlesByCategory, getFeaturedArticles } from "@/services/articleService";
import Articles from "@/pagesClient/Articles";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;

  if (!mainCategories.includes(category)) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found",
    };
  }

  return {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} Articles`,
    description: `Browse all ${category} articles and content`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string; locale: string }>;
}) {
  const { category, locale } = await params;

  try {
    // Fetch both category articles and featured articles in parallel
    const [articlesByCategory, featuredArticles] = await Promise.all([
      getArticlesByCategory(category, locale),
      getFeaturedArticles(undefined, undefined, locale)
    ]);

    console.log(articlesByCategory);
    console.log(featuredArticles);

    if (!articlesByCategory || articlesByCategory.length === 0) {
      return (
        <div className="min-h-screen bg-gray-50">
          <main className="mx-auto sm:px-8 md:px-12 lg:px-24 xl:px-36">
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="text-lg text-red-600">
                {mainCategories.includes(category)
                  ? `No articles found in ${category} category`
                  : "Category not found!"}
              </div>
            </div>
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto sm:px-8 md:px-12 lg:px-24 xl:px-36">
          <Articles 
            articles={articlesByCategory} 
            featuredArticles={featuredArticles}
          />
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error fetching articles:", error);
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="mx-auto sm:px-8 md:px-12 lg:px-24 xl:px-36 flex justify-center items-center">
          <div className="text-lg text-red-600">Error loading articles</div>
        </main>
      </div>
    );
  }
}
