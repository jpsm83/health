# Smoke Test Checklist

This checklist verifies that all migrated domains work correctly after the service-oriented architecture refactor.

## Test Instructions

Run through each domain's key flows to ensure:
- API routes return correct responses
- Server actions work correctly
- Services handle DB operations properly
- No regressions in existing functionality

---

## 1. Articles Domain ✅

### Read Operations
- [ ] GET `/api/v1/articles` - Returns paginated articles
- [ ] GET `/api/v1/articles/paginated` - Returns paginated articles with search
- [ ] GET `/api/v1/articles/by-slug/[slug]` - Returns single article
- [ ] GET `/api/v1/articles/by-id/[articleId]` - Returns article by ID
- [ ] GET `/api/v1/articles/dashboard` - Returns dashboard articles
- [ ] GET `/api/v1/articles/stats` - Returns article statistics
- [ ] Server action `getArticles()` - Works from server components
- [ ] Server action `getArticleBySlug()` - Works from server components

### Mutations
- [ ] POST `/api/v1/articles/by-id/[articleId]/views` - Increments views
- [ ] POST `/api/v1/articles/by-id/[articleId]/likes` - Toggles like
- [ ] Server action `incrementArticleViews()` - Works correctly
- [ ] Server action `toggleArticleLike()` - Works correctly

### Complex Operations
- [ ] PATCH `/api/v1/articles/by-id/[articleId]` - Updates article (file uploads work)
- [ ] DELETE `/api/v1/articles/by-id/[articleId]` - Deletes article (Cloudinary cleanup works)
- [ ] Server action `updateArticle()` - Calls route correctly
- [ ] Server action `deleteArticle()` - Calls route correctly

---

## 2. Comments Domain ✅

### CRUD Operations
- [ ] POST `/api/v1/comments` - Creates comment
- [ ] GET `/api/v1/comments/by-article/[articleId]` - Gets comments by article
- [ ] DELETE `/api/v1/comments/[commentId]` - Deletes comment
- [ ] Server action `createComment()` - Works correctly
- [ ] Server action `getComments()` - Works correctly
- [ ] Server action `deleteComment()` - Works correctly

### Interactions
- [ ] POST `/api/v1/comments/[commentId]/likes` - Toggles comment like
- [ ] POST `/api/v1/comments/[commentId]/reports` - Reports comment
- [ ] Server action `toggleCommentLike()` - Works correctly
- [ ] Server action `reportComment()` - Works correctly

---

## 3. Users Domain ✅

### Read Operations
- [ ] GET `/api/v1/users` - Returns all users
- [ ] GET `/api/v1/users/[userId]` - Returns user by ID
- [ ] GET `/api/v1/users/[userId]/liked-articles` - Returns user's liked articles
- [ ] Server action `getUsers()` - Works correctly
- [ ] Server action `getUserById()` - Works correctly
- [ ] Server action `getUserLikedArticles()` - Works correctly

### Mutations
- [ ] POST `/api/v1/users` - Creates user (file upload, transaction, email work)
- [ ] PATCH `/api/v1/users/[userId]` - Updates user (file upload, Cloudinary work)
- [ ] DELETE `/api/v1/users/[userId]` - Deactivates user
- [ ] Server action `createUser()` - Calls route correctly
- [ ] Server action `updateUser()` - Calls route correctly
- [ ] Server action `deleteUser()` - Works correctly

---

## 4. Subscribers & Newsletter Domain ✅

### Subscriber Operations
- [ ] GET `/api/v1/subscribers` - Returns all subscribers
- [ ] GET `/api/v1/subscribers/[subscriberId]` - Returns subscriber by ID
- [ ] POST `/api/v1/subscribers` - Subscribes to newsletter (email sending works)
- [ ] DELETE `/api/v1/subscribers` - Unsubscribes from newsletter
- [ ] POST `/api/v1/subscribers/confirm-newsletter-subscription` - Confirms subscription
- [ ] PATCH `/api/v1/subscribers/[subscriberId]` - Updates preferences
- [ ] Server action `getSubscribers()` - Works correctly
- [ ] Server action `newsletterSubscribe()` - Calls route correctly
- [ ] Server action `confirmNewsletterSubscription()` - Works correctly

### Newsletter Operations
- [ ] POST `/api/v1/newsletter/send-newsletter` - Sends newsletter (email sending works)
- [ ] Server action `sendNewsletter()` - Calls route correctly

---

## 5. Auth Domain ✅

### Email Confirmation
- [ ] POST `/api/v1/auth/request-email-confirmation` - Requests confirmation (email sending works)
- [ ] POST `/api/v1/auth/confirm-email` - Confirms email (transaction works)
- [ ] Server action `requestEmailConfirmation()` - Calls route correctly
- [ ] Server action `confirmEmail()` - Works correctly

### Password Reset
- [ ] POST `/api/v1/auth/request-password-reset` - Requests reset (email sending works)
- [ ] POST `/api/v1/auth/reset-password` - Resets password (hashing works)
- [ ] Server action `requestPasswordReset()` - Calls route correctly
- [ ] Server action `resetPassword()` - Works correctly

---

## 6. Upload Domain ✅

### Image Upload
- [ ] POST `/api/v1/upload/image` - Uploads image (Cloudinary + DB update work)
- [ ] Authorization check works (session or API key)
- [ ] Article image array updated correctly

---

## Verification Points

### Service Layer
- [ ] All services throw `Error` with descriptive messages
- [ ] All services use `connectDb()` internally
- [ ] All services return serialized data
- [ ] Services reuse shared helpers (`fieldProjections`, `serializeMongoObject`)

### API Routes
- [ ] All routes use `handleApiError` for error wrapping
- [ ] All routes call services (no direct DB queries)
- [ ] Routes handle file uploads/Cloudinary before calling services
- [ ] Routes handle email sending after calling services

### Server Actions
- [ ] Actions that need email/file operations call routes via `fetch`
- [ ] Actions that only need DB operations call services directly
- [ ] No `internalFetch` usage (except deferred complex operations)

---

## Performance Checks

- [ ] Home page loads progressively (Suspense sections stream)
- [ ] No blocking delays on initial page load
- [ ] API responses are fast (no unnecessary HTTP hops)
- [ ] Database queries are optimized (lean queries, proper projections)

---

## Notes

- Test with different locales (en, pt, es, fr, de, it)
- Test with authenticated and unauthenticated users
- Test with API keys where applicable
- Verify error handling works correctly
- Check that serialization prevents MongoDB object issues

