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
  slug: { type: String, required: true }, // Removed unique: true since we handle it with compound index
  hreflang: { 
    type: String, 
    required: true,
    enum: ['en', 'pt', 'es', 'fr', 'de', 'it', 'nl', 'he', 'ru'] // Simplified locale list
  },
  urlPattern: { 
    type: String, 
    required: true,
    enum: ["articles", "artigos", "articulos", "artikel", "articoli", "artikelen", "מאמרים"],
    default: "articles"
  },
  canonicalUrl: {
    type: String,
    required: true,
  },
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
}); // must be at least 4 articles content

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
    }, // must be at least 4 images
    status: {
      type: String,
      enum: articleStatus,
      default: "published",
    },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: undefined,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    views: { type: Number, default: 0 },
    unpublishedAt: { type: Date, default: undefined },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    trim: true,
  }
);

// Add compound index to ensure slug uniqueness across all languages
// Note: This creates a sparse index that only includes documents where the field exists
articleSchema.index({ "contentsByLanguage.seo.slug": 1 }, { unique: true, sparse: true });

const Article = models.Article || model("Article", articleSchema);
export default Article;
