import { Schema, model, models } from "mongoose";
import { mainCategories, articleStatus } from "@/lib/constants";

// =========================
// SEO SCHEMAS
// =========================

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
    enum: ["en", "pt", "es", "fr", "de", "it", "he"], // Simplified locale list
  },
  urlPattern: {
    type: String,
    required: true,
    enum: ["articles", "artigos", "articulos", "artikel", "articoli", "מאמרים"],
    default: "articles",
  },
  canonicalUrl: {
    type: String,
    required: true,
  },
});

// =========================
// ARTICLE CONTENTS SCHEMAS
// =========================

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

// =========================
// SOCIAL MEDIA SCHEMAS
// =========================

// Instagram
const instagramSchema = new Schema({
  caption: { type: String, trim: true, maxlength: 2200 }, // max 2,200 characters
  hashtags: { type: [String] }, // max 30 hashtags
  altText: { type: String, trim: true, maxlength: 100 }, // accessibility text
  image: { type: String }, // 1080x1080 or 1080x1350
  video: { type: String }, // video URL for reels
  url: { type: String, required: true }, // link to article/landing
});

// Facebook
const facebookSchema = new Schema({
  message: { type: String, trim: true, maxlength: 63206 }, // max 63,206 characters
  headline: { type: String, trim: true, maxlength: 100 }, // suggested under 100 chars
  linkDescription: { type: String, trim: true, maxlength: 300 }, // link preview text
  hashtags: { type: [String] }, // hashtags // optional; facebook doesn't rely on hashtags as much but keep them short. max 10
  image: { type: String }, // 1200x630 recommended
  video: { type: String }, // optional video
  callToAction: { type: String, trim: true, maxlength: 30 }, // CTA button text (e.g., "Learn More")
  url: { type: String, required: true }, // link to article
});

// X (Twitter)
const xTwitterSchema = new Schema({
  text: { type: String, trim: true, maxlength: 280 }, // 280 characters
  hashtags: { type: [String] }, // max 5 hashtags recommended
  image: { type: String }, // 1200x675 recommended
  video: { type: String }, // optional video
  url: { type: String, required: true }, // shortened link (can add UTM params)
});

// Pinterest
const pinterestSchema = new Schema({
  title: { type: String, trim: true, maxlength: 100 }, // 100 characters
  description: { type: String, trim: true, maxlength: 500 }, // 500 characters
  hashtags: { type: [String] }, // recommended max 8
  image: { type: String }, // 1000x1500 recommended
  altText: { type: String, trim: true, maxlength: 500 }, // accessibility
  url: { type: String, required: true }, // destination link
});

// YouTube
const youtubeSchema = new Schema({
  title: { type: String, trim: true, maxlength: 100 }, // 100 characters
  description: { type: String, trim: true, maxlength: 5000 }, // 5,000 characters
  tags: { type: [String] }, // total tag length <= 500 chars
  video: { type: String, required: true }, // video URL
  thumbnail: { type: String }, // 1280x720
  url: { type: String, required: true }, // link in description/pinned comment
});

// Threads
const threadsSchema = new Schema({
  text: { type: String, trim: true, maxlength: 500 }, // 500 characters
  image: { type: String }, // optional image
  video: { type: String }, // optional video
  hashtags: { type: [String] }, // hashtags threads doesn't rely on hashtags as much but keep them short. max 15
  url: { type: String, required: true }, // link back to article
});

// TikTok
const tiktokSchema = new Schema({
  caption: { type: String, trim: true, maxlength: 2200 }, // 2,200 characters
  hashtags: { type: [String] }, // max 30 hashtags
  video: { type: String, required: true }, // video URL
  coverImage: { type: String }, // optional cover image
  url: { type: String, required: true }, // link in bio/CTA
});

// =========================
// SOCIAL MEDIA WRAPPER
// =========================

const socialMediaSchema = new Schema({
  hreflang: {
    type: String,
    required: true,
    enum: ["en", "pt", "es", "fr", "de", "it", "he"],
  },
  instagram: instagramSchema,
  facebook: facebookSchema,
  xTwitter: xTwitterSchema,
  pinterest: pinterestSchema,
  youtube: youtubeSchema,
  threads: threadsSchema,
  tiktok: tiktokSchema,
});

// =========================
// ARTICLE MAIN SCHEMA
// =========================

export const articleSchema = new Schema(
  {
    contentsByLanguage: { type: [contentsByLanguageSchema], required: true },
    socialMedia: { type: [socialMediaSchema], default: undefined },
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
articleSchema.index(
  { "contentsByLanguage.seo.slug": 1 },
  { unique: true, sparse: true }
);

const Article = models.Article || model("Article", articleSchema);
export default Article;
