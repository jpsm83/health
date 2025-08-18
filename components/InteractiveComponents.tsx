// components/InteractiveComponents.tsx
'use client';

import { useFetch } from '@/hooks/useFetch';

interface Comment {
  _id: string;
  comment: string;
}

export function InteractiveComponents({ articleId }: { articleId: string }) {
  // Only fetch interactive data (likes, comments) on client-side
  const { data: socialData } = useFetch(() => 
    fetch(`/api/v1/articles/${articleId}/social`)
      .then(res => res.json())
  );

  const handleLike = async () => {
    // Handle like functionality
  };

  return (
    <div>
      <button onClick={handleLike}>
        Like ({socialData?.likes?.length || 0})
      </button>
      
      <div>
        <h3>Comments</h3>
        {socialData?.comments?.map((comment: Comment) => (
          <div key={comment._id}>{comment.comment}</div>
        ))}
      </div>
    </div>
  );
}