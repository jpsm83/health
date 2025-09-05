"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { IArticle, IArticleComment } from "@/interfaces/article";
import Image from "next/image";
import { toggleArticleLike } from "@/app/actions/articleLikes";
import { createComment } from "@/app/actions/comments";
import { Heart } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function Article(articleData: IArticle) {
  const { data: session } = useSession();
  const locale = useLocale();
  const [likes, setLikes] = useState<number>(articleData.likes?.length || 0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string | undefined>(undefined);
  const [comments, setComments] = useState<IArticleComment[]>(
    articleData.comments || []
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();

  // Helper function to format dates consistently
  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Check if user has liked the article
  useEffect(() => {
    if (session?.user?.id && articleData.likes) {
      setIsLiked(
        articleData.likes.some((like) => like.toString() === session.user.id)
      );
    }
  }, [session, articleData.likes]);

  // toggle article like
  const toggleLike = async () => {
    if (!session?.user?.id){
      router.push("/signin");
      return;
    }

    try {
      const result = await toggleArticleLike(articleData._id?.toString() || "", session?.user?.id || "");
      if (result.success) {
        setLikes(result.likeCount || 0);
        setIsLiked(result.liked || false);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  // Handle comment submission
  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !newComment?.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await createComment(
        articleData._id?.toString() || "",
        newComment?.trim() || "",
        session?.user?.id || ""
      );
      if (result.success && result.comment) {
        setComments((prev) => [...prev, result.comment]);
        setNewComment(undefined);
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate content distribution across 4 containers
  const calculateContentDistribution = () => {
    const containerDistribution = 4;
    const totalContent =
      articleData.contentsByLanguage[0].articleContents.length;
    const totalImages = articleData.articleImages.length;

    if (totalContent === 0 || totalImages === 0) return [];

    const containers = [];
    let contentIndex = 0;

    for (let i = 0; i < containerDistribution; i++) {
      const imageIndex = i < totalImages ? i : i % totalImages;
      const image = articleData.articleImages[imageIndex];

      // Calculate how many content sections this container should have
      let contentCount = 0;
      if (i < totalContent) {
        if (i === containerDistribution - 1) {
          // Last container gets remaining content
          contentCount = totalContent - contentIndex;
        } else {
          // Distribute content evenly among first 3 containers
          contentCount = Math.ceil(
            (totalContent - contentIndex) / (containerDistribution - i)
          );
        }
      }

      const containerContent =
        articleData.contentsByLanguage[0].articleContents.slice(
          contentIndex,
          contentIndex + contentCount
        );
      contentIndex += contentCount;

      containers.push({
        image,
        content: containerContent,
        imageIndex,
      });
    }

    return containers;
  };

  const containers = calculateContentDistribution();

  return (
    <div className="flex flex-col h-full gap-8 md:gap-16">
      {/* Article Header */}
      <header className="text-center py-8 bg-gray-100">
        <h1 className="text-4xl md:text-7xl font-bold text-gray-800 mb-6 cursor-default">
          {articleData.contentsByLanguage[0].mainTitle}
        </h1>
        <div className="flex flex-col md:flex-row items-center justify-between px-2 md:px-8">
        <div className="flex flex-wrap items-center justify-center font-semibold text-xs md:text-sm text-gray-400 gap-4 mb-2 md:mb-0 cursor-default">
          <span>Category: {articleData.category}</span>
          <span>
            Published:{" "}
            {formatDate(articleData.createdAt)}
          </span>
          <span>
            Views: {articleData.views}
          </span>
          <span>
            Likes: {likes}
          </span>
          </div>
          {/* Like Button at Top */}
            <Heart onClick={toggleLike} size={24} className={`cursor-pointer ${isLiked ? "fill-red-500 text-red-700" : "fill-gray-400 text-gray-600"}`} />
        </div>
      </header>

      {/* Article Content in 4 Containers */}
      <div className="space-y-12">
        {containers.map((container, containerIndex) => (
          <div
            key={containerIndex}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Container Image */}
            {container.image && (
              <div className="relative w-full h-64 md:h-80">
                <Image
                  src={container.image}
                  alt={`${
                    articleData.contentsByLanguage[0].mainTitle
                  } - Section ${containerIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                  priority
                />
              </div>
            )}

            {/* Container Content */}
            <div className="p-6 md:p-8">
              {container.content.map((section, sectionIndex) => (
                <section key={sectionIndex} className="mb-8 last:mb-0">
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                    {section.subTitle}
                  </h2>
                  <div className="space-y-4">
                    {section.articleParagraphs.map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="text-gray-700 text-lg leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Like Button at Bottom */}
      <div className="flex justify-center py-8">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-200 ${
            isLiked
              ? "bg-red-500 text-white shadow-lg scale-105"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <span className="text-3xl">❤️</span>
          <span className="font-semibold text-lg">
            {likes} {likes === 1 ? "Like" : "Likes"}
          </span>
        </button>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Comments
        </h3>

        {/* Comment Form - Only for logged in users */}
        {session?.user?.id && (
          <form onSubmit={handleComment} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                maxLength={600}
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={!newComment?.trim() || isSubmitting}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            comments.map((comment, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">User</span>
                    <span className="text-sm text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700">{comment.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
