import { Types, Document } from "mongoose";
import { mainCategories, articleStatus } from "@/lib/constants";

export interface IGetArticlesParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  locale?: string;
  category?: string;
  slug?: string;
  query?: string;
  excludeIds?: string[];
}

export interface IArticleCardProps {
  author: string;
  category: string;
  excerpt: string;
  id: string;
  imageUrl: string;
  publishedAt: string;
  readTime: string;
  slug: string;
  title: string;
}

export interface ISeo {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  slug: string;
  hreflang: string;
  urlPattern?: string;
  canonicalUrl?: string;
}

export interface IMetaDataArticle {
  createdBy: string;
  articleImages: string[];
  category: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  seo: ISeo;
}

export interface IArticleContent {
  subTitle: string;
  articleParagraphs: string[];
}

export interface IContentsByLanguage {
  mainTitle: string;
  articleContents: IArticleContent[];
  seo: ISeo; // hreflang contains language/locale info
}

// Comment interfaces moved to interfaces/comment.ts

export interface IArticle {
  _id?: Types.ObjectId;
  contentsByLanguage: IContentsByLanguage[];
  category: (typeof mainCategories)[number];
  articleImages: string[];
  status?: (typeof articleStatus)[number];
  likes?: Types.ObjectId[];
  commentsCount?: number;
  views?: number;
  unpublishedAt?: Date;
  createdBy: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

// MongoDB Document type for Article
export interface IArticleDocument extends Document {
  _id: Types.ObjectId;
  contentsByLanguage: IContentsByLanguage[];
  category: (typeof mainCategories)[number];
  articleImages: string[];
  status?: (typeof articleStatus)[number];
  likes?: Types.ObjectId[];
  commentsCount: number;
  views?: number;
  unpublishedAt?: Date;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

// Lean Article type (for .lean() queries)
export interface IArticleLean {
  _id: Types.ObjectId;
  contentsByLanguage: IContentsByLanguage[];
  category: (typeof mainCategories)[number];
  articleImages: string[];
  status?: (typeof articleStatus)[number];
  likes?: Types.ObjectId[];
  commentsCount: number;
  views?: number;
  unpublishedAt?: Date;
  createdBy: Types.ObjectId | { _id: Types.ObjectId; username: string };
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

// Serialized Article type (for API responses)
export interface ISerializedArticle {
  _id: string;
  contentsByLanguage: IContentsByLanguage[];
  category: (typeof mainCategories)[number];
  articleImages: string[];
  status?: (typeof articleStatus)[number];
  likes?: string[];
  commentsCount: number;
  views?: number;
  unpublishedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Comment interfaces moved to interfaces/comment.ts

// Utility function to serialize MongoDB objects
export const serializeMongoObject = (obj: unknown): unknown => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(serializeMongoObject);
  }
  if (typeof obj === 'object' && obj !== null && obj.constructor && obj.constructor.name === 'ObjectId') {
    return obj.toString();
  }
  if (typeof obj === 'object' && obj !== null && obj.constructor && obj.constructor.name === 'Date') {
    return (obj as Date).toISOString();
  }
  if (typeof obj === 'object' && obj !== null) {
    const serialized: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        serialized[key] = serializeMongoObject((obj as Record<string, unknown>)[key]);
      }
    }
    return serialized;
  }
  return obj;
};
