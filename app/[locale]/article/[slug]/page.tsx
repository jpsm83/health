import { Metadata } from "next";
import { cache } from "react";
import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";
import {
  generateArticleMetadata,
  generateArticleNotFoundMetadata,
} from "@/lib/utils/articleMetadata";
import { IContentsByLanguage, IMetaDataArticle } from "@/interfaces/article";
import User from "@/app/api/models/user";
import ArticlePageClient from "@/pages/ArticlePageClient";

// This ensures the database call happens only once per request
const getArticleData = cache(async (slug: string) => {
  await connectDb();

  const article = await Article.findOne({
    "contentsByLanguage.seo.slug": slug,
  })
    .populate({
      path: "createdBy",
      select: "username",
      model: User,
    })
    .lean();

  if (!article) return null;

  // Out-of-the-box Next.js safe serialization
  return JSON.parse(JSON.stringify(article));
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const articleData = await getArticleData(slug);

    if (!articleData) {
      return generateArticleNotFoundMetadata();
    }

    const contentByLanguage = articleData.contentsByLanguage.find(
      (content: IContentsByLanguage) => content.seo.slug === slug
    );

    const metaContent: IMetaDataArticle = {
      createdBy: articleData.createdBy?.username || "Women Spot Team",
      articleImages: articleData.articleImages,
      category: articleData.category,
      createdAt: new Date(articleData.createdAt),
      updatedAt: new Date(articleData.updatedAt),
      seo: contentByLanguage?.seo || {
        metaTitle: "Article Not Found",
        metaDescription: "The requested article could not be found",
        keywords: [],
        slug: "",
        hreflang: "",
        urlPattern: "",
        canonicalUrl: "",
      },
    };

    return generateArticleMetadata(metaContent);
  } catch (error) {
    console.error("Error generating article metadata:", error);
    return generateArticleNotFoundMetadata();
  }
}

// This should return JSX, not Metadata
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const articleData = await getArticleData(slug);

    if (!articleData) {
      return (
        <div className="min-h-screen bg-gray-50">
          <main className="mx-auto sm:px-8 md:px-12 lg:px-24 xl:px-36">
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="text-lg text-red-600">Article not found!</div>
            </div>
          </main>
        </div>
      );
    }

    // Find the content for the current locale
    const contentByLanguage = articleData.contentsByLanguage.find(
      (content: IContentsByLanguage) => content.seo.slug === slug
    );

    if (!contentByLanguage) {
      return (
        <div className="min-h-screen bg-gray-50">
          <main className="mx-auto sm:px-8 md:px-12 lg:px-24 xl:px-36">
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="text-lg text-red-600">
                Content not found for this language!
              </div>
            </div>
          </main>
        </div>
      );
    }

    // Create a modified article object with only the matching locale content
    const modifiedArticleData = {
      ...articleData,
      contentsByLanguage: [contentByLanguage], // Only pass the matching locale content
    };

    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto sm:px-8 md:px-12 lg:px-24 xl:px-36">
          <ArticlePageClient {...modifiedArticleData} />
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error fetching article:", error);
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="mx-auto sm:px-8 md:px-12 lg:px-24 xl:px-36 flex justify-center items-center">
          <div className="text-lg text-red-600">Error loading article</div>
        </main>
      </div>
    );
  }
}
