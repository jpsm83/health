import { Schema, model, models } from "mongoose";
import { mainCategories, articleStatus } from "@/lib/constants";

// =========================
// LANGUAGE-SPECIFIC SCHEMAS
// =========================

// Canvas schema - language independent but included in language wrapper for consistency
const canvasSchema = new Schema({
  paragraphOne: { type: String, required: true, maxlength: 205 },
  paragraphTwo: { type: String, required: true, maxlength: 205 },
  paragraphThree: { type: String, required: true, maxlength: 205 },
});

// SEO schema - language specific
const seoSchema = new Schema({
  metaTitle: { type: String, required: true, maxlength: 500 },
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

// Article content schema - language specific
const articleContentSchema = new Schema({
  mainTitle: { type: String, required: true, maxlength: 400 },
  articleContents: [
    {
      subTitle: { type: String, required: true, maxlength: 400 },
      articleParagraphs: { type: [String], required: true },
    },
  ],
}); // must be at least 4 articles content

// =========================
// SOCIAL MEDIA SCHEMAS
// =========================

// Instagram
const instagramSchema = new Schema({
  caption: { type: String, maxlength: 2200, required: true }, // max 2,200 characters
  hashtags: { type: [String], required: true }, // max 30 hashtags
  altText: { type: String, maxlength: 600 }, // accessibility text
  image: { type: String }, // 1080x1080 or 1080x1350
  video: { type: String }, // video URL for reels
  url: { type: String, required: true }, // link to article/landing
});

// Facebook
const facebookSchema = new Schema({
  message: { type: String, maxlength: 63206, required: true }, // max 63,206 characters
  headline: { type: String, maxlength: 100, required: true }, // suggested under 100 chars
  linkDescription: { type: String, maxlength: 300, required: true }, // link preview text
  hashtags: { type: [String], required: true }, // hashtags // optional; facebook doesn't rely on hashtags as much but keep them short. max 10
  image: { type: String }, // 1200x630 recommended
  video: { type: String }, // optional video
  callToAction: { type: String, maxlength: 30 }, // CTA button text (e.g., "Learn More")
  url: { type: String, required: true }, // link to article
});

// X (Twitter)
const xTwitterSchema = new Schema({
  text: { type: String, maxlength: 280, required: true }, // 280 characters
  hashtags: { type: [String], required: true }, // max 5 hashtags recommended
  image: { type: String }, // 1200x675 recommended
  video: { type: String }, // optional video
  url: { type: String, required: true }, // shortened link (can add UTM params)
});

// Pinterest
const pinterestSchema = new Schema({
  title: { type: String, maxlength: 100, required: true }, // 100 characters
  description: { type: String, maxlength: 500, required: true }, // 500 characters
  hashtags: { type: [String], required: true }, // recommended max 8
  image: { type: String }, // 1000x1500 recommended
  altText: { type: String, maxlength: 500, required: true }, // accessibility
  url: { type: String, required: true }, // destination link
});

// YouTube
const youtubeSchema = new Schema({
  title: { type: String, maxlength: 100, required: true }, // 100 characters
  description: { type: String, maxlength: 5000, required: true }, // 5,000 characters
  tags: { type: [String], required: true }, // total tag length <= 500 chars
  video: { type: String, required: true }, // video URL
  thumbnail: { type: String }, // 1280x720
  url: { type: String, required: true }, // link in description/pinned comment
});

// Threads
const threadsSchema = new Schema({
  text: { type: String, maxlength: 500, required: true }, // 500 characters
  image: { type: String }, // optional image
  video: { type: String }, // optional video
  hashtags: { type: [String], required: true }, // hashtags threads doesn't rely on hashtags as much but keep them short. max 15
  url: { type: String, required: true }, // link back to article
});

// TikTok
const tiktokSchema = new Schema({
  caption: { type: String, maxlength: 2200, required: true }, // 2,200 characters
  hashtags: { type: [String], required: true }, // max 30 hashtags
  video: { type: String, required: true }, // video URL
  coverImage: { type: String }, // optional cover image
  url: { type: String, required: true }, // link in bio/CTA
});

// =========================
// UNIFIED LANGUAGE-SPECIFIC SCHEMA
// =========================

// This schema combines all language-specific components for better organization and maintainability
const languageSpecificSchema = new Schema({
  // Language identifier - single source of truth for language
  hreflang: {
    type: String,
    required: true,
    enum: ["en", "pt", "es", "fr", "de", "it", "he"],
  },

  // Canvas content (language independent but grouped by language for consistency)
  canvas: { type: canvasSchema, required: true },

  // SEO data specific to this language
  seo: { type: seoSchema, required: true },

  // Article content specific to this language
  content: { type: articleContentSchema, required: true },

  // Social media content specific to this language
  socialMedia: {
    instagram: instagramSchema,
    facebook: facebookSchema,
    xTwitter: xTwitterSchema,
    pinterest: pinterestSchema,
    youtube: youtubeSchema,
    threads: threadsSchema,
    tiktok: tiktokSchema,
  },
});

// =========================
// IMAGES CONTEXT SCHEMAS
// =========================

const imagesContextSchema = new Schema({
  imageOne: { type: String, required: true },
  imageTwo: { type: String, required: true },
  imageThree: { type: String, required: true },
  imageFour: { type: String, required: true },
});

// =========================
// ARTICLE MAIN SCHEMA
// =========================

export const articleSchema = new Schema(
  {
    // Unified language-specific content - all language-dependent data in one place
    languages: { type: [languageSpecificSchema], required: true }, // en, pt, es, fr, de, it, he, must be done in each language

    // Article metadata - language independent
    category: {
      type: String,
      enum: mainCategories,
      required: true,
    },
    imagesContext: { type: imagesContextSchema, required: true },
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
  { "languages.seo.slug": 1 },
  { unique: true, sparse: true }
);

const Article = models.Article || model("Article", articleSchema);
export default Article;
