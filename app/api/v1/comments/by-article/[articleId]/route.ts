import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/api/utils/handleApiError";
import connectDb from "@/app/api/db/connectDb";
import Comment from "@/app/api/models/comment";
import { ISerializedComment } from "@/types/comment";
import { Types } from "mongoose";

// @desc    Get comments by article
// @route   GET /api/v1/comments/by-article/[articleId]
// @access  Public
export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ articleId: string }> }
) => {
  try {
    const { articleId } = await context.params;
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort = searchParams.get("sort") || "createdAt";
    const order = (searchParams.get("order") as "asc" | "desc") || "desc";
    
    if (!articleId) {
      return NextResponse.json(
        {
          success: false,
          message: "Article ID is required",
        },
        { status: 400 }
      );
    }

    await connectDb();

    // Build query
    const query: Record<string, unknown> = {
      articleId: new Types.ObjectId(articleId),
    };

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
              reportedAt: (reportObj.reportedAt as Date)?.toISOString() || new Date().toISOString(),
            };
          }) || [],
          createdAt: (comment.createdAt as Date)?.toISOString() || new Date().toISOString(),
          updatedAt: (comment.updatedAt as Date)?.toISOString() || new Date().toISOString(),
        };
      }
    );

    const hasMore = skip + comments.length < totalCount;

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
    return handleApiError("Get comments by article failed!", error as string);
  }
};
