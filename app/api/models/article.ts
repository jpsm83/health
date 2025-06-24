import { Schema, model, models } from "mongoose";
import { mainCategories, articleStatus } from "@/lib/constants";

const seoSchema = new Schema({
  metaTitle: { type: String, required: true, trim: true, maxlength: 500 },
  metaDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  keywords: { type: [String], required: true },
  slug: { type: String, required: true },
  canonicalUrl: {
    type: String,
    required: true,
  },
  imagesUrl: {
    type: [String],
  },
  type: { type: String, required: true, default: "article" },
});

const contentsByLanguageSchema = new Schema({
  language: { type: String, required: true },
  mainTitle: { type: String, required: true, trim: true, maxlength: 200 },
  articleContents: [
    {
      subTitle: { type: String, required: true, trim: true, maxlength: 200 },
      list: { type: [String], default: undefined },
      articleParagraphs: { type: [String], required: true },
    },
  ],
  seo: { type: seoSchema, required: true },
});

export const articleSchema = new Schema(
  {
    contentsByLanguage: { type: [contentsByLanguageSchema], required: true },
    category: {
      type: String,
      enum: mainCategories,
      required: true,
    },
    sourceUrl: {
      type: String,
      required: true,
    }, // article source url that was used to create this article
    articleImages: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      enum: articleStatus,
      default: "published",
    },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: undefined,
    },
    comments: {
      type: [
        {
          userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          comment: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
          },
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now },
        },
      ],
      default: undefined,
    },
    views: { type: Number, default: 0 },
    unpublishedAt: { type: Date, default: undefined },
  },
  {
    timestamps: true,
    trim: true,
  }
);

const Article = models.Article || model("Article", articleSchema);
export default Article;
