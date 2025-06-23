import { Schema, model, models } from "mongoose";
import { mainCategories, articleStatus } from "@/lib/constants";
import { isValidUrl } from "@/lib/utils/isValidUrl";

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
    validate: {
      validator: function (v: string) {
        return isValidUrl(v);
      },
      message: (props: { value: string }) =>
        `${props.value} is not a valid URL!`,
    },
  },
  imagesUrl: {
    type: [String],
    validate: {
      validator: function (v: string) {
        return isValidUrl(v);
      },
      message: (props: { value: string }) =>
        `${props.value} is not a valid URL!`,
    },
  },
  type: { type: String, required: true, default: "article" },
});

const contentSchema = new Schema({
  language: { type: String, required: true },
  mainTitle: { type: String, required: true, trim: true, maxlength: 200 },
  content: [
    {
      subTitle: { type: String, required: true, trim: true, maxlength: 200 },
      list: { type: [String], default: undefined },
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
      articleParagraphs: { type: [String], required: true },
    },
  ],
  seo: { type: seoSchema, required: true },
});

export const articleSchema = new Schema(
  {
    content: { type: [contentSchema], required: true },
    category: {
      type: String,
      enum: mainCategories,
      required: true,
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
    }, // article source url that was used to create this article
    status: {
      type: String,
      enum: articleStatus,
      default: "published",
    },
    socialMetrics: {
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
    },
    unpublishedAt: { type: Date, default: undefined },
  },
  {
    timestamps: true,
    trim: true,
  }
);

const Article = models.Article || model("Article", articleSchema);
export default Article;
