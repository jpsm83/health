import { Schema, model, models } from "mongoose";
import { mainCategories, articleStatus } from "@/lib/constants";

// =========================
// LANGUAGE-SPECIFIC SCHEMAS
// =========================

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
  mainTitle: { type: String, required: true },
  articleContents: [
    {
      subTitle: { type: String, required: true },
      articleParagraphs: { type: [String], required: true },
    },
  ],
}); // must be at least 4 articles content

// =========================
// SOCIAL MEDIA SCHEMAS
// =========================

// Instagram
const instagramSchema = new Schema({
  caption: { type: String, required: true },
  hashtags: { type: String, required: true },
  altText: { type: String }, // accessibility text
});

// Facebook
const facebookSchema = new Schema({
  message: { type: String, required: true },
  headline: { type: String, required: true },
  linkDescription: { type: String, required: true }, // link preview text
  hashtags: { type: String, required: true }, // hashtags
  callToAction: { type: String }, // CTA button text (e.g., "Learn More")
});

// X (Twitter)
const xTwitterSchema = new Schema({
  text: { type: String, required: true },
  hashtags: { type: String, required: true },
});

// Pinterest
const pinterestSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  hashtags: { type: String, required: true },
  altText: { type: String, required: true }, // accessibility
});

// Threads
const threadsSchema = new Schema({
  text: { type: String, required: true },
  hashtags: { type: String, required: true },
});

// TikTok
const tiktokSchema = new Schema({
  title: { type: String, required: true },
  caption: { type: String, required: true },
  hashtags: { type: String, required: true },
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

  // Article context content (around 200 charecters)
  articleContext: { type: String, required: true },

  // image url to be used in the social media post
  postImage: { type: String, required: true },

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
