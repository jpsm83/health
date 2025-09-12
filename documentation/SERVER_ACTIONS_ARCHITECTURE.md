# Server Actions Architecture

This document explains the comprehensive Next.js architecture where all database logic is handled by server actions that can be used by both server components and API routes, with a focus on the articles system implementation.

## Overview

The architecture follows this pattern:
1. **Server Actions** (`app/actions/`) - Handle all database operations
2. **API Routes** (`app/api/`) - Import and use server actions for third-party access
3. **Server Components** - Can directly import and use server actions
4. **Client Components** - Receive serialized data from server components

## Articles System Implementation

### Server Actions Structure
```
app/actions/article/
├── getArticles.ts                    # General article fetching
├── getArticleBySlug.ts              # Single article by slug
├── getArticlesByCategory.ts         # Category articles (non-paginated)
├── getArticlesByCategoryPaginated.ts # Category articles (paginated)
├── searchArticlesPaginated.ts       # Search with pagination
└── toggleArticleLike.ts                  # Article like functionality
```

### API Routes Structure
```
app/api/v1/
├── articles/
│   ├── route.ts                     # Main articles endpoint
│   ├── paginated/route.ts          # Dedicated pagination endpoint
│   └── [slug]/route.ts             # Single article endpoint
└── likes/
    └── articles/
        └── [articleId]/route.ts     # Article likes endpoint
```

## Benefits

- **DRY Principle**: Database logic is written once and reused
- **Type Safety**: Shared interfaces ensure consistency
- **Maintainability**: Changes to database logic only need to be made in one place
- **Flexibility**: Same logic works for both internal and external API access
- **Performance**: Optimized queries and serialization
- **Scalability**: Handles both small and large datasets efficiently
- **Consistency**: Uniform response format across all endpoints

## Implementation Examples

### 1. General Article Fetching

#### Server Action (`app/actions/article/getArticles.ts`)
```typescript
"use server";

export async function getArticles(
  params: IGetArticlesParams = {}
): Promise<IPaginatedResponse<ISerializedArticle>> {
  const { page = 1, limit = 6, locale = 'en', ...filters } = params;
  
  await connectDb();
  
  // Build MongoDB filter
  const mongoFilter = buildFilter(filters);
  
  // Query with pagination
  const articles = await Article.find(mongoFilter)
    .populate({ path: "createdBy", select: "username" })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  
  // Apply locale filtering and serialization
  const serializedArticles = articles
    .map(applyLocaleFilter)
    .map(serializeMongoObject);
  
  return {
    page,
    limit,
    totalDocs: await Article.countDocuments(mongoFilter),
    totalPages: Math.ceil(totalDocs / limit),
    data: serializedArticles
  };
}
```

#### API Route (`app/api/v1/articles/route.ts`)
```typescript
import { getArticles, getArticlesByCategoryPaginated, searchArticlesPaginated } from "@/app/actions/article/...";

export const GET = async (req: Request) => {
  const params = parseQueryParams(req);
  
  let result;
  
  // Smart routing based on parameters
  if (params.query?.trim()) {
    result = await searchArticlesPaginated(params);
  } else if (params.category) {
    result = await getArticlesByCategoryPaginated(params);
  } else {
    result = await getArticles(params);
  }
  
  return NextResponse.json(result);
};
```

#### Server Component Usage
```typescript
import { getArticles } from "@/app/actions/article/getArticles";

export default async function HomePage() {
  const articlesResponse = await getArticles({ 
    page: 1, 
    limit: 6, 
    locale: 'en' 
  });
  
  return (
    <div>
      <FeaturedArticles articles={articlesResponse.data} />
    </div>
  );
}
```

### 2. Search with Pagination

#### Server Action (`app/actions/article/searchArticlesPaginated.ts`)
```typescript
"use server";

export async function searchArticlesPaginated(
  params: IGetArticlesParams & { query: string }
): Promise<IPaginatedResponse<ISerializedArticle>> {
  // Fetch all articles matching search
  const allArticles = await Article.find({
    "contentsByLanguage": { 
      $elemMatch: { 
        mainTitle: { $regex: params.query, $options: "i" } 
      } 
    }
  }).lean();
  
  // Apply locale filtering to all articles
  const filteredArticles = allArticles
    .map(applyLocaleFilter)
    .filter(hasContent);
  
  // Apply pagination after filtering
  const skip = (params.page - 1) * params.limit;
  const paginatedArticles = filteredArticles.slice(skip, skip + params.limit);
  
  return {
    page: params.page,
    limit: params.limit,
    totalDocs: filteredArticles.length,
    totalPages: Math.ceil(filteredArticles.length / params.limit),
    data: paginatedArticles.map(serializeMongoObject)
  };
}
```

### 3. Article Likes

