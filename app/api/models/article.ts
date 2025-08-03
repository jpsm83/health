import { Schema, model, models } from "mongoose";
import { mainCategories, articleStatus, languageConfig } from "@/lib/constants";

const seoSchema = new Schema({
  metaTitle: { type: String, required: true, trim: true, maxlength: 500 },
  metaDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  keywords: { type: [String], required: true },
  slug: { type: String, required: true }, // Removed unique: true since we handle it with compound index
  hreflang: { 
    type: String, 
    required: true,
    enum: Object.keys(languageConfig) // Use hreflang as the single source of truth
  },
  urlPattern: { 
    type: String, 
    required: true,
    enum: ["articles", "artigos", "articulos", "articles", "artikel", "articoli", "artikelen", "מאמרים"],
    default: "articles"
  },
  canonicalUrl: {
    type: String,
    required: true,
  },
  type: { type: String, required: true, default: "article" },
});

const contentsByLanguageSchema = new Schema({
  // Remove duplicate language and locale fields - use hreflang from SEO instead
  mainTitle: { type: String, required: true, trim: true, maxlength: 200 },
  articleContents: [
    {
      subTitle: { type: String, required: true, trim: true, maxlength: 200 },
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

// Add compound index to ensure slug uniqueness across all languages
articleSchema.index({ "contentsByLanguage.seo.slug": 1 }, { unique: true });

const Article = models.Article || model("Article", articleSchema);
export default Article;
