import { Types } from "mongoose";
import { mainCategories, articleStatus } from "@/lib/constants";

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

export interface ICommentReport {
  userId: Types.ObjectId;
  reason: 'bad_language' | 'racist' | 'spam' | 'harassment' | 'inappropriate_content' | 'false_information' | 'other';
  reportedAt?: Date;
}

export interface IArticleComment {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  comment: string;
  commentLikes?: Types.ObjectId[];
  commentReports?: ICommentReport[];
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
