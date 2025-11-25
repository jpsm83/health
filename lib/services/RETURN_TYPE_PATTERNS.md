# Service Return Type Patterns

This document describes the current return type patterns used across services for consistency and reference.

## Patterns by Use Case

### 1. Get Single Item (by ID/Slug)

**Pattern**: Return `T | null` if not found

**Examples**:
- `getUserByIdService(userId): Promise<ISerializedUser | null>`
- `getArticleBySlugService(slug): Promise<ISerializedArticle | null>`
- `getArticleByIdService(articleId): Promise<ISerializedArticle | null>`
- `getSubscriberByIdService(subscriberId): Promise<ISerializedSubscriber | null>`

**Rationale**: 
- `null` indicates "not found" - a valid state
- Caller can check for `null` and handle appropriately
- Throwing would be too aggressive for a "not found" scenario

### 2. Get Multiple Items (List/Array)

**Pattern**: Return empty array `[]` if no results

**Examples**:
- `getUsersService(): Promise<ISerializedUser[]>` - returns `[]` if no users
- `getSubscribersService(): Promise<ISerializedSubscriber[]>` - returns `[]` if no subscribers
- `getAllArticlesForDashboardService(): Promise<ISerializedArticle[]>` - returns `[]` if no articles

**Rationale**:
- Empty array is a valid result (no items found)
- Consistent with array operations (map, filter, etc.)
- Caller can check `length === 0` if needed

### 3. Paginated Results

**Pattern**: Return pagination object with empty `data: []` array

**Examples**:
- `getArticlesService(): Promise<IPaginatedResponse<ISerializedArticle>>`
  ```typescript
  {
    page: 1,
    limit: 9,
    totalDocs: 0,
    totalPages: 0,
    data: []  // Empty array if no results
  }
  ```
- `getCommentsService(): Promise<GetCommentsResult>`
  ```typescript
  {
    comments: [],  // Empty array if no results
    totalCount: 0,
    hasMore: false,
    page: 1,
    limit: 10
  }
  ```

**Rationale**:
- Consistent structure regardless of results
- Caller always gets same shape
- Empty array in `data`/`comments` indicates no results

### 4. Create/Update Operations

**Pattern**: Return created/updated object

**Examples**:
- `createCommentService(): Promise<ISerializedComment>` - returns created comment
- `createUserService(): Promise<CreateUserServiceResult>` - returns `{ userId, subscriptionId }`
- `updateArticleService(): Promise<ISerializedArticle>` - returns updated article
- `updateUserService(): Promise<ISerializedUser>` - returns updated user

**Rationale**:
- Caller needs the created/updated data
- Useful for immediate use in response
- Throws error if creation/update fails

### 5. Delete Operations

**Pattern**: Return `void` (no return value)

**Examples**:
- `deleteArticleService(articleId): Promise<void>`
- `deleteCommentService(commentId, userId, isAdmin): Promise<void>`
- `deactivateUserService(userId): Promise<void>`

**Rationale**:
- Success = no error thrown
- Failure = throws error
- No data to return after deletion

### 6. Toggle/Increment Operations

**Pattern**: Return result object with status

**Examples**:
- `toggleArticleLikeService(): Promise<{ liked: boolean; likeCount: number }>`
- `toggleCommentLikeService(): Promise<{ liked: boolean; likeCount: number }>`
- `incrementArticleViewsService(): Promise<{ viewCount: number }>`

**Rationale**:
- Caller needs to know the new state
- Returns updated count/status
- Throws error if operation fails

### 7. Complex Operations with Side Data

**Pattern**: Return object with operation result + additional data

**Examples**:
- `reportCommentService(): Promise<ReportCommentResult>` - returns comment/author data for email
- `subscribeToNewsletterService(): Promise<SubscribeToNewsletterResult>` - returns `{ subscriber, isNew }`
- `uploadImageService(): Promise<UploadImageResult>` - returns `{ imageUrl, publicId, folder }`

**Rationale**:
- Operation needs to return multiple pieces of data
- Avoids redundant queries in routes
- Provides all needed data in one call

### 8. Auth Operations

**Pattern**: Return `void` or result object

**Examples**:
- `confirmEmailService(token): Promise<void>` - throws if invalid
- `resetPasswordService(token, newPassword): Promise<void>` - throws if invalid
- `requestEmailConfirmationService(email): Promise<RequestEmailConfirmationResult>` - returns user data + token

**Rationale**:
- Success = no error
- Failure = throws descriptive error
- Some operations return data needed for email sending

## Error Handling

**Consistent Pattern**: All services throw `Error` with descriptive messages

**Examples**:
- `throw new Error("User ID is required")`
- `throw new Error("Article not found")`
- `throw new Error("User with email already exists!")`

**Rationale**:
- Consistent error model across all services
- Routes wrap errors with `handleApiError`
- Actions can catch and format as needed

## Summary

| Operation Type | Return Type | Not Found Behavior |
|---------------|-------------|-------------------|
| Get Single | `T \| null` | Returns `null` |
| Get Multiple | `T[]` | Returns `[]` |
| Paginated | `{ data: T[], ... }` | Returns `{ data: [], ... }` |
| Create | `T` or `{ id, ... }` | Throws error |
| Update | `T` | Throws error |
| Delete | `void` | Throws error |
| Toggle/Increment | `{ status, count }` | Throws error |
| Complex | `{ result, ...data }` | Throws error |

## Notes

- **Consistency**: Patterns are consistent within each category
- **Flexibility**: Some variation is acceptable when it makes sense (e.g., auth operations)
- **Error Handling**: All services throw errors for failures, never return error objects
- **Null vs Empty**: Use `null` for single items, empty array for collections

