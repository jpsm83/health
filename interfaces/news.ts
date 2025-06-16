import { Types } from "mongoose";
import { mainCategories, newsStatus } from "@/lib/constants";

export interface ISeoTags {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  slug: string;
  canonicalUrl?: string;
  ogTags?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
  };
}

export interface INewsContent {
  language: string;
  mainTitle: string;
  content: Array<{
    subTitle: string;
    list?: string[];
    newsSection: string[];
    imageUrl?: string;
  }>;
  seo: ISeoTags;
}

export interface ISocialShares {
  facebook: number;
  twitterX: number;
  pinterest: number;
  tiktok: number;
  reddit: number;
  telegram: number;
  whatsapp: number;
  email: number;
  linkedin: number;
  instagram: number;
  youtube: number;
}

export interface INewsComment {
  userId: Types.ObjectId;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INews {
  _id?: Types.ObjectId;
  content: INewsContent[];
  imageUrl: string;
  category: typeof mainCategories;
  sourceUrl: string;
  status: typeof newsStatus;
  socialMetrics: {
    shares: ISocialShares;
    engagementDetails: {
      likes: Types.ObjectId[];
      comments?: INewsComment[];
    };
  };
  analytics: {
    views: number;
  };
  unpublishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
