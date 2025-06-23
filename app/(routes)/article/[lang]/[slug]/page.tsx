import { generateDynamicMetadata } from '@/lib/utils/generateDynamicMetadata';
import Article from '@/app/api/models/article';
import connectDb from '@/app/api/db/connectDb';
import { InteractiveComponents } from '@/components/InteractiveComponents';

export { generateDynamicMetadata };

export default async function ArticlePage({ 
  params 
}: { 
  params: { lang: string, slug: string } 
}) {
  // Server-side data fetching
  await connectDb();
  
  const article = await Article.findOne({
    'content.language': params.lang,
    'content.seo.slug': params.slug
  });

  if (!article) {
    return <div>Article not found</div>;
  }

  const contentForLang = article.content.find(c => c.language === params.lang);
  if (!contentForLang) {
    return <div>Language not available</div>;
  }

  return (
    <article>
      <h1>{contentForLang.mainTitle}</h1>
      {/* Render static article content */}
      {contentForLang.content.map((section, index) => (
        <div key={index}>
          <h2>{section.subTitle}</h2>
          <img src={section.imageUrl} alt={section.subTitle} />
          {section.articleParagraphs.map((paragraph, pIndex) => (
            <p key={pIndex}>{paragraph}</p>
          ))}
        </div>
      ))}
      
      {/* Interactive components for likes/comments */}
      <InteractiveComponents articleId={article._id} />
    </article>
  );
}
