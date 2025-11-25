# Service-Oriented Refactor TODO

Objective: ensure every server action under `app/actions/**` and every API route under `app/api/v1/**` delegates business/data logic to a shared service layer in `lib/services/**`, mirroring the completed articles implementation. Avoid behavioural regressions—migrate by pure extraction/refactor.

---

## 0. Prep / Conventions ✅
- [x] Define `lib/services/README.md` summarizing service guidelines (pure functions, DB access, serialization, error model).
- [x] For each domain, place services in `lib/services/<domain>/` or `lib/services/<domain>.ts` (keep naming consistent).
- [x] Keep server actions returning current payload shapes.
- [x] Keep API routes as thin request/response wrappers; they parse/validate params, call service, return JSON.
- [x] Remove `internalFetch` usage once an action switches to services.

---

## 1. Articles Domain (baseline ✅)
Already complete: `lib/services/articles.ts`, `getArticles`, `/api/v1/articles`. Use as reference.
- [x] (Follow-up) Extend service to cover dashboard, stats, slug/id endpoints when refactoring below. (Will be done in Step 2)

---

## 2. Remaining Article Endpoints & Actions ✅
### API routes
- [x] `/api/v1/articles/paginated`
- [x] `/api/v1/articles/by-slug/[slug]`
- [x] `/api/v1/articles/by-id/[articleId]` (GET, PATCH, DELETE - all operations complete)
- [x] `/api/v1/articles/dashboard`
- [x] `/api/v1/articles/stats`
- [x] `/api/v1/articles/by-id/[articleId]/likes` (subroute)
- [x] `/api/v1/articles/by-id/[articleId]/views` (subroute)

### Server actions
- [x] `getArticlesByCategoryPaginated`
- [x] `getArticleBySlug`
- [x] `getAllArticlesForDashboard`
- [x] `searchArticlesPaginated`
- [x] `getWeeklyStats`
- [x] `incrementArticleViews`
- [x] `toggleArticleLike`
- [x] `deleteArticle`, `updateArticle` (call routes - routes handle file uploads/Cloudinary, then call services for DB)

### Tasks
1. Extract shared logic into `lib/services/articles.ts` (extend existing module).
2. Update actions/routes listed above to consume service functions.
3. Remove residual `internalFetch` usage in article actions.

---

## 3. Comments Domain ✅
### API routes
- [x] `/api/v1/comments/route.ts`
- [x] `/api/v1/comments/by-article/[articleId]`
- [x] `/api/v1/comments/[commentId]` (+ likes, reports subroutes)

### Server actions
- [x] `createComment`, `deleteComment`, `getComments`, `reportComment`, `toggleCommentLike`

### Tasks
- [x] Create `lib/services/comments.ts` (CRUD + likes/reports handling).
- [x] Refactor all comment actions/routes to call the service.

---

## 4. Users Domain ✅
### API routes
- [x] `/api/v1/users/route.ts` (GET, POST)
- [x] `/api/v1/users/[userId]` (GET, PATCH, DELETE)
- [x] `/api/v1/users/[userId]/liked-articles` (GET)
- [x] `/api/v1/users/comment-report` (email sending only - no DB logic, route calls action directly - acceptable)

### Server actions
- [x] `getUsers`, `getUserById`, `getUserLikedArticles`, `deleteUser`
- [x] `commentReport` (email sending only - no DB logic, acceptable as-is)
- [x] `createUser`, `updateUser`, `updateUserProfile` (call routes - routes handle file uploads/Cloudinary, then call services for DB)

### Tasks
- [x] Create `lib/services/users.ts` (read operations + deactivate + create + update).
- [x] Move DB logic for all operations from routes/actions to service.
- [x] Routes handle file uploads, Cloudinary, email sending; services handle DB operations.

---

## 5. Subscribers & Newsletter ✅
### API routes
- [x] `/api/v1/subscribers` (GET, POST, DELETE)
- [x] `/api/v1/subscribers/[subscriberId]` (GET, PATCH)
- [x] `/api/v1/subscribers/confirm-newsletter-subscription` (POST)
- [x] `/api/v1/subscribers/newsletter-subscribe` (wrapper - forwards to main route)
- [x] `/api/v1/subscribers/newsletter-unsubscribe` (wrapper - forwards to main route)
- [x] `/api/v1/newsletter/send-newsletter` (POST)

### Server actions
- [x] `getSubscribers`, `getSubscriberById`, `confirmNewsletterSubscription`, `updateSubscriberPreferences` (call services directly)
- [x] `newsletterSubscribe`, `newsletterUnsubscribe` (call routes via fetch - email sending handled at route level)
- [x] `sendNewsletter` (calls route - email orchestration at route level)

### Tasks
- [x] Create `lib/services/subscribers.ts` (CRUD + subscribe/unsubscribe/confirm).
- [x] Create `lib/services/newsletter.ts` (get subscribers for newsletter).
- [x] Email sending remains at route level (routes call services for DB, then handle email).

---

## 6. Auth Domain ✅
### API routes
- [x] `/api/v1/auth/request-email-confirmation` (POST)
- [x] `/api/v1/auth/confirm-email` (POST)
- [x] `/api/v1/auth/request-password-reset` (POST)
- [x] `/api/v1/auth/reset-password` (POST)
- [x] `/api/v1/auth/[...nextauth]` (NextAuth configuration - no service extraction needed, acceptable as-is)

### Server actions
- [x] `confirmEmail`, `resetPassword` (call services directly)
- [x] `requestEmailConfirmation`, `requestPasswordReset` (call routes via fetch - email sending handled at route level)

### Tasks
- [x] Create `lib/services/auth.ts` (token generation, DB updates, password hashing).
- [x] Email sending remains at route level (routes call services for DB, then handle email).

---

## 7. Upload / Misc Domains ✅
- [x] `/api/v1/upload/image` (POST - uses service for Cloudinary upload and article update)
- [x] Test directories (`test-auth`, `test-db`, `test-imports`) are empty - no action needed
- [x] No session-related actions found - no action needed

### Tasks
- [x] Create `lib/services/upload.ts` (Cloudinary upload, article update, permission check).
- [x] Route handles auth validation, service handles upload and DB operations.

---

## 8. Internal Utilities Cleanup ✅
- [x] Updated `sendNewsletter` to use `fetch` instead of `internalFetch`.
- [x] `internalFetch` kept for deferred operations (`createUser`, `updateUser`, `updateUserProfile`, `deleteArticle`, `updateArticle`).
- [x] Services handle errors consistently (throw `Error` with message) - verified across all service files.
- [x] API routes wrap errors via `handleApiError` - verified across all route files.
- [x] Services reuse shared helpers (`fieldProjections`, `serializeMongoObject`) where applicable.

---

## 9. Validation & Testing
- [ ] Smoke-test key flows per domain after each refactor (articles, comments, users, subscribers, auth).
- [ ] Run automated tests / lint (if available).
- [ ] Update documentation (e.g., `documentation/application/SERVER_ACTIONS_ARCHITECTURE.md`) to describe new universal pattern.

---

Use this checklist as the authoritative guide while migrating each domain. Complete one domain at a time to avoid overlapping regressions. Remember: extract existing logic into services first, then rewire actions/routes, then remove the old code.***

