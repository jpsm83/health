import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/v1/auth/[...nextauth]/auth";
import { handleApiError } from "@/app/api/utils/handleApiError";
import connectDb from "@/app/api/db/connectDb";
import Comment from "@/app/api/models/comment";
import Article from "@/app/api/models/article";
import User from "@/app/api/models/user";
import { ISerializedComment } from "@/types/comment";
import { Types } from "mongoose";

// @desc    Get comments
// @route   GET /api/v1/comments
// @access  Public
export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const articleId = searchParams.get("articleId") || undefined;
    const userId = searchParams.get("userId") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort = searchParams.get("sort") || "createdAt";
    const order = (searchParams.get("order") as "asc" | "desc") || "desc";

    await connectDb();

    // Build query
    const query: Record<string, unknown> = {};

    if (articleId) {
      query.articleId = new Types.ObjectId(articleId);
    }

    if (userId) {
      query.userId = new Types.ObjectId(userId);
    }

    // Build sort object
    const sortObj: Record<string, 1 | -1> = {};
    sortObj[sort] = order === "asc" ? 1 : -1;

    // Calculate skip
    const skip = (page - 1) * limit;

    // Get comments with pagination
    const [comments, totalCount] = await Promise.all([
      Comment.find(query)
        .populate({
          path: "userId",
          select: "username imageUrl",
          model: "User",
        })
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Comment.countDocuments(query),
    ]);

    // Serialize comments
    const serializedComments: ISerializedComment[] = comments.map(
      (comment: Record<string, unknown>) => {
        // Handle populated userId - it could be an object with user data or just an ObjectId string
        let userId: string | { _id: string; username: string; imageUrl?: string };

        if (
          comment.userId &&
          typeof comment.userId === "object" &&
          comment.userId !== null &&
          "username" in comment.userId
        ) {
          // User is populated
          const user = comment.userId as {
            _id: { toString: () => string };
            username: string;
            imageUrl?: string;
          };
          userId = {
            _id: user._id.toString(),
            username: user.username,
            imageUrl: user.imageUrl,
          };
        } else {
          // User is not populated, just ObjectId
          userId = (comment.userId as { toString: () => string })?.toString() || "";
        }

        return {
          _id: (comment._id as { toString: () => string }).toString(),
          articleId: (comment.articleId as { toString: () => string }).toString(),
          userId,
          comment: comment.comment as string,
          likes: (comment.likes as unknown[])?.map((like: unknown) =>
            (like as { toString: () => string }).toString()
          ) || [],
          reports: (comment.reports as unknown[])?.map((report: unknown) => {
            const reportObj = report as Record<string, unknown>;
            return {
              userId: (reportObj.userId as { toString: () => string }).toString(),
              reason: reportObj.reason as
                | "bad_language"
                | "racist"
                | "spam"
                | "harassment"
                | "inappropriate_content"
                | "false_information"
                | "other",
              reportedAt:
                (reportObj.reportedAt as Date)?.toISOString() ||
                new Date().toISOString(),
            };
          }) || [],
          createdAt:
            (comment.createdAt as Date)?.toISOString() ||
            new Date().toISOString(),
          updatedAt:
            (comment.updatedAt as Date)?.toISOString() ||
            new Date().toISOString(),
        };
      }
    );

    const hasMore = skip + limit < totalCount;

    return NextResponse.json(
      {
        success: true,
        data: {
          comments: serializedComments,
          totalCount,
          hasMore,
          page,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError("Get comments failed!", error as string);
  }
};

// @desc    Create comment
// @route   POST /api/v1/comments
// @access  Private
export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "You must be signed in to create a comment",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { articleId, comment } = await req.json();

    if (!articleId || !comment) {
      return NextResponse.json(
        {
          success: false,
          message: "Article ID and comment are required",
        },
        { status: 400 }
      );
    }

    // Validation
    const trimmed = comment.trim();
    if (!trimmed) {
      return NextResponse.json(
        { success: false, message: "Comment cannot be empty" },
        { status: 400 }
      );
    }
    if (trimmed.length > 1000) {
      return NextResponse.json(
        { success: false, message: "Comment cannot be longer than 1000 characters" },
        { status: 400 }
      );
    }
    if (trimmed.includes("http")) {
      return NextResponse.json(
        { success: false, message: "Comment cannot contain links" },
        { status: 400 }
      );
    }

    await connectDb();

    // Check if article exists
    const article = await Article.findById(articleId);
    if (!article) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    // Check if user has already commented on this article
    const existingComment = await Comment.findOne({
      articleId: new Types.ObjectId(articleId),
      userId: new Types.ObjectId(session.user.id),
    });

    if (existingComment) {
      return NextResponse.json(
        { success: false, message: "You have already commented on this article" },
        { status: 400 }
      );
    }

    // Create new comment
    const newComment = new Comment({
      articleId: new Types.ObjectId(articleId),
      userId: new Types.ObjectId(session.user.id),
      comment: trimmed,
    });

    const savedComment = await newComment.save();

    // Update article's comment count
    await Article.findByIdAndUpdate(articleId, {
      $inc: { commentsCount: 1 },
    });

    // Update user's commentedArticles array
    await User.findByIdAndUpdate(session.user.id, {
      $addToSet: { commentedArticles: articleId },
    });

    // Populate user data for the comment
    const populatedComment = await Comment.findById(savedComment._id)
      .populate({
        path: "userId",
        select: "username imageUrl",
        model: "User",
      })
      .lean();

    if (!populatedComment) {
      return NextResponse.json(
        { success: false, message: "Failed to create comment" },
        { status: 500 }
      );
    }

    // Serialize comment
    const commentData = populatedComment as Record<string, unknown>;
    let userId: string | { _id: string; username: string; imageUrl?: string };

    if (
      commentData.userId &&
      typeof commentData.userId === "object" &&
      commentData.userId !== null &&
      "username" in commentData.userId
    ) {
      const user = commentData.userId as {
        _id: { toString: () => string };
        username: string;
        imageUrl?: string;
      };
      userId = {
        _id: user._id.toString(),
        username: user.username,
        imageUrl: user.imageUrl,
      };
    } else {
      userId = (commentData.userId as { toString: () => string })?.toString() || "";
    }

    const serializedComment: ISerializedComment = {
      _id: (commentData._id as { toString: () => string }).toString(),
      articleId: (commentData.articleId as { toString: () => string }).toString(),
      userId,
      comment: commentData.comment as string,
      likes: [],
      reports: [],
      createdAt:
        (commentData.createdAt as Date)?.toISOString() ||
        new Date().toISOString(),
      updatedAt:
        (commentData.updatedAt as Date)?.toISOString() ||
        new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: serializedComment,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError("Create comment failed!", error as string);
  }
};
