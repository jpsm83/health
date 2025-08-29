'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { IArticle, IArticleComment } from '@/interfaces/article';
import Image from 'next/image';
import { toggleArticleLike } from '@/app/actions/articleLikes';
import { createComment } from '@/app/actions/comments';

export default function ArticlePageClient(articleData: IArticle) {
  // const { data: session } = useSession();
  // const [likes, setLikes] = useState(articleData.likes?.length || 0);
  // const [isLiked, setIsLiked] = useState(false);
  // const [newComment, setNewComment] = useState('');
  // const [comments, setComments] = useState(articleData.comments || []);
  // const [isSubmitting, setIsSubmitting] = useState(false);

  // // Check if user has liked the article
  // useEffect(() => {
  //   if (session?.user?.id && article.likes) {
  //     setIsLiked(article.likes.some(like => like.toString() === session.user.id));
  //   }
  // }, [session, article.likes]);

  // // Handle article like
  // const handleLike = async () => {
  //   if (!session?.user?.id) return;
    
  //   try {
  //     const result = await toggleArticleLike(article._id?.toString() || '');
  //     if (result.success) {
  //       setLikes(result.likeCount || 0);
  //       setIsLiked(result.liked || false);
  //     }
  //   } catch (error) {
  //     console.error('Error toggling like:', error);
  //   }
  // };

  // // Handle comment submission
  // const handleComment = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!session?.user?.id || !newComment.trim() || isSubmitting) return;
    
  //   setIsSubmitting(true);
  //   try {
  //     const result = await createComment(article._id?.toString() || '', newComment.trim());
  //     if (result.success && result.comment) {
  //       setComments(prev => [...prev, result.comment]);
  //       setNewComment('');
  //     }
  //   } catch (error) {
  //     console.error('Error creating comment:', error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // // Calculate content distribution across 4 containers
  // const calculateContentDistribution = () => {
  //   const totalContent = content.articleContents.length;
  //   const totalImages = article.articleImages.length;
    
  //   if (totalContent === 0 || totalImages === 0) return [];
    
  //   const containers = [];
  //   let contentIndex = 0;
    
  //   for (let i = 0; i < 4; i++) {
  //     const imageIndex = i < totalImages ? i : i % totalImages;
  //     const image = article.articleImages[imageIndex];
      
  //     // Calculate how many content sections this container should have
  //     let contentCount = 0;
  //     if (i < totalContent) {
  //       if (i === 3) {
  //         // Last container gets remaining content
  //         contentCount = totalContent - contentIndex;
  //       } else {
  //         // Distribute content evenly among first 3 containers
  //         contentCount = Math.ceil((totalContent - contentIndex) / (4 - i));
  //       }
  //     }
      
  //     const containerContent = content.articleContents.slice(contentIndex, contentIndex + contentCount);
  //     contentIndex += contentCount;
      
  //     containers.push({
  //       image,
  //       content: containerContent,
  //       imageIndex
  //     });
  //   }
    
  //   return containers;
  // };

  // const containers = calculateContentDistribution();

  // if (!content) {
  //   return (
  //     <div className="text-center py-8">
  //       <p className="text-red-600">Content not available in this language</p>
  //     </div>
  //   );
  // }
  
  return (
    <div>
      <h1>Article client</h1>
    </div>
    // <div className="flex flex-col min-h-screen gap-8 md:gap-16">
    //   {/* Article Header */}
    //   <header className="text-center py-8">
    //     <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
    //       {content.mainTitle}
    //     </h1>
    //     <div className="flex items-center justify-center text-sm text-gray-600 mb-4 space-x-4">
    //       <span>Category: {article.category}</span>
    //       <span>Published: {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : ''}</span>
    //     </div>
        
    //     {/* Like Button at Top */}
    //     <div className="flex justify-center mb-6">
    //       <button
    //         onClick={handleLike}
    //         className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200 ${
    //           isLiked 
    //             ? 'bg-red-500 text-white shadow-lg scale-105' 
    //             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    //         }`}
    //       >
    //         <span className="text-2xl">❤️</span>
    //         <span className="font-semibold">{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
    //       </button>
    //     </div>
    //   </header>

    //   {/* Article Content in 4 Containers */}
    //   <div className="space-y-12">
    //     {containers.map((container, containerIndex) => (
    //       <div key={containerIndex} className="bg-white rounded-2xl shadow-lg overflow-hidden">
    //         {/* Container Image */}
    //         {container.image && (
    //           <div className="relative w-full h-64 md:h-80">
    //             <Image
    //               src={container.image}
    //               alt={`${content.mainTitle} - Section ${containerIndex + 1}`}
    //               fill
    //               className="object-cover"
    //               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
    //             />
    //           </div>
    //         )}
            
    //         {/* Container Content */}
    //         <div className="p-6 md:p-8">
    //           {container.content.map((section, sectionIndex) => (
    //             <section key={sectionIndex} className="mb-8 last:mb-0">
    //               <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
    //                 {section.subTitle}
    //               </h2>
    //               <div className="space-y-4">
    //                 {section.articleParagraphs.map((paragraph, pIndex) => (
    //                   <p key={pIndex} className="text-gray-700 text-lg leading-relaxed">
    //                     {paragraph}
    //                   </p>
    //                 ))}
    //               </div>
    //             </section>
    //           ))}
    //         </div>
    //       </div>
    //     ))}
    //   </div>

    //   {/* Like Button at Bottom */}
    //   <div className="flex justify-center py-8">
    //     <button
    //       onClick={handleLike}
    //       className={`flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-200 ${
    //         isLiked 
    //           ? 'bg-red-500 text-white shadow-lg scale-105' 
    //           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    //       }`}
    //     >
    //       <span className="text-3xl">❤️</span>
    //       <span className="font-semibold text-lg">{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
    //     </button>
    //   </div>

    //   {/* Comments Section */}
    //   <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
    //     <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Comments</h3>
        
    //     {/* Comment Form - Only for logged in users */}
    //     {session?.user?.id && (
    //       <form onSubmit={handleComment} className="mb-8">
    //         <div className="flex gap-4">
    //           <input
    //             type="text"
    //             value={newComment}
    //             onChange={(e) => setNewComment(e.target.value)}
    //             placeholder="Share your thoughts..."
    //             className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
    //             maxLength={600}
    //             disabled={isSubmitting}
    //           />
    //           <button
    //             type="submit"
    //             disabled={!newComment.trim() || isSubmitting}
    //             className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    //           >
    //             {isSubmitting ? 'Posting...' : 'Post Comment'}
    //           </button>
    //         </div>
    //       </form>
    //     )}

    //     {/* Comments List */}
    //     <div className="space-y-4">
    //       {comments.length === 0 ? (
    //         <p className="text-gray-500 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
    //       ) : (
    //         comments.map((comment, index) => (
    //           <div key={index} className="border border-gray-200 rounded-lg p-4">
    //             <div className="flex items-start justify-between mb-2">
    //               <div className="flex items-center gap-2">
    //                 <span className="font-semibold text-gray-800">User</span>
    //                 <span className="text-sm text-gray-500">
    //                   {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
    //                 </span>
    //               </div>
    //             </div>
                
    //             <p className="text-gray-700">{comment.comment}</p>
    //           </div>
    //         ))
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
}
