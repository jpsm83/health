# Pagination Implementation

## Overview

This document explains the pagination implementation for the articles category pages. The pagination is implemented using **server-side pagination** for better performance and SEO benefits.

## Architecture

### Server-Side Pagination
- **Why Server-Side**: Better performance, SEO-friendly URLs, direct page links work
- **URL Structure**: `/{locale}/{category}?page={pageNumber}`
- **Example**: `/en/nutrition?page=2`

### Components Involved

1. **Server Component**: `app/[locale]/[category]/page.tsx`
   - Fetches paginated data from API
   - Handles URL search parameters
   - Passes data to client component

2. **Client Component**: `pagesClient/Articles.tsx`
   - Renders articles and pagination controls
   - Uses shadcn/ui pagination component
   - Handles empty states

3. **API Service**: `services/articleService.ts`
   - Modified to return pagination metadata
   - Uses existing API endpoint with pagination support

## Implementation Details

### URL Parameters
- `page`: Current page number (default: 1)
- Invalid page numbers are handled gracefully
- Redirects to page 1 if page exceeds total pages

### Pagination Data Structure
```typescript
interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalArticles: number;
}
```

### API Response Structure
```typescript
interface IPaginatedResponse<T> {
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
  data: T[];
}
```

## Features

### Pagination Controls
- **Previous/Next Buttons**: Navigate between pages
- **Page Numbers**: Direct navigation to specific pages
- **Ellipsis**: Shows "..." for large page ranges
- **Smart Display**: Shows first, last, current, and adjacent pages

### Edge Cases Handled
- Empty articles array
- Invalid page numbers
- Page numbers exceeding total pages
- Single page scenarios (no pagination shown)

### User Experience
- **Pagination Info**: Shows current page and total articles
- **Responsive Design**: Works on all screen sizes
- **SEO-Friendly**: Each page has a unique URL
- **Loading States**: Handled by server-side rendering

## Usage

### Adding Pagination to Other Pages
1. Update the server component to accept `searchParams`
2. Fetch paginated data using `articleService.getArticlesByCategory()`
3. Pass pagination data to client component
4. Use the pagination component in the client

### Customizing Pagination
- **Articles per page**: Change `limit` in server component
- **Pagination styling**: Modify `components/ui/pagination.tsx`
- **Pagination logic**: Update pagination component in `Articles.tsx`

## Benefits

1. **Performance**: Only loads needed data
2. **SEO**: Each page is indexable
3. **User Experience**: Direct links to specific pages
4. **Scalability**: Handles large datasets efficiently
5. **Accessibility**: Proper ARIA labels and navigation

## Future Improvements

1. **Caching**: Add Redis caching for frequently accessed pages
2. **Infinite Scroll**: Alternative to pagination for mobile
3. **Filters**: Add category filters with pagination
4. **Search**: Integrate search with pagination
5. **Analytics**: Track pagination usage

## Testing

To test the pagination:
1. Navigate to any category page: `/{locale}/{category}`
2. Add `?page=2` to see second page
3. Try invalid page numbers to test error handling
4. Test with empty categories to see empty state
