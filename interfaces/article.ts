import { Types } from "mongoose";
import { mainCategories, articleStatus } from "@/lib/constants";

export interface ISeoTags {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  slug: string;
  canonicalUrl: string;
  imagesUrl?: string[];
  type?: string;
}

export interface IArticleContent {
  subTitle: string;
  list?: string[];
  articleParagraphs: string[];
}

export interface IContentsByLanguage {
  language: string;
  mainTitle: string;
  articleContents: IArticleContent[];
  seo: ISeoTags;
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
  sourceUrl: string;
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
