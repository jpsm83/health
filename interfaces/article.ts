import { Types } from "mongoose";
import { mainCategories, articleStatus } from "@/lib/constants";

export interface ISeo {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  slug: string;
  hreflang: string;
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

export interface IArticleComment {
  userId: Types.ObjectId;
  comment: string;
  commentsikes?: Types.ObjectId[];
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
