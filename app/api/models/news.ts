import { Schema, model, models } from "mongoose";
import { mainCategories, newsStatus } from "@/lib/constants";
import { isValidUrl } from "@/app/api/utils/validators";

const contentSchema = new Schema({
  language: { type: String, required: true },
  mainTitle: { type: String, required: true, trim: true, maxlength: 200 },
  content: [
    {
      subTitle: { type: String, required: true, trim: true, maxlength: 200 },
      list: { type: [String], default: undefined },
      newsSection: { type: [String], required: true },
      imageUrl: {
        type: String,
        validate: {
          validator: function (v: string) {
            return isValidUrl(v);
          },
          message: (props: { value: string }) =>
            `${props.value} is not a valid URL!`,
        },
      },
    },
  ],
  seo: {
    metaTitle: { type: String, required: true, trim: true, maxlength: 200 },
    metaDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    keywords: { type: [String], required: true },
    slug: { type: String, required: true, unique: true },
    canonicalUrl: {
      type: String,
      validate: {
        validator: function (v: string) {
          return isValidUrl(v);
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid URL!`,
      },
    },
    ogTags: {
      title: { type: String, maxlength: 60 },
      description: { type: String, maxlength: 160 },
      image: {
        type: String,
        validate: {
          validator: function (v: string) {
            return isValidUrl(v);
          },
          message: (props: { value: string }) =>
            `${props.value} is not a valid URL!`,
        },
      },
      type: String,
    },
  },
});

export const newsSchema = new Schema(
  {
    content: { type: [contentSchema], required: true },
    imageUrl: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return isValidUrl(v);
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid URL!`,
      },
    },
    category: {
      type: String,
      enum: mainCategories,
      required: true,
      validate: {
        validator: function (v: string[]) {
          return new Set(v).size === v.length;
        },
        message: "Categories must be unique",
      },
    },
    sourceUrl: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return isValidUrl(v);
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid URL!`,
      },
    },
    status: {
      type: String,
      enum: newsStatus,
      default: "draft",
    },
    socialMetrics: {
      shares: {
        facebook: { type: Number, default: 0 },
        twitterX: { type: Number, default: 0 },
        pinterest: { type: Number, default: 0 },
        tiktok: { type: Number, default: 0 },
        reddit: { type: Number, default: 0 },
        telegram: { type: Number, default: 0 },
        whatsapp: { type: Number, default: 0 },
        email: { type: Number, default: 0 },
        linkedin: { type: Number, default: 0 },
        instagram: { type: Number, default: 0 },
        youtube: { type: Number, default: 0 },
      },
      engagementDetails: {
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
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
      },
    },
    analytics: {
      views: { type: Number, default: 0 },
    }, // Analytics
    unpublishedAt: { type: Date, default: undefined },
  },
  {
    timestamps: true,
    trim: true,
  }
);

// Create indexes
newsSchema.index({ "content.seo.slug": 1 }, { unique: true });
newsSchema.index({ status: 1, isPublished: 1 });
newsSchema.index({ category: 1 });
newsSchema.index({ "socialMetrics.engagementDetails.likes": 1 });

const News = models.News || model("News", newsSchema);
export default News;
