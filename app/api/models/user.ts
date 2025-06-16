import { Schema, model, models } from "mongoose";
import {
  genders,
  mainCategories,
  newsletterFrequencies,
  roles,
} from "@/lib/constants";
import { isValidUrl } from "@/app/api/utils/validators";

const categoryInterests = new Schema({
  type: { type: String, enum: mainCategories },
  newsletterSubscription: { type: Boolean, default: true },
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
      validate: {
        validator: function (v: Date) {
          return v < new Date();
        },
        message: "Birth date cannot be in the future",
      },
    },
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
    preferences: {
      language: { type: String, required: true },
      region: { type: String, required: true },
      contentLanguage: { type: String, required: true },
    },
    likedNews: [{ type: Schema.Types.ObjectId, ref: "News" }],
    commentedNews: [{ type: Schema.Types.ObjectId, ref: "News" }],
    categoryInterests: {
      type: [categoryInterests],
      required: true,
      validate: {
        validator: function (v: { type: string }[]) {
          const types = v.map((interest) => interest.type);
          return new Set(types).size === types.length;
        },
        message: "Category interests must be unique",
      },
    },
    readingHistory: {
      type: [
        {
          newsId: { type: Schema.Types.ObjectId, ref: "News", required: true },
          readAt: { type: Date, default: Date.now },
        },
      ],
      default: undefined,
    },
    lastLogin: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
    trim: true,
  }
);

// Create indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 });
userSchema.index({ "categoryInterests.type": 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ emailVerified: 1 });

const User = models.User || model("User", userSchema);
export default User;
