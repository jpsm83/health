import { Metadata } from "next";
import {
  generateArticleMetadata,
  generateArticleNotFoundMetadata,
} from "@/lib/utils/articleMetadata";
import { IMetaDataArticle } from "@/interfaces/article";
import { default as ArticleClient } from "@/pagesClient/Article";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string; locale: string }>;
}): Promise<Metadata> {
  // const { category, slug, locale } = await params;

  // try {
  //   const articleData = await getArticleBySlug(category, slug, locale);

  //   if (!articleData) {
  //     return generateArticleNotFoundMetadata();
  //   }

  //   const contentByLanguage = articleData.contentsByLanguage[0]; // Already filtered by API

  //   const metaContent: IMetaDataArticle = {
  //     createdBy: typeof articleData.createdBy === 'object' && articleData.createdBy && 'username' in articleData.createdBy
  //       ? (articleData.createdBy as { username: string }).username 
  //       : "Women Spot Team",
  //     articleImages: articleData.articleImages,
  //     category: articleData.category,
  //     createdAt: articleData.createdAt ? new Date(articleData.createdAt) : new Date(),
  //     updatedAt: articleData.updatedAt ? new Date(articleData.updatedAt) : new Date(),
  //     seo: contentByLanguage?.seo || {
  //       metaTitle: "Article Not Found",
  //       metaDescription: "The requested article could not be found",
  //       keywords: [],
  //       slug: "",
  //       hreflang: "",
  //       urlPattern: "",
  //       canonicalUrl: "",
  //     },
  //   };

  //   return generateArticleMetadata(metaContent);
  // } catch (error) {
  //   console.error("Error generating article metadata:", error);
  //   return generateArticleNotFoundMetadata();
  // }
}

// This should return JSX, not Metadata
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string; locale: string }>;
}) {
  const { category, slug, locale } = await params;

  try {
    const articleData = await getArticleBySlug(category, slug, locale);

    if (!articleData) {
      return (
        <div className="h-full bg-gray-50">
          <main className="mx-auto sm:px-8 md:px-12 lg:px-24 xl:px-36">
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="text-lg text-red-600">Article not found!</div>
            </div>
          </main>
        </div>
      );
    }

    return (
      <div className="h-full bg-white">
        <main className="mx-auto sm:px-8 md:px-12 lg:px-24 xl:px-36">
          <ArticleClient {...articleData} />
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error fetching article:", error);
    return (
      <div className="h-full bg-gray-50">
        <main className="mx-auto sm:px-8 md:px-12 lg:px-24 xl:px-36 flex justify-center items-center">
          <div className="text-lg text-red-600">Error loading article</div>
        </main>
      </div>
    );
  }
}
