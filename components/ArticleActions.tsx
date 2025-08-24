'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface ArticleActionsProps {
  articleId: string;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
}

export default function ArticleActions({ 
  articleId, 
  likeCount, 
  commentCount, 
  isLiked = false 
}: ArticleActionsProps) {
  const { isAuthenticated, session } = useAuth();

  const handleLike = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await fetch(`/api/v1/test-actions/article-likes/${articleId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session?.user?.id }),
      });

      if (response.ok) {
        return;
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleComment = () => {
    if (!isAuthenticated) return;
  };

  return (
    <div className="flex items-center space-x-4 mt-4">
      {/* Like Button */}
      <button
        onClick={handleLike}
        disabled={!isAuthenticated}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
          isAuthenticated
            ? isLiked
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
        title={isAuthenticated ? 'Click to like/unlike' : 'Sign in to like articles'}
      >
        <svg 
          className={`w-5 h-5 ${isLiked ? 'fill-current' : 'stroke-current fill-none'}`} 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
        <span>{likeCount}</span>
      </button>

      {/* Comment Button */}
      <button
        onClick={handleComment}
        disabled={!isAuthenticated}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
          isAuthenticated
            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
        title={isAuthenticated ? 'Add a comment' : 'Sign in to comment'}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
          />
        </svg>
        <span>{commentCount}</span>
      </button>

      {/* Share Button (always available) */}
      <button className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" 
          />
        </svg>
        <span>Share</span>
      </button>

      {/* Authentication Prompt */}
      {!isAuthenticated && (
        <div className="ml-4 text-sm text-gray-500">
          <Link href="/signin" className="text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>{' '}
          to like and comment on articles
        </div>
      )}
    </div>
  );
}
