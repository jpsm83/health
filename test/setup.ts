import { vi } from 'vitest'

// Mock Next.js modules
vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: ResponseInit) => {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      })
    },
  },
}))

// Mock NextAuth - more comprehensive mock
vi.mock('next-auth', () => ({
  default: vi.fn(),
}))

vi.mock('@/app/api/v1/auth/[...nextauth]/route', () => ({
  auth: vi.fn(),
}))

// Mock database connection
vi.mock('@/app/api/db/connectDb', () => ({
  default: vi.fn(),
}))

// Mock Cloudinary upload
vi.mock('@/lib/cloudinary/uploadFilesCloudinary', () => ({
  default: vi.fn(),
}))

// Mock validation utility
vi.mock('@/lib/utils/objDefaultValidation', () => ({
  default: vi.fn(),
}))

// Mock constants
vi.mock('@/lib/constants', () => ({
  mainCategories: ['health', 'fitness', 'nutrition', 'intimacy', 'beauty', 'travel', 'decor'],
  articleStatus: ['published', 'archived'],
}))

// Mock Article model
vi.mock('@/app/api/models/article', () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
  },
}))

// Mock mongoose
vi.mock('mongoose', () => ({
  default: {
    Types: {
      ObjectId: vi.fn(() => 'mock-object-id'),
    },
  },
}))

// Mock error handler
vi.mock('@/app/api/utils/handleApiError', () => ({
  handleApiError: vi.fn((message: string, error: string) => {
    return new Response(JSON.stringify({ message, error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
}))

// Mock Next.js specific modules that might cause issues
vi.mock('next', () => ({
  default: {},
}))

// Set up environment variables
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.NEXTAUTH_URL = 'http://localhost:3000'
