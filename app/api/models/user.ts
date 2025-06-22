import { Schema, model, models } from "mongoose";
import {
  genders,
  mainCategories,
  newsletterFrequencies,
  roles,
} from "@/lib/constants";

const categoryInterests = new Schema({
  type: { type: String, enum: mainCategories },
  articlesletterSubscription: { type: Boolean, default: true },
  subscriptionFrequencies: { type: String, enum: newsletterFrequencies },
});

export const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required!"],
      trim: true,
      minlength: [5, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, underscores and dashes",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address!",
      ],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    role: { type: String, enum: roles, required: true },
    gender: { type: String, enum: genders, required: true },
    birthDate: {
      type: Date,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    preferences: {
      language: { type: String, required: true },
      region: { type: String, required: true },
      contentLanguage: { type: String, required: true },
    },
    likedArticles: {
      type: [{ type: Schema.Types.ObjectId, ref: "Articles" }],
      default: undefined
    },
    commentedArticles: {
      type: [{ type: Schema.Types.ObjectId, ref: "Articles" }],
      default: undefined
    },
    categoryInterests: {
      type: [categoryInterests],
      required: true,
    },
    readingHistory: {
      type: [
        {
          articlesId: {
            type: Schema.Types.ObjectId,
            ref: "Articles",
            required: true,
          },
          readAt: { type: Date, default: Date.now },
        },
      ],
      default: undefined,
    },
    lastLogin: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true,
    trim: true,
  }
);

const User = models.User || model("User", userSchema);
export default User;
