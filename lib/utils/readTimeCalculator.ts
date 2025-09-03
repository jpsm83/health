// Calculate estimated reading time for an article
// Based on average reading speed of 200-250 words per minute
export function calculateReadTime(article: {
  contentsByLanguage: Array<{
    mainTitle: string;
    articleContents: Array<{
      subTitle: string;
      articleParagraphs: string[];
    }>;
  }>;
}): string {
  const averageWordsPerMinute = 225; // Average reading speed
  
  // Get the first language content (assuming single language for now)
  const content = article.contentsByLanguage[0];
  if (!content) return "1 min read";
  
  let totalWords = 0;
  
  // Count words in main title
  totalWords += content.mainTitle.split(/\s+/).length;
  
  // Count words in all article contents
  content.articleContents.forEach(articleContent => {
    // Count words in subtitle
    totalWords += articleContent.subTitle.split(/\s+/).length;
    
    // Count words in all paragraphs
    articleContent.articleParagraphs.forEach(paragraph => {
      totalWords += paragraph.split(/\s+/).length;
    });
  });
  
  // Calculate reading time in minutes
  const minutes = Math.ceil(totalWords / averageWordsPerMinute);
  
  // Return formatted string
  if (minutes === 1) {
    return "1 min read";
  } else if (minutes < 60) {
    return `${minutes} min read`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} hr read`;
    } else {
      return `${hours} hr ${remainingMinutes} min read`;
    }
  }
}

// Generate excerpt from article content
// Takes first paragraph and truncates to specified length
export function generateExcerpt(
  article: {
    contentsByLanguage: Array<{
      articleContents: Array<{
        articleParagraphs: string[];
      }>;
    }>;
  },
  maxLength: number = 120
): string {
  const content = article.contentsByLanguage[0];
  if (!content || !content.articleContents.length) {
    return "No content available";
  }
  
  // Get first paragraph from first article content
  const firstParagraph = content.articleContents[0]?.articleParagraphs[0];
  if (!firstParagraph) {
    return "No content available";
  }
  
  // Truncate if too long
  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }
  
  // Find last complete word within limit
  const truncated = firstParagraph.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + "...";
  }
  
  return truncated + "...";
}
