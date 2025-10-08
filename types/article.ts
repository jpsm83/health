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
  urlPattern: string;
  canonicalUrl: string;
}

export interface IMetaDataArticle {
  createdBy: string;
  articleImages: string[];
  articleVideo?: string;
  category: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  seo: ISeo;
}

export interface IArticleContent {
  subTitle: string;
  articleParagraphs: string[];
}

// Canvas schema interface
export interface ICanvas {
  paragraphOne: string;
  paragraphTwo: string;
  paragraphThree: string;
}

// Social media interfaces
export interface IInstagram {
  caption?: string;
  hashtags?: string[];
  altText?: string;
  video?: string;
  url: string;
}

export interface IFacebook {
  message?: string;
  headline?: string;
  linkDescription?: string;
  hashtags?: string[];
  video?: string;
  callToAction?: string;
  url: string;
}

export interface IXTwitter {
  text?: string;
  hashtags?: string[];
  video?: string;
  url: string;
}

export interface IPinterest {
  title?: string;
  description?: string;
  hashtags?: string[];
  video?: string;
  altText?: string;
  url: string;
}

export interface IYouTube {
  title?: string;
  description?: string;
  tags?: string[];
  video: string;
  url: string;
}

export interface IThreads {
  text?: string;
  video?: string;
  hashtags?: string[];
  url: string;
}

export interface ITikTok {
  caption?: string;
  hashtags?: string[];
  video: string;
  url: string;
}

export interface ISocialMedia {
  instagram?: IInstagram;
  facebook?: IFacebook;
  xTwitter?: IXTwitter;
  pinterest?: IPinterest;
  youtube?: IYouTube;
  threads?: IThreads;
  tiktok?: ITikTok;
}

// New unified language-specific interface
export interface ILanguageSpecific {
  hreflang: string;
  canvas: ICanvas;
  seo: ISeo;
  content: {
    mainTitle: string;
    articleContents: IArticleContent[];
  };
  socialMedia?: ISocialMedia;
}

// Legacy interface for backward compatibility during migration
export interface IContentsByLanguage {
  mainTitle: string;
  articleContents: IArticleContent[];
  seo: ISeo; // hreflang contains language/locale info
}

// Comment interfaces moved to interfaces/comment.ts

// Images context interface
export interface IImagesContext {
  imageOne: string;
  imageTwo: string;
  imageThree: string;
  imageFour: string;
}

export interface IArticle {
  _id?: Types.ObjectId;
  languages: ILanguageSpecific[];
  category: (typeof mainCategories)[number];
  imagesContext: IImagesContext;
  articleImages: string[];
  articleVideo?: string;
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
  languages: ILanguageSpecific[];
  category: (typeof mainCategories)[number];
  imagesContext: IImagesContext;
  articleImages: string[];
  articleVideo?: string;
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
  languages: ILanguageSpecific[];
  category: (typeof mainCategories)[number];
  imagesContext: IImagesContext;
  articleImages: string[];
  articleVideo?: string;
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
  languages: ILanguageSpecific[];
  category: (typeof mainCategories)[number];
  imagesContext: IImagesContext;
  articleImages: string[];
  articleVideo?: string;
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
