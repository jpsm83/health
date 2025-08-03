import { Types } from "mongoose";
import { mainCategories, articleStatus } from "@/lib/constants";

export interface ISeoTags {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  slug: string;
  hreflang: string; // Single source of truth for language/locale
  urlPattern: string; // e.g., "articles", "artigos", "articulos"
  canonicalUrl: string;
  type?: string;
}

export interface IArticleContent {
  subTitle: string;
  articleParagraphs: string[];
}

export interface IContentsByLanguage {
  mainTitle: string;
  articleContents: IArticleContent[];
  seo: ISeoTags; // hreflang contains language/locale info
}

export interface IArticleComment {
  userId: Types.ObjectId;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IArticle {
  _id?: Types.ObjectId;
  contentsByLanguage: IContentsByLanguage[];
  category: (typeof mainCategories)[number];
  articleImages: string[];
  status?: (typeof articleStatus)[number];
  likes?: Types.ObjectId[];
  comments?: IArticleComment[];
  views?: number;
  unpublishedAt?: Date;
  createdBy: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

