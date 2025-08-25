'use client';

import { useState } from 'react';
import { IArticle } from '@/interfaces/article';
import Image from 'next/image';

export default function ArticlePageClient({ 
  article, 
  locale 
}: { 
  article: IArticle;
  locale: string;
}) {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');
  
  // Get the content for the current locale
  const content = article.contentsByLanguage.find(
    (content) => content.seo.hreflang === locale
  );
  
  const handleLike = () => {
    setLikes(prev => prev + 1);
    // Here you would typically make an API call to update likes in the database
  };
  
  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments(prev => [...prev, newComment]);
      setNewComment('');
      // Here you would typically make an API call to save the comment
    }
  };
  
  if (!content) {
    return (
      <>
        <div className="text-center py-8">
          <p className="text-red-600">Content not available in this language</p>
        </div>
      </>
    );
  }
  
  return (
    <>
      <article className="prose prose-lg max-w-none">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {content.mainTitle}
          </h1>
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <span className="mr-4">Category: {article.category}</span>
            <span>Published: {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : ''}</span>
          </div>
        </header>
        
        {/* Images are at article level, not content level */}
        {article.articleImages && article.articleImages.length > 0 && (
          <div className="mb-8">
            <Image 
              src={article.articleImages[0]} 
              alt={content.mainTitle}
              priority
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="space-y-6 mb-8">
          {content.articleContents.map((section, index) => (
            <section key={index}>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {section.subTitle}
              </h2>
              {section.articleParagraphs.map((paragraph, pIndex) => (
                <p key={pIndex} className="text-gray-700 mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
        
        {/* Interactive Elements */}
        <div className="border-t pt-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <span>👍</span>
              <span>{likes} Likes</span>
            </button>
          </div>
          
          {/* Comments Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Comments</h3>
            
            <form onSubmit={handleComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Comment
              </button>
            </form>
            
            <div className="space-y-2">
              {comments.map((comment, index) => (
                <div key={index} className="p-3 bg-gray-100 rounded-lg">
                  <p className="text-gray-800">{comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}