#### Server Action (`app/actions/article/toggleArticleLike.ts`)
```typescript
"use server";

export async function toggleArticleLike(
  articleId: string, 
  userId: string
): Promise<LikeResponse> {
  await connectDb();
  
  const article = await Article.findById(articleId);
  if (!article) {
    return { success: false, error: "Article not found" };
  }
  
  const userLiked = article.likes?.includes(userId);
  
  const updatedArticle = await Article.findByIdAndUpdate(
    articleId,
    userLiked 
      ? { $pull: { likes: userId } }
      : { $addToSet: { likes: userId } },
    { new: true }
  );
  
  return {
    success: true,
    liked: !userLiked,
    likeCount: updatedArticle.likes?.length || 0,
    message: userLiked ? "Article unliked" : "Article liked"
  };
}
```

#### API Route (`app/api/v1/likes/articles/[articleId]/route.ts`)
```typescript
export const POST = async (req: Request, { params }: { params: { articleId: string } }) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const result = await toggleArticleLike(params.articleId, session.user.id);
  
  return NextResponse.json(result);
};
```

## Key Features

### 1. Consistent Response Format

Both server actions and API routes return the same data structure:

```typescript
interface IPaginatedResponse<T> {
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
  data: T[];
}

interface ISerializedArticle {
  _id: string;
  category: string;
  likes: string[];
  contentsByLanguage: ISerializedArticleContent[];
  createdBy: {
    _id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

### 2. Smart Routing

API routes intelligently select the appropriate server action:

```typescript
// Smart routing logic
if (query && query.trim()) {
  result = await searchArticlesPaginated(params);
} else if (category) {
  result = await getArticlesByCategoryPaginated(params);
} else {
  result = await getArticles(params);
}
```

### 3. Pagination Strategies

Different pagination strategies optimized for different use cases:

- **Normal Pagination**: MongoDB `.skip()` and `.limit()` for simple queries
- **Fetch All Then Paginate**: For complex filtering scenarios (search)
- **ExcludeIds Support**: For complex layouts with featured articles

### 4. Error Handling

- Server actions return empty responses instead of throwing errors
- API routes handle HTTP status codes appropriately
- Consistent error messages across both interfaces
- Graceful degradation for missing data

### 5. Type Safety

- Shared interfaces ensure consistency across the application
- TypeScript provides compile-time safety
- Serialized data types prevent runtime errors

### 6. Performance Optimization

- Efficient MongoDB queries with proper indexing
- Lean queries for better performance
- Population only when needed
- Optimized serialization process

## Data Flow Patterns

### 1. Server Component Flow
```
User Request → Server Component → Server Action → Database → Serialization → Client Component
```

### 2. API Route Flow
```
Third-party Request → API Route → Server Action → Database → Serialization → JSON Response
```

### 3. Mixed Flow (Server + API)
```
User Request → Server Component → Server Action → Database
Third-party Request → API Route → Same Server Action → Same Database
```

## Migration Strategy

When migrating existing API routes to use server actions:

1. **Extract Logic**: Move database logic from API route to server action
2. **Update Response Format**: Ensure server action returns consistent format
3. **Update API Route**: Replace logic with server action call
4. **Test Both Interfaces**: Verify both server action and API route work correctly
5. **Update Components**: Update server components to use server actions directly
6. **Handle Type Changes**: Update all components to use serialized types
7. **Test Pagination**: Ensure pagination works correctly across all interfaces

## Best Practices

1. **Keep Server Actions Pure**: Don't include HTTP-specific logic in server actions
2. **Use Shared Interfaces**: Define interfaces in shared locations
3. **Handle Errors Gracefully**: Return appropriate responses instead of throwing
4. **Document Parameters**: Clearly document what parameters each action accepts
5. **Test Both Paths**: Always test both server action and API route functionality
6. **Choose Right Pagination Strategy**: Use appropriate pagination method for each use case
7. **Optimize Queries**: Use lean queries and proper indexing
8. **Handle Serialization**: Ensure all MongoDB objects are properly serialized
9. **Validate Inputs**: Validate parameters in server actions
10. **Use TypeScript**: Leverage TypeScript for type safety

## Troubleshooting

### Common Issues

1. **Type Errors**: Ensure all components use `ISerializedArticle` instead of `IArticle`
2. **Pagination Duplicates**: Check if using correct pagination strategy
3. **Serialization Issues**: Verify `serializeMongoObject` is used consistently
4. **Performance Issues**: Check database queries and indexing
5. **API Errors**: Verify parameter validation and error handling

### Debug Tips

1. Check server action return values
2. Verify API route parameter parsing
3. Test with different locales
4. Check MongoDB query performance
5. Verify serialization is working correctly
6. Test pagination across different scenarios

## File Structure

```
app/
├── actions/           # Server actions (database logic)
│   └── article/
│       ├── getArticles.ts
│       ├── getArticleBySlug.ts
│       └── ...
├── api/              # API routes (HTTP endpoints)
│   └── v1/
│       └── articles/
│           └── route.ts
└── [locale]/         # Server components (can use server actions directly)
    └── page.tsx
```

This architecture provides a clean separation of concerns while maintaining flexibility and reusability.
