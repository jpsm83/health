import { Schema, model, models } from "mongoose";
import { commentReportReasons } from "@/lib/constants";

const commentReportSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reason: {
    type: String,
    required: true,
    enum: commentReportReasons,
  },
  reportedAt: {
    type: Date,
    default: Date.now,
  },
});

const commentSchema = new Schema(
  {
    articleId: {
      type: Schema.Types.ObjectId,
      ref: "Article",
      required: true,
      index: true, // Index for efficient queries by article
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for efficient queries by user
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: undefined,
    },
    reports: {
      type: [commentReportSchema],
      default: undefined,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    trim: true,
  }
);

// Compound indexes for efficient queries
commentSchema.index({ articleId: 1, createdAt: -1 }); // For getting comments by article, newest first
commentSchema.index({ userId: 1, createdAt: -1 }); // For getting user's comments
commentSchema.index({ isDeleted: 1, articleId: 1 }); // For filtering deleted comments
commentSchema.index({ articleId: 1, isDeleted: 1, createdAt: -1 }); // Most common query: non-deleted comments by article, newest first

const Comment = models.Comment || model("Comment", commentSchema);
export default Comment;
