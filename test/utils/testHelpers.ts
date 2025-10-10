import { vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock session data
export const mockSession = {
  user: {
    id: 'mock-user-id',
    email: 'test@example.com',
    username: 'testuser',
  },
}

// Mock article data
export const mockArticleData = {
  category: 'health',
  imagesContext: {
    imageOne: 'https://example.com/image1.jpg',
    imageTwo: 'https://example.com/image2.jpg',
    imageThree: 'https://example.com/image3.jpg',
    imageFour: 'https://example.com/image4.jpg',
  },
  languages: [
    {
      hreflang: 'en',
      mediaContext: {
        paragraphOne: 'Test paragraph one',
        paragraphTwo: 'Test paragraph two',
        paragraphThree: 'Test paragraph three',
      },
      seo: {
        metaTitle: 'Test Meta Title',
        metaDescription: 'Test meta description',
        keywords: ['test', 'health', 'article'],
        slug: 'test-article-slug',
        hreflang: 'en',
        urlPattern: 'articles',
        canonicalUrl: 'https://example.com/en/health/test-article-slug',
      },
      content: {
        mainTitle: 'Test Article Title',
        articleContents: [
          {
            subTitle: 'Test Subtitle',
            articleParagraphs: ['Test paragraph 1', 'Test paragraph 2'],
          },
        ],
      },
    },
  ],
}

// Mock file data
export const createMockFile = (name: string, type: string, content: string = 'test content') => {
  const file = new File([content], name, { type })
  return file
}

// Mock FormData
export const createMockFormData = (articleData: Record<string, unknown>, files: File[] = []) => {
  const formData = new FormData()
  formData.append('category', articleData.category as string)
  formData.append('languages', JSON.stringify(articleData.languages))
  formData.append('imagesContext', JSON.stringify(articleData.imagesContext))
  
  files.forEach(file => {
    formData.append('articleImages', file)
  })
  
  return formData
}

// Mock NextRequest
export const createMockRequest = (formData: FormData) => {
  return {
    formData: vi.fn().mockResolvedValue(formData),
  } as unknown as NextRequest
}

// Mock successful Cloudinary response
export const mockCloudinaryResponse = [
  'https://res.cloudinary.com/test/image/upload/v1234567890/test-image-1.jpg',
  'https://res.cloudinary.com/test/image/upload/v1234567890/test-image-2.jpg',
]

// Mock created article
export const mockCreatedArticle = {
  _id: 'mock-article-id',
  ...mockArticleData,
  articleImages: mockCloudinaryResponse,
  createdBy: 'mock-user-id',
  status: 'published',
  likes: [],
  commentsCount: 0,
  views: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Validation error messages
export const validationErrors = {
  missingCategory: 'Category, languages, and imagesContext are required!',
  invalidCategory: 'Invalid category!',
  invalidContentsArray: 'Languages must be a non-empty array!',
  missingMainTitle: 'mainTitle must have a value!',
  missingArticleContents: 'ArticleContents must be a non-empty array!',
  missingSubTitle: 'subTitle must have a value!',
  missingArticleParagraphs: 'ArticleParagraphs must be a non-empty array!',
  missingMetaTitle: 'metaTitle must have a value!',
  missingMetaDescription: 'metaDescription must have a value!',
  missingKeywords: 'keywords must have a value!',
  missingSlug: 'slug must have a value!',
  missingHreflang: 'hreflang must have a value!',
  missingUrlPattern: 'urlPattern must have a value!',
  missingCanonicalUrl: 'canonicalUrl must have a value!',
  unsupportedHreflang: 'Unsupported hreflang: invalid. Supported values: en, pt, es, fr, de, it, nl',
  invalidUrlPattern: 'Invalid URL pattern: invalid. Supported patterns: articles, artigos, articulos, artikel, articoli, artikelen',
  duplicateSlug: 'Article with slug(s) already exists: test-article-slug',
  noImages: 'No image files found or the number of image files does not match the number of article contents!',
  cloudinaryError: 'Error uploading image: upload failed',
}
