"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ISerializedArticle } from "@/types/article";
import { ISerializedComment } from "@/types/comment";
import Image from "next/image";
import { toggleArticleLike } from "@/app/actions/article/toggleArticleLike";
import { incrementArticleViews } from "@/app/actions/article/incrementArticleViews";
import { getComments } from "@/app/actions/comment/getComments";
import { Heart, Trash2, ImageOff } from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";
import { showToast } from "@/components/Toasts";
import CommentsSection from "@/components/CommentsSection";
import { Button } from "@/components/ui/button";
import CategoryCarousel from "@/components/CategoryCarousel";
import DeleteArticleModal from "@/components/DeleteArticleModal";
import SocialShare from "@/components/SocialShare";

export default function Article({
  articleData,
}: {
  articleData: ISerializedArticle | undefined;
}) {
  const [likes, setLikes] = useState<number>(articleData?.likes?.length || 0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [comments, setComments] = useState<ISerializedComment[]>([]);
  const [hasUserCommented, setHasUserCommented] = useState<boolean>(false);
  const [hasIncrementedViews, setHasIncrementedViews] =
    useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const { data: session } = useSession();
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations();

  // Helper function to format dates consistently
  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Check if user has liked the article
  useEffect(() => {
    if (session?.user?.id && articleData?.likes) {
      setIsLiked(
        articleData?.likes.some((like) => like.toString() === session.user.id)
      );
    }
  }, [session, articleData?.likes]);

  // Load comments when component mounts
  useEffect(() => {
    const loadComments = async () => {
      if (articleData?._id) {
        try {
          const result = await getComments({
            articleId: articleData._id,
            page: 1,
            limit: 50,
            sort: "createdAt",
            order: "desc",
          });

          if (result && result.success && result.comments) {
            setComments(result.comments);
            // Check if current user has commented
            const userHasCommented = result.comments.some((comment) => {
              const commentUserId =
                typeof comment.userId === "object" &&
                comment.userId !== null &&
                "_id" in comment.userId
                  ? (comment.userId as { _id: string })._id
                  : (comment.userId as string);
              return commentUserId === session?.user?.id;
            });
            setHasUserCommented(userHasCommented);
          } else {
            console.warn("Failed to load comments:", result?.error || "Unknown error");
            setComments([]);
          }
        } catch (error) {
          console.error("Error loading comments:", error);
          setComments([]);
        }
      }
    };

    loadComments();
  }, [articleData?._id, session?.user?.id]);

  // Track time spent on page and increment views after 1.5 minutes
  useEffect(() => {
    if (hasIncrementedViews || !articleData?._id) return;

    // Skip view increment for specific user ID
    if (session?.user?.id === "68e6a79afb1932c067f96e30") {
      setHasIncrementedViews(true);
      return;
    }

    const incrementViews = async () => {
      try {
        const result = await incrementArticleViews(articleData._id);

        if (result.success) {
          setHasIncrementedViews(true);
        } else {
          console.error("Failed to increment views:", result.error);
        }
      } catch (error) {
        console.error("Error incrementing article views:", error);
      }
    };

    // Set timer for 1 minutes (90 seconds)
    const timer = setTimeout(incrementViews, 60 * 1000);

    // Cleanup timer on component unmount
    return () => {
      clearTimeout(timer);
    };
  }, [articleData?._id, hasIncrementedViews, session?.user?.id]);

  // toggle article like
  const toggleLike = async () => {
    if (!session?.user?.id) {
      router.push("/signin");
      return;
    }

    try {
      const result = await toggleArticleLike(
        articleData?._id?.toString() || "",
        session?.user?.id || ""
      );

      if (result.success) {
        setLikes(result.likeCount || 0);
        setIsLiked(result.liked || false);
        if (result.liked) {
          showToast(
            "success",
            t("article.toasts.likedSuccess"),
            t("article.toasts.likedSuccessMessage")
          );
        } else {
          showToast(
            "success",
            t("article.toasts.unlikedSuccess"),
            t("article.toasts.unlikedSuccessMessage")
          );
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      showToast(
        "error",
        t("article.toasts.likeError"),
        t("article.toasts.likeErrorMessage")
      );
    }
  };

  // Check if current user is admin
  const isAdmin = () => {
    return session?.user?.role === "admin";
  };

  // Handle successful article deletion
  const handleDeleteSuccess = () => {
    // Redirect to home page after successful deletion
    router.push("/");
  };

  // Calculate content distribution across 4 containers
  const calculateContentDistribution = () => {
    const totalContent =
      articleData?.languages?.[0]?.content?.articleContents?.length || 0;
    const totalImages = articleData?.articleImages?.length || 0;

    const containers = [];

    // Always create exactly 4 containers
    for (let i = 0; i < 4; i++) {
      // Each container has 2 images side by side with overlapping pattern
      // Container 0: images 0,1
      // Container 1: images 1,2  
      // Container 2: images 2,3
      // Container 3: images 3,0 (wraps back to first)
      const firstImageIndex = i;
      const secondImageIndex = i === 3 ? 0 : i + 1;
      
      const firstImage = totalImages > firstImageIndex ? articleData?.articleImages?.[firstImageIndex] : null;
      const secondImage = totalImages > secondImageIndex ? articleData?.articleImages?.[secondImageIndex] : null;

      // Calculate how many content sections this container should have
      let contentCount = 0;
      let startIndex = 0;
      
      if (totalContent > 0) {
        // Calculate base content per container
        const baseContentPerContainer = Math.floor(totalContent / 4);
        const remainingContent = totalContent % 4;
        
        if (i < remainingContent) {
          // First 'remainingContent' containers get one extra content
          contentCount = baseContentPerContainer + 1;
          startIndex = i * (baseContentPerContainer + 1);
        } else {
          // Remaining containers get base content
          contentCount = baseContentPerContainer;
          startIndex = remainingContent * (baseContentPerContainer + 1) + (i - remainingContent) * baseContentPerContainer;
        }
      }

      const containerContent =
        articleData?.languages?.[0]?.content?.articleContents?.slice(
          startIndex,
          startIndex + contentCount
        ) || [];

      containers.push({
        firstImage,
        secondImage,
        content: containerContent,
        containerIndex: i,
        firstImageIndex,
        secondImageIndex,
      });
    }

    return containers;
  };

  const containers = calculateContentDistribution();

  // Generate share URL and data
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = articleData?.languages[0]?.content?.mainTitle || '';
  const shareDescription = articleData?.languages[0]?.content?.articleContents?.[0]?.articleParagraphs?.[0] || '';
  const shareMedia = articleData?.articleImages && articleData.articleImages.length > 0 ? articleData.articleImages[0] : '';

  return (
    <div className="flex flex-col h-full gap-8 md:gap-16 mt-8 md:mt-16">
      {/* Article Content in 4 Containers */}
      <div className="space-y-6 md:space-y-12">
        {containers.map((container, containerIndex) => (
          <div key={containerIndex}>
            {/* Newsletter Signup in the 4th container (index 3) */}
            {containerIndex === 3 && (
              <div className="mb-8 md:mb-18">
                <NewsletterSignup />
              </div>
            )}

            <div className="overflow-hidden text-justify">
              {/* Container Images - 2 images side by side on lg+, 1 image on smaller screens */}
              <div className="relative w-full h-[70vh] mb-8 md:mb-16 flex">
                {/* First Image - Always visible */}
                <div className="relative w-full lg:w-1/2 h-full">
                  {container.firstImage && container.firstImage.trim() !== "" ? (
                    <Image
                      src={container.firstImage}
                      alt={`${articleData?.languages[0]?.content?.mainTitle || 'Article'}${t(
                        "article.imageAlt"
                      )}${container.firstImageIndex + 1}`}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, (max-width: 1200px) 25vw, 25vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div className="flex flex-col items-center justify-center text-center text-gray-500">
                        <ImageOff size={24} />
                        <div className="text-sm font-medium">No Image</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Second Image - Only visible on lg+ screens */}
                <div className="relative hidden lg:block w-1/2 h-full">
                  {container.secondImage && container.secondImage.trim() !== "" ? (
                    <Image
                      src={container.secondImage}
                      alt={`${articleData?.languages[0]?.content?.mainTitle || 'Article'}${t(
                        "article.imageAlt"
                      )}${container.secondImageIndex + 1}`}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1200px) 25vw, 25vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div className="flex flex-col items-center justify-center text-center text-gray-500">
                        <ImageOff size={24} />
                        <div className="text-sm font-medium">No Image</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Overlay Header for first container only */}
                {containerIndex === 0 && (
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/30 flex flex-col justify-center items-center text-center px-4">
                    {/* Delete Button - Top Right */}
                    {isAdmin() && (
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="flex items-center justify-center w-8 h-8 bg-white/20 hover:bg-red-700 text-white border-1 border-white transition-colors cursor-pointer rounded-full backdrop-blur-sm"
                          title={t("article.actions.delete")}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    )}
                    
                    <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 md:mb-12 cursor-default drop-shadow-2xl" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)'}}>
                      {articleData?.languages[0].content.mainTitle}
                    </h1>
                    <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl">
                      <div className="flex flex-wrap items-center justify-center font-semibold text-xs md:text-sm text-gray-200 gap-4 mb-2 md:mb-0 cursor-default drop-shadow-xl" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.5)'}}>
                        <span>
                          {t("article.info.category")} {articleData?.category}
                        </span>
                        <span>
                          {t("article.info.published")}{" "}
                          {formatDate(articleData?.createdAt)}
                        </span>
                        <span>
                          {t("article.info.views")} {(articleData?.views || 0) + 97}
                        </span>
                        <span>
                          {t("article.info.likes")} {likes + 79}
                        </span>
                      </div>
                      {/* Like Button at Top */}
                      <div className="flex justify-center items-center">
                        <Button
                          onClick={toggleLike}
                          className={`flex items-center gap-1 px-2 py-1 border-none transition-colors cursor-pointer rounded-full ${
                            isLiked ? "text-red-600" : "text-gray-200"
                          }`}
                        >
                          <Heart
                            className={`size-6 ${
                              isLiked
                                ? "fill-current"
                                : "stroke-current fill-none"
                            }`}
                          />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Social Share Buttons - Inside Hero Image at Bottom */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black/40 backdrop-blur-xs shadow-2xl p-2 w-full">
                      <SocialShare
                        url={shareUrl}
                        title={shareTitle}
                        description={shareDescription}
                        media={shareMedia}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Container Content */}
              <div className="px-4 md:px-18">
                {container.content && container.content.length > 0 ? (
                  container.content.map((section, sectionIndex) => (
                    <section key={sectionIndex} className="mb-8 last:mb-0">
                      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                        {section?.subTitle || 'Untitled Section'}
                      </h2>
                      <div className="space-y-4">
                        {section?.articleParagraphs && section.articleParagraphs.length > 0 ? (
                          section.articleParagraphs.map((paragraph, pIndex) => (
                            <p
                              key={pIndex}
                              className="text-gray-700 text-lg leading-relaxed"
                            >
                              {paragraph}
                            </p>
                          ))
                        ) : (
                          <p className="text-gray-500 italic">No content available for this section.</p>
                        )}
                      </div>
                    </section>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 italic">No content available for this article.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Like Button at Bottom */}
        <div className="flex justify-center items-center">
          {/* Like Button at Bottom */}
          <Button
            onClick={toggleLike}
            className={`flex items-center gap-1 px-2 py-1 border-none shadow-none transition-colors cursor-pointer ${
              isLiked ? "text-red-600" : "text-gray-600"
            }`}
          >
            <Heart
              className={`size-6 ${
                isLiked ? "fill-current" : "stroke-current fill-none"
              }`}
            />
          </Button>
        </div>

        {/* Social Share Buttons - Above Comments */}
          <div className="text-center">
            <SocialShare
              url={shareUrl}
              title={shareTitle}
              description={shareDescription}
              media={shareMedia}
            />
          </div>

        {/* Comments Section */}
        <CommentsSection
          articleId={articleData?._id?.toString() || ""}
          comments={comments}
          setComments={setComments}
          hasUserCommented={hasUserCommented}
          setHasUserCommented={setHasUserCommented}
        />

        {/* Category Carousels */}
        <section>
          <div className="text-center bg-gradient-to-r from-orange-600 to-yellow-500 p-4 md:p-8">
            <h2 className="text-3xl font-bold text-white">
              {t("article.exploreMore")}
            </h2>
          </div>

          <CategoryCarousel category={articleData?.category || ""} />
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteArticleModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        article={articleData || null}
        onSuccess={handleDeleteSuccess}
        userId={session?.user?.id || ""}
        isAdmin={session?.user?.role === "admin"}
      />
    </div>
  );
}
