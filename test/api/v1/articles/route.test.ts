import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock all dependencies before importing
vi.mock('next/server', () => ({
  NextResponse: class {
    constructor(body?: BodyInit | null, init?: ResponseInit) {
      return new Response(body, init)
    }
    
    static json(data: unknown, init?: ResponseInit) {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      })
    }
  },
}))

vi.mock('next-auth', () => ({
  default: vi.fn(),
}))

vi.mock('@/app/api/v1/auth/[...nextauth]/route', () => ({
  auth: vi.fn(),
}))

vi.mock('@/app/api/db/connectDb', () => ({
  default: vi.fn(),
}))

vi.mock('@/lib/cloudinary/uploadFilesCloudinary', () => ({
  default: vi.fn(),
}))

vi.mock('@/lib/utils/objDefaultValidation', () => ({
  default: vi.fn(),
}))

vi.mock('@/lib/constants', () => ({
  mainCategories: ['health', 'fitness', 'nutrition', 'intimacy', 'beauty', 'fashion', 'lifestyle', 'travel', 'decor', 'productivity', 'parenting'],
  articleStatus: ['published', 'archived'],
}))

vi.mock('@/app/api/models/article', () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
  },
}))

vi.mock('mongoose', () => ({
  default: {
    Types: {
      ObjectId: vi.fn(() => 'mock-object-id'),
    },
  },
}))

