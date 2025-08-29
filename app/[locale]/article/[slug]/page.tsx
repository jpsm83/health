import { Metadata } from "next";
import { cache } from "react";
import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";
import {
  generateArticleMetadata,
  generateArticleNotFoundMetadata,
} from "@/lib/utils/articleMetadata";
import {
  IArticle,
  IContentsByLanguage,
  IMetaDataArticle,
} from "@/interfaces/article";
import User from "@/app/api/models/user";
import ArticlePageClient from "@/pages/ArticlePageClient";

// This ensures the database call happens only once per request
const getArticleData = cache(async (slug: string) => {
  await connectDb();

  const article = (await Article.findOne({
    "contentsByLanguage.seo.slug": slug,
  })
    .populate({
      path: "createdBy",
      select: "username",
      model: User,
    })
    .lean()) as unknown as IArticle;

  if (!article) return null;

  return article;
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

    const metaContent: IMetaDataArticle = {
      createdBy: articleData.createdBy?.username,
      articleImages: articleData.articleImages,
      category: articleData.category,
      createdAt: articleData.createdAt || new Date(),
      updatedAt: articleData.updatedAt || new Date(),
      seo: articleData.contentsByLanguage.find(
        (content: IContentsByLanguage) => content.seo.slug === slug
      )?.seo as unknown as IMetaDataArticle,
    };

    return generateArticleMetadata(metaContent);
  } catch (error) {
    console.error("Error generating article metadata:", error);
    return generateArticleNotFoundMetadata();
  }
}

export default async function ArticlePage(articleData: IArticle) {
  if (!articleData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-4xl mx-auto py-8 px-4">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-lg text-red-600">Article not found!</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <main className="container mx-auto">
      <ArticlePageClient articleData />
    </main>
  );
}
