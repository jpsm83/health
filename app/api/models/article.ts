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
  metaTitle: { type: String, required: true },
  metaDescription: {
    type: String,
    required: true,
    trim: true,
  },
  keywords: { type: [String], required: true },
  slug: { type: String, required: true },
  hreflang: {
    type: String,
    required: true,
    enum: ["en", "pt", "es", "fr", "de", "it"], // Simplified locale list
  },
  urlPattern: {
    type: String,
    required: true,
    enum: ["articles", "artigos", "articulos", "artikel", "articoli"],
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
  hashtags: { type: [String], required: true, maxlength: 30 }, // max 30 hashtags
  altText: { type: String, maxlength: 600 }, // accessibility text
});

// Facebook
const facebookSchema = new Schema({
  message: { type: String, maxlength: 63206, required: true }, // max 63,206 characters
  headline: { type: String, maxlength: 100, required: true }, // suggested under 100 chars
  linkDescription: { type: String, maxlength: 500, required: true }, // link preview text
  hashtags: { type: [String], required: true, maxlength: 10 }, // hashtags // optional; facebook doesn't rely on hashtags as much but keep them short. max 10
  callToAction: { type: String, maxlength: 30 }, // CTA button text (e.g., "Learn More")
});

// X (Twitter)
const xTwitterSchema = new Schema({
  text: { type: String, maxlength: 280, required: true }, // 280 characters
  hashtags: { type: [String], required: true, maxlength: 5 }, // max 5 hashtags recommended
});

// Pinterest
const pinterestSchema = new Schema({
  title: { type: String, maxlength: 100, required: true }, // 100 characters
  description: { type: String, maxlength: 500, required: true }, // 500 characters
  hashtags: { type: [String], required: true, maxlength: 8 }, // recommended max 8
  altText: { type: String, maxlength: 500, required: true }, // accessibility
});

// YouTube
const youtubeSchema = new Schema({
  title: { type: String, maxlength: 100, required: true }, // 100 characters
  description: { type: String, maxlength: 5000, required: true }, // 5,000 characters
  tags: { type: [String], required: true, maxlength: 10 }, // max tags of 10
});

// Threads
const threadsSchema = new Schema({
  text: { type: String, maxlength: 500, required: true }, // 500 characters
  hashtags: { type: [String], required: true, maxlength: 15 }, // hashtags threads doesn't rely on hashtags as much but keep them short. max 15
});

// TikTok
const tiktokSchema = new Schema({
  caption: { type: String, maxlength: 2200, required: true }, // 2,200 characters
  hashtags: { type: [String], required: true, maxlength: 30 }, // max 30 hashtags
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
    enum: ["en", "pt", "es", "fr", "de", "it"],
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
    languages: { type: [languageSpecificSchema], required: true }, // en, pt, es, fr, de, it, must be done in each language

    // Article metadata - language independent
    category: {
      type: String,
      enum: mainCategories,
      required: true,
    },
    imagesContext: { type: imagesContextSchema, required: true },
    articleImages: {
      type: [String],
    }, // best if at least 4 images
    articleVideo: { type: String }, // best if at least 1 video
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

// Add index for slug queries (not unique)
articleSchema.index({ "languages.seo.slug": 1 });

const Article = models.Article || model("Article", articleSchema);
export default Article;
