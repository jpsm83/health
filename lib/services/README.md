# Service Layer Guidelines

All business logic that touches the database or external integrations should live in `lib/services/**`. Server actions and API routes remain thin wrappers that parse inputs, call the appropriate service function, and return serialized results.

## Principles

1. **Single Source of Truth**  
   - Every domain (articles, comments, users, subscribers, auth, upload, etc.) owns a dedicated service module such as `lib/services/articles.ts` or `lib/services/comments.ts`.
   - API routes and server actions never duplicate query logic; they call the same service functions.

2. **Pure, Testable Functions**  
   - Service functions receive plain data (params objects) and return plain data (serializable DTOs).  
   - Handle DB connectivity (`connectDb`) and model imports inside the service.

3. **Consistent Error Handling**  
   - Throw `Error` (or domain-specific subclasses) with descriptive messages.  
   - API routes wrap responses via existing helpers (e.g., `handleApiError`). Server actions bubble errors to the caller.

4. **Serialization & Projections**  
   - Reuse helpers such as `fieldProjections`, `serializeMongoObject`, and locale filtering utilities from the service layer.  
   - Services should return serializable objects ready for client consumption.

5. **No `internalFetch`**  
   - Actions must import services directly instead of calling HTTP endpoints.  
   - Remove `app/actions/utils/internalFetch.ts` once all domains are migrated.

6. **Naming Convention**  
   - Use `getXService`, `createXService`, `updateXService`, etc., or group related logic into cohesive functions.  
   - Separate files per domain: `lib/services/articles.ts`, `lib/services/comments.ts`, ...  
   - If a domain grows large, create a folder: `lib/services/<domain>/index.ts`.

Following these rules keeps the architecture consistent, improves performance (no server-side HTTP hops), and simplifies maintenance. Use the checklist in `ARCHITECTURE_TODO.md` to migrate each domain.***

