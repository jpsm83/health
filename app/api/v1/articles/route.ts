import { NextRequest, NextResponse } from 'next/server';
import Article from '@/app/api/models/article';
import connectDb from '@/app/api/db/connectDb';

export async function GET(
  request: NextRequest,
  { params }: { params: { lang: string, slug: string } }
) {
  try {
    await connectDb();
    
    const article = await Article.findOne({
      'content.language': params.lang,
      'content.seo.slug': params.slug
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: { articleId: string } }) {
  // Return likes and comments for the article
}

export async function POST(request: NextRequest, { params }: { params: { articleId: string } }) {
  // Handle like/comment actions
}