vi.mock('@/app/api/utils/handleApiError', () => ({
  handleApiError: vi.fn((message: string, error: string) => {
    return new Response(JSON.stringify({ message, error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
}))

// Set environment variables
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.NEXTAUTH_URL = 'http://localhost:3000'

// Import after mocking
import { POST } from '@/app/api/v1/articles/route'
import { auth } from '@/app/api/v1/auth/[...nextauth]/route'
import connectDb from '@/app/api/db/connectDb'
import uploadFilesCloudinary from '@/lib/cloudinary/uploadFilesCloudinary'
import objDefaultValidation from '@/lib/utils/objDefaultValidation'
import Article from '@/app/api/models/article'
import { handleApiError } from '@/app/api/utils/handleApiError'

// Test helpers
const mockSession = {
  user: {
    id: 'mock-user-id',
    email: 'test@example.com',
    username: 'testuser',
  },
}

const mockArticleData = {
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

const createMockFile = (name: string, type: string, content: string = 'test content') => {
  const file = new File([content], name, { type })
  return file
}

const createMockFormData = (articleData: Record<string, unknown>, files: File[] = []) => {
  const formData = new FormData()
  formData.append('category', articleData.category as string)
  formData.append('languages', JSON.stringify(articleData.languages))
  formData.append('imagesContext', JSON.stringify(articleData.imagesContext))
  
  files.forEach(file => {
    formData.append('articleImages', file)
  })
  
  return formData
}

const createMockRequest = (formData: FormData) => {
  return {
    formData: vi.fn().mockResolvedValue(formData),
  } as unknown as Request
}

describe('POST /api/v1/articles - Final Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default successful mocks
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(auth).mockResolvedValue(mockSession as unknown as any)
    vi.mocked(connectDb).mockResolvedValue(undefined)
    vi.mocked(objDefaultValidation).mockReturnValue(true)
    vi.mocked(Article.findOne).mockResolvedValue(null)
    vi.mocked(Article.create).mockResolvedValue({
      _id: 'mock-article-id',
      ...mockArticleData,
      articleImages: ['https://res.cloudinary.com/test/image/upload/v1234567890/test-image-1.jpg'],
      createdBy: 'mock-user-id',
      status: 'published',
      likes: [],
      commentsCount: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as unknown as any)
    vi.mocked(uploadFilesCloudinary).mockResolvedValue(['https://res.cloudinary.com/test/image/upload/v1234567890/test-image-1.jpg'])
  })

  describe('Authentication', () => {
    it('should return 401 when user is not authenticated', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(auth).mockResolvedValue(null as unknown as any)

      const formData = createMockFormData(mockArticleData, [
        createMockFile('test1.jpg', 'image/jpeg'),
      ])
      const request = createMockRequest(formData)

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.message).toBe('You must be signed in to create an article')
    })

    it('should proceed when user is authenticated', async () => {
      const formData = createMockFormData(mockArticleData, [
        createMockFile('test1.jpg', 'image/jpeg'),
      ])
      const request = createMockRequest(formData)

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.message).toBe('Article created successfully!')
    })
  })

  describe('Input Validation', () => {
    it('should return 400 when category is missing', async () => {
      const invalidData = { ...mockArticleData, category: '' }
      const formData = createMockFormData(invalidData, [
        createMockFile('test1.jpg', 'image/jpeg'),
      ])
      const request = createMockRequest(formData)

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toBe('Category, languages, and imagesContext are required!')
    })

    it('should return 400 when languages is missing', async () => {
      const formData = new FormData()
      formData.append('category', 'health')
      formData.append('imagesContext', JSON.stringify(mockArticleData.imagesContext))
      formData.append('articleImages', createMockFile('test1.jpg', 'image/jpeg'))

      const request = createMockRequest(formData)

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toBe('Category, languages, and imagesContext are required!')
    })

    it('should return 400 when category is invalid', async () => {
      const invalidData = { ...mockArticleData, category: 'invalid-category' }
      const formData = createMockFormData(invalidData, [
        createMockFile('test1.jpg', 'image/jpeg'),
      ])
      const request = createMockRequest(formData)

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toBe('Invalid category!')
    })
  })

  describe('File Validation', () => {
    it('should return 400 when no image files are provided', async () => {
      const formData = createMockFormData(mockArticleData, [])
      const request = createMockRequest(formData)

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toBe('No image files found or the number of image files does not match the number of article contents!')
    })

    it('should return 400 when number of images does not match content length', async () => {
      const formData = createMockFormData(mockArticleData, [
        createMockFile('test1.jpg', 'image/jpeg'),
        createMockFile('test2.jpg', 'image/jpeg'),
        createMockFile('test3.jpg', 'image/jpeg'), // Extra image
      ])
      const request = createMockRequest(formData)

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toBe('No image files found or the number of image files does not match the number of article contents!')
    })
  })

  describe('Database Operations', () => {
    it('should return 400 when article with same slug already exists', async () => {
      vi.mocked(Article.findOne).mockResolvedValue({ _id: 'existing-article' })

      const formData = createMockFormData(mockArticleData, [
        createMockFile('test1.jpg', 'image/jpeg'),
      ])
      const request = createMockRequest(formData)

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toBe('Article with slug(s) already exists: test-article-slug')
    })

    it('should create article successfully with valid data', async () => {
      const formData = createMockFormData(mockArticleData, [
        createMockFile('test1.jpg', 'image/jpeg'),
      ])
      const request = createMockRequest(formData)

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.message).toBe('Article created successfully!')
      expect(Article.create).toHaveBeenCalled()
    })
  })

  describe('Cloudinary Integration', () => {
    it('should upload images to Cloudinary with correct parameters', async () => {
      const formData = createMockFormData(mockArticleData, [
        createMockFile('test1.jpg', 'image/jpeg'),
      ])
      const request = createMockRequest(formData)

      await POST(request)

      expect(uploadFilesCloudinary).toHaveBeenCalledWith({
        folder: expect.stringContaining('/health/'),
        filesArr: expect.any(Array),
        onlyImages: true,
      })
    })

    it('should return 500 when Cloudinary upload fails', async () => {
      vi.mocked(uploadFilesCloudinary).mockResolvedValue('upload failed')

      const formData = createMockFormData(mockArticleData, [
        createMockFile('test1.jpg', 'image/jpeg'),
      ])
      const request = createMockRequest(formData)

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.message).toBe('Error uploading image: upload failed')
    })
  })

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      vi.mocked(connectDb).mockRejectedValue(new Error('Database connection failed'))

      const formData = createMockFormData(mockArticleData, [
        createMockFile('test1.jpg', 'image/jpeg'),
      ])
      const request = createMockRequest(formData)

      await POST(request)

      expect(handleApiError).toHaveBeenCalledWith('Create article failed!', expect.any(Error))
    })

    it('should handle article creation errors', async () => {
      vi.mocked(Article.create).mockRejectedValue(new Error('Database save failed'))

      const formData = createMockFormData(mockArticleData, [
        createMockFile('test1.jpg', 'image/jpeg'),
      ])
      const request = createMockRequest(formData)

      await POST(request)

      expect(handleApiError).toHaveBeenCalledWith('Create article failed!', expect.any(Error))
    })
  })
})
