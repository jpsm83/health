"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { IArticle, IArticleComment } from "@/interfaces/article";
import Image from "next/image";
import { toggleArticleLike } from "@/app/actions/article/articleLikes";
import { Heart } from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";
import { showToast } from "@/components/Toasts";
import CommentsSection from "@/components/CommentsSection";
import { Button } from "@/components/ui/button";
import CategoryCarousel from "@/components/CategoryCarousel";

export default function Article({
  articleData,
}: {
  articleData: IArticle | undefined;
}) {
  const [likes, setLikes] = useState<number>(articleData?.likes?.length || 0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [comments, setComments] = useState<IArticleComment[]>(
    articleData?.comments || []
  );

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

  // Calculate content distribution across 4 containers
  const calculateContentDistribution = () => {
    const containerDistribution = 4;
    const totalContent =
      articleData?.contentsByLanguage[0].articleContents.length;
    const totalImages = articleData?.articleImages.length;

    if (totalContent === 0 || totalImages === 0) return [];

    const containers = [];
    let contentIndex = 0;

    for (let i = 0; i < containerDistribution; i++) {
      const imageIndex = i < (totalImages || 0) ? i : i % (totalImages || 0);
      const image = articleData?.articleImages[imageIndex];

      // Calculate how many content sections this container should have
      let contentCount = 0;
      if (i < (totalContent || 0)) {
        if (i === containerDistribution - 1) {
          // Last container gets remaining content
          contentCount = (totalContent || 0) - contentIndex;
        } else {
          // Distribute content evenly among first 3 containers
          contentCount = Math.ceil(
            ((totalContent || 0) - contentIndex) / (containerDistribution - i)
          );
        }
      }

      const containerContent =
        articleData?.contentsByLanguage[0].articleContents.slice(
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

  // Check if current user has already commented
  const hasUserCommented = comments.some(
    (comment) => comment.userId?.toString() === session?.user?.id
  );

  return (
    <div className="flex flex-col h-full gap-8 md:gap-16 mt-8 md:mt-16">
      {/* Article Content in 4 Containers */}
      <div className="space-y-6 md:space-y-12">
        {containers.map((container, containerIndex) => (
          <div key={containerIndex}>
            {/* Newsletter Signup before the last container */}
            {containerIndex === containers.length - 1 && (
              <div className="mb-8 md:mb-18">
                <NewsletterSignup />
              </div>
            )}

            <div className="overflow-hidden text-justify">
              {/* Container Image with Overlay Header for first container */}
              {container.image && (
                <div className="relative w-full h-[70vh] mb-8 md:mb-16">
                  <Image
                    src={container.image}
                    alt={`${articleData?.contentsByLanguage[0].mainTitle}${t(
                      "article.imageAlt"
                    )}${containerIndex + 1}`}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                    priority
                  />
                  
                  {/* Overlay Header for first container only */}
                  {containerIndex === 0 && (
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/30 flex flex-col justify-center items-center text-center px-4">
                      <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 md:mb-12 cursor-default">
                        {articleData?.contentsByLanguage[0].mainTitle}
                      </h1>
                      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl">
                        <div className="flex flex-wrap items-center justify-center font-semibold text-xs md:text-sm text-gray-200 gap-4 mb-2 md:mb-0 cursor-default">
                          <span>
                            {t("article.info.category")} {articleData?.category}
                          </span>
                          <span>
                            {t("article.info.published")} {formatDate(articleData?.createdAt)}
                          </span>
                          <span>
                            {t("article.info.views")} {articleData?.views}
                          </span>
                          <span>
                            {t("article.info.likes")} {likes}
                          </span>
                        </div>
                        {/* Like Button at Top */}
                        <div className="flex justify-center items-center">
                          <Button
                            onClick={toggleLike}
                            className={`flex items-center gap-1 px-2 py-1 border-none transition-colors cursor-pointer rounded-full shadow-lg ${
                              isLiked ? "text-red-400" : "text-gray-200"
                            }`}
                            title={
                              isLiked
                                ? t("article.actions.unlikeArticle")
                                : t("article.actions.likeArticle")
                            }
                          >
                            <Heart
                              className={`size-6 ${
                                isLiked ? "fill-current" : "stroke-current fill-none"
                              }`}
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Container Content */}
              <div className="px-4 md:px-18">
                {container.content?.map((section, sectionIndex) => (
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
            title={
              isLiked
                ? t("article.actions.unlikeArticle")
                : t("article.actions.likeArticle")
            }
          >
            <Heart
              className={`size-6 ${
                isLiked ? "fill-current" : "stroke-current fill-none"
              }`}
            />
            {likes > 0 && (
              <span className="text-xs font-medium">
                {likes} {t("article.actions.likes")}
              </span>
            )}
          </Button>
        </div>

        {/* Comments Section */}
        <CommentsSection
          articleId={articleData?._id?.toString() || ""}
          comments={comments}
          setComments={setComments}
          hasUserCommented={hasUserCommented}
        />

        {/* Category Carousels */}
        <section>
          <div className="text-center bg-gradient-to-r from-red-500 to-pink-500 p-4 md:p-8">
            <h2 className="text-3xl font-bold text-white">
              {t("article.exploreMore")}
            </h2>
          </div>

          <CategoryCarousel category={articleData?.category || ""} />
        </section>
      </div>
    </div>
  );
}
