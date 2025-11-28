- missing pages to review
    reset-password
    forgot-password
    signin
    signup
    unsubscribe

- review all the skeletons to match the component

- updating profile not working

- organize components folder

- filter shows a icon, not input

- update documentation

- subscribe login not working

- slow page navigation with pagination (fetch cache issues)
Option 2: SWR or TanStack Query (recommended)
Pros:
Industry-standard caching
Automatic deduplication
Background revalidation
Prefetching support
Works well with server components
How it works:
Create a client component wrapper for pagination
Use SWR/TanStack Query to fetch and cache pages
Cache key: category-${category}-page-${page}-locale-${locale}
Instant navigation for cached pages
Implementation complexity: Medium (requires client component wrapper)

- unsubscribe page an logic need review

- implement create article