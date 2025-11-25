# Home Page Architecture & Best Practices

## Overview

This document explains the architecture, structure, flow, and implementation patterns used in the home page (`app/[locale]/page.tsx`). This architecture follows **Next.js 15 best practices** for Server Components, progressive rendering, performance optimization, and user experience.

**Use this document as a reference** when creating or updating other pages in the application to ensure consistency and best practices.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [File Structure](#file-structure)
3. [Component Hierarchy](#component-hierarchy)
4. [Data Flow](#data-flow)
5. [Server vs Client Components](#server-vs-client-components)
6. [Progressive Rendering with Suspense](#progressive-rendering-with-suspense)
7. [Performance Optimizations](#performance-optimizations)
8. [Implementation Patterns](#implementation-patterns)
9. [Code Examples](#code-examples)
10. [Best Practices Checklist](#best-practices-checklist)

---

## Architecture Overview

### Core Principles

1. **Server-First**: All data fetching happens on the server using Server Components
2. **Progressive Rendering**: Content streams in as it becomes available using React Suspense
3. **Code Splitting**: Automatic code splitting via Suspense boundaries and dynamic imports
4. **Performance**: Optimized images, lazy loading, and minimal JavaScript
5. **User Experience**: Skeleton loading states for immediate visual feedback

### Architecture Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                    app/[locale]/page.tsx                     │
│                    (Server Component)                        │
│  - Metadata generation                                       │
│  - Revalidation strategy                                     │
│  - Suspense boundaries for each section                      │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ HeroSection  │   │ Featured     │   │ Newsletter   │
│ (Server)     │   │ Articles      │   │ Section      │
│              │   │ Section       │   │ (Server)     │
│              │   │ (Server)      │   │              │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ Products     │   │ Featured     │   │ Newsletter   │
│ Banner       │   │ Articles      │   │ Signup       │
│ (Client)     │   │ (Client)      │   │ (Client)     │
└──────────────┘   └──────────────┘   └──────────────┘
```

---

## File Structure

### Directory Organization

```
app/
├── [locale]/
│   ├── page.tsx              # Main home page (Server Component)
│   └── loading.tsx           # Route-level loading state
│
components/
├── server/                   # Server Components (data fetching)
│   ├── HeroSection.tsx
│   ├── FeaturedArticlesSection.tsx
│   ├── NewsletterSection.tsx
│   └── CategoryCarouselSection.tsx
│
├── skeletons/                # Loading skeletons
│   ├── HeroSkeleton.tsx
│   ├── FeaturedArticlesSkeleton.tsx
│   ├── NewsletterSkeleton.tsx
│   └── CategoryCarouselSkeleton.tsx
│
└── [client components]        # Client Components (interactivity)
    ├── FeaturedArticles.tsx
    ├── CategoryCarousel.tsx
    ├── NewsletterSignup.tsx
    └── ProductsBanner.tsx
```

### File Naming Conventions

- **Server Components**: Located in `components/server/` directory
- **Client Components**: Located in `components/` directory (root)
- **Skeletons**: Located in `components/skeletons/` directory
- **Route Pages**: Located in `app/[locale]/` directory

---

## Component Hierarchy

### 1. Page Component (`app/[locale]/page.tsx`)

**Type**: Server Component  
**Responsibilities**:
- Generate metadata
- Set revalidation strategy
- Orchestrate Suspense boundaries
- Provide error boundary

```typescript
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"Home component"}>
        <Suspense fallback={<HeroSkeleton />}>
          <HeroSection locale={locale} />
        </Suspense>
        {/* More sections... */}
      </ErrorBoundary>
    </main>
  );
}
```

### 2. Server Section Components

**Type**: Server Components  
**Location**: `components/server/`  
**Responsibilities**:
- Fetch data using server actions
- Handle translations
- Pass data to client components

**Pattern**:
```typescript
export default async function SectionComponent({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "home" });
  const data = await fetchDataAction({ locale });
  
  return <ClientComponent data={data} title={t("title")} />;
}
```

### 3. Client Components

**Type**: Client Components  
**Location**: `components/` (root)  
**Responsibilities**:
- Handle user interactions
- Manage client-side state
- Render interactive UI

**Pattern**:
```typescript
"use client";

export default function ClientComponent({ data, title }: Props) {
  const [state, setState] = useState();
  // Interactive logic...
  return <div>{/* UI */}</div>;
}
```

### 4. Skeleton Components

**Type**: Server Components (can be client too)  
**Location**: `components/skeletons/`  
**Responsibilities**:
- Provide loading state UI
- Match final component dimensions
- Use `animate-pulse` for subtle animation

**Pattern**:
```typescript
export function SectionSkeleton() {
  return (
    <section>
      <Skeleton className="h-12 w-64" />
      {/* Match actual component layout */}
    </section>
  );
}
```

---

## Data Flow

### 1. Server-Side Data Fetching

```
┌─────────────────┐
│ Server Component│
│ (page.tsx)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Server Section  │
│ Component       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│ Server Action   │─────▶│ Service      │
│ (app/actions)   │      │ Layer        │
└─────────────────┘      │ (lib/services)│
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │ Database      │
                         │ (MongoDB)     │
                         └──────────────┘
```

### 2. Client-Side Interactions

```
┌─────────────────┐
│ Client Component│
│ (User clicks)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Server Action   │
│ (app/actions)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Service Layer   │
│ (lib/services)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Database        │
└─────────────────┘
```

### 3. Progressive Rendering Flow

```
1. User requests page
   ↓
2. Server starts rendering
   ↓
3. Route-level loading.tsx shows (HeroSkeleton + FeaturedSkeleton)
   ↓
4. HeroSection streams in (when ready)
   ↓
5. FeaturedArticlesSection streams in (when ready)
   ↓
6. NewsletterSection streams in (when ready)
   ↓
7. CategoryCarouselSection streams in (one by one, when ready)
```

---

## Server vs Client Components

### When to Use Server Components

✅ **Use Server Components for**:
- Data fetching
- Accessing backend resources (databases, APIs)
- Keeping sensitive information on server (API keys, tokens)
- Large dependencies that should not be in client bundle
- Static content that doesn't need interactivity

**Example**:
```typescript
// components/server/FeaturedArticlesSection.tsx
export default async function FeaturedArticlesSection({ locale }: Props) {
  const articles = await getArticles({ locale, limit: 10 });
  return <FeaturedArticles articles={articles} />;
}
```

### When to Use Client Components

✅ **Use Client Components for**:
- Interactivity (onClick, onChange, etc.)
- Browser APIs (localStorage, window, etc.)
- React hooks (useState, useEffect, etc.)
- Event listeners
- Third-party libraries that require client-side JavaScript

**Example**:
```typescript
// components/FeaturedArticles.tsx
"use client";

export default function FeaturedArticles({ articles }: Props) {
  const [selected, setSelected] = useState();
  // Interactive logic...
  return <div onClick={handleClick}>{/* UI */}</div>;
}
```

### Component Composition Pattern

**Server Component** → **Client Component** ✅ (Recommended)
```typescript
// Server Component
export default async function Section() {
  const data = await fetchData();
  return <ClientComponent data={data} />;
}
```

**Client Component** → **Server Component** ❌ (Not Allowed)
```typescript
// ❌ This won't work
"use client";
export default function Component() {
  return <ServerComponent />; // Error!
}
```

---

## Progressive Rendering with Suspense

### Why Suspense?

Suspense enables **streaming HTML** - content appears as soon as it's ready, rather than waiting for everything to load.

### Implementation Pattern

```typescript
<Suspense fallback={<SectionSkeleton />}>
  <SectionComponent locale={locale} />
</Suspense>
```

### Benefits

1. **Faster Time to First Byte (TTFB)**: Page shell loads immediately
2. **Better Perceived Performance**: Users see content progressively
3. **Improved Core Web Vitals**: Better LCP (Largest Contentful Paint)
4. **Automatic Code Splitting**: Each Suspense boundary creates a code split point

### Suspense Boundary Strategy

**Above the Fold** (Critical):
- Hero section
- Featured articles
- Show immediately with route-level `loading.tsx`

**Below the Fold** (Non-Critical):
- Newsletter section
- Category carousels
- Can stream in progressively

### Route-Level Loading State

Create `app/[locale]/loading.tsx` for initial page load:

```typescript
// app/[locale]/loading.tsx
import { HeroSkeleton } from "@/components/skeletons/HeroSkeleton";
import { FeaturedArticlesSkeleton } from "@/components/skeletons/FeaturedArticlesSkeleton";

export default function Loading() {
  return (
    <main className="container mx-auto">
      <HeroSkeleton />
      <FeaturedArticlesSkeleton />
    </main>
  );
}
```

---

## Performance Optimizations

### 1. Image Optimization

**Always use `next/image`** with proper configuration:

```typescript
<Image
  src={imageUrl}
  alt={altText}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  quality={75} // 75-80 for articles, 85-90 for hero
  priority={isAboveFold} // Only for above-fold images
  fetchPriority={isAboveFold ? "high" : "auto"}
/>
```

**Quality Guidelines**:
- Hero images: `quality={85}`
- Article images: `quality={75}`
- Banner images: `quality={85}` (above-fold), `quality={75}` (below-fold)

**Configuration** (`next.config.ts`):
```typescript
images: {
  qualities: [75, 85], // Required for Next.js 16 - must include all quality values used
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 31536000,
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
      port: '',
      pathname: '/**',
    },
    // ... other patterns
  ],
}
```

**Important**: The `qualities` array must include all quality values used in Image components. If you use `quality={75}` or `quality={85}`, both must be declared in the config. This is required starting in Next.js 16.

### 2. Code Splitting

**Automatic via Suspense**:
- Each Suspense boundary creates a code split
- No manual configuration needed

**Manual with Dynamic Imports**:
```typescript
// For below-fold components
const ProductsBanner = dynamic(() => import("@/components/ProductsBanner"));
```

### 3. Caching Strategy

**Page-Level Revalidation**:
```typescript
// app/[locale]/page.tsx
export const revalidate = 3600; // 1 hour
```

**Benefits**:
- Reduces database queries
- Improves response time
- Better user experience

### 4. Lazy Loading

**Below-Fold Components**:
```typescript
// Lazy load non-critical components
const ProductsBanner = dynamic(() => import("@/components/ProductsBanner"));
```

**Benefits**:
- Smaller initial bundle
- Faster page load
- Better Core Web Vitals

---

## Implementation Patterns

### Pattern 1: Server Section Component

```typescript
// components/server/SectionComponent.tsx
import { getTranslations } from "next-intl/server";
import { fetchDataAction } from "@/app/actions/data/fetchData";
import ClientComponent from "@/components/ClientComponent";
import { FieldProjectionType } from "@/app/api/utils/fieldProjections";

interface SectionComponentProps {
  locale: string;
}

export default async function SectionComponent({ locale }: SectionComponentProps) {
  const t = await getTranslations({ locale, namespace: "home" });
  
  const response = await fetchDataAction({
    locale,
    limit: 10,
    skipCount: true,
    fields: "featured" as FieldProjectionType, // Use proper type, not string
  });

  if (!response.data.length) {
    return (
      <section className="text-center">
        <p>{t("noData")}</p>
      </section>
    );
  }

  return (
    <ClientComponent
      data={response.data}
      title={t("section.title")}
      description={t("section.description")}
    />
  );
}
```

**Note**: When using `fields` parameter in article actions, always use `FieldProjectionType` ("featured" | "dashboard" | "full"), not `string`. This ensures type safety and prevents build errors.

### Pattern 2: Client Component with Interactivity

```typescript
// components/ClientComponent.tsx
"use client";

import { useState } from "react";
import { ISerializedData } from "@/types/data";

interface ClientComponentProps {
  data: ISerializedData[];
  title: string;
  description?: string;
}

export default function ClientComponent({
  data,
  title,
  description,
}: ClientComponentProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (id: string) => {
    setSelected(id);
  };

  return (
    <section>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <div>
        {data.map((item) => (
          <div key={item._id} onClick={() => handleClick(item._id)}>
            {/* Render item */}
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Pattern 3: Skeleton Component

```typescript
// components/skeletons/SectionSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function SectionSkeleton() {
  return (
    <section className="space-y-4">
      {/* Header skeleton - match actual component */}
      <div className="text-center mb-10">
        <Skeleton className="h-9 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto max-w-2xl" />
      </div>

      {/* Content skeleton - match actual layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Pattern 4: Page Component with Suspense

```typescript
// app/[locale]/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import ErrorBoundary from "@/components/ErrorBoundary";
import SectionComponent from "@/components/server/SectionComponent";
import { SectionSkeleton } from "@/components/skeletons/SectionSkeleton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePublicMetadata(locale, "", "metadata.page.title");
}

export const revalidate = 3600; // 1 hour

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "page" });

  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"Page component"}>
        <Suspense fallback={<SectionSkeleton />}>
          <SectionComponent locale={locale} />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
```

---

## Code Examples

### Complete Example: Article List Page

**1. Page Component** (`app/[locale]/articles/page.tsx`):
```typescript
import { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import ErrorBoundary from "@/components/ErrorBoundary";
import ArticlesSection from "@/components/server/ArticlesSection";
import { ArticlesSkeleton } from "@/components/skeletons/ArticlesSkeleton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePublicMetadata(locale, "articles", "metadata.articles.title");
}

export const revalidate = 3600;

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"Articles page"}>
        <Suspense fallback={<ArticlesSkeleton />}>
          <ArticlesSection locale={locale} />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
```

**2. Server Section Component** (`components/server/ArticlesSection.tsx`):
```typescript
import { getTranslations } from "next-intl/server";
import { getArticles } from "@/app/actions/article/getArticles";
import ArticlesList from "@/components/ArticlesList";

interface ArticlesSectionProps {
  locale: string;
}

export default async function ArticlesSection({ locale }: ArticlesSectionProps) {
  const t = await getTranslations({ locale, namespace: "articles" });

  const response = await getArticles({
    locale,
    limit: 20,
    skipCount: true,
    fields: "featured", // Optional: FieldProjectionType ("featured" | "dashboard" | "full")
  });

  return (
    <ArticlesList
      articles={response.data}
      title={t("title")}
      description={t("description")}
    />
  );
}
```

**3. Client Component** (`components/ArticlesList.tsx`):
```typescript
"use client";

import { ISerializedArticle } from "@/types/article";
import ArticleCard from "./ArticleCard";

interface ArticlesListProps {
  articles: ISerializedArticle[];
  title: string;
  description?: string;
}

export default function ArticlesList({
  articles,
  title,
  description,
}: ArticlesListProps) {
  return (
    <section>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>
    </section>
  );
}
```

**4. Loading State** (`app/[locale]/articles/loading.tsx`):
```typescript
import { ArticlesSkeleton } from "@/components/skeletons/ArticlesSkeleton";

export default function Loading() {
  return (
    <main className="container mx-auto">
      <ArticlesSkeleton />
    </main>
  );
}
```

---

## Best Practices Checklist

### ✅ Page Component Checklist

- [ ] Use `async` function for Server Component
- [ ] Implement `generateMetadata` for SEO
- [ ] Set `revalidate` for caching strategy
- [ ] Wrap content in `ErrorBoundary`
- [ ] Use `Suspense` boundaries for each data-fetching section
- [ ] Provide appropriate skeleton fallbacks

### ✅ Server Section Component Checklist

- [ ] Located in `components/server/` directory
- [ ] Use `async` function
- [ ] Fetch data using server actions
- [ ] Handle translations with `getTranslations`
- [ ] Pass data to client components
- [ ] Handle empty states gracefully

### ✅ Client Component Checklist

- [ ] Add `"use client"` directive at top
- [ ] Located in `components/` directory (root)
- [ ] Only handle interactivity and client-side logic
- [ ] Receive data as props from server components
- [ ] Use proper TypeScript types
- [ ] Optimize re-renders with proper state management

### ✅ Skeleton Component Checklist

- [ ] Match actual component dimensions
- [ ] Match actual component layout structure
- [ ] Use `Skeleton` component with `animate-pulse`
- [ ] Located in `components/skeletons/` directory
- [ ] Export as named export

### ✅ Image Optimization Checklist

- [ ] Always use `next/image` component
- [ ] Set appropriate `quality` prop (75-85)
- [ ] Add proper `sizes` attribute for responsive images
- [ ] Use `priority` only for above-fold images
- [ ] Use `fetchPriority="high"` for critical images
- [ ] Configure `qualities` in `next.config.ts` (required for Next.js 16)
  - Must include all quality values used (e.g., `qualities: [75, 85]`)
  - Build will fail if quality values are not declared

### ✅ Performance Checklist

- [ ] Implement Suspense boundaries for progressive rendering
- [ ] Create route-level `loading.tsx` for initial load
- [ ] Use dynamic imports for below-fold components
- [ ] Set appropriate `revalidate` values
- [ ] Optimize images with proper quality settings
- [ ] Implement error boundaries

### ✅ Code Quality Checklist

- [ ] Follow consistent file naming conventions
- [ ] Use TypeScript for type safety
  - Use proper types (e.g., `FieldProjectionType` instead of `string` for fields)
  - Import all required types and utilities
- [ ] Keep components focused and single-purpose
- [ ] Extract reusable logic into utilities
- [ ] Document complex logic with comments
- [ ] Remove unused code and imports
- [ ] Ensure all imports are present (check for missing `connectDb`, `mongoose`, etc.)
- [ ] Verify build passes without TypeScript errors

---

## Common Patterns & Solutions

### Pattern: Multiple Data-Fetching Sections

```typescript
// Each section in its own Suspense boundary
<Suspense fallback={<Section1Skeleton />}>
  <Section1Component locale={locale} />
</Suspense>

<Suspense fallback={<Section2Skeleton />}>
  <Section2Component locale={locale} />
</Suspense>
```

### Pattern: Conditional Rendering in Server Components

```typescript
export default async function Section({ locale }: Props) {
  const data = await fetchData();
  
  if (!data.length) {
    return <EmptyState />;
  }
  
  return <DataComponent data={data} />;
}
```

### Pattern: Error Handling

```typescript
// Page level
<ErrorBoundary context={"Page name"}>
  <Suspense fallback={<Skeleton />}>
    <SectionComponent />
  </Suspense>
</ErrorBoundary>
```

### Pattern: Translations

```typescript
// Server Component
const t = await getTranslations({ locale, namespace: "page" });
return <Component title={t("title")} />;

// Client Component
const t = useTranslations("page");
return <h1>{t("title")}</h1>;
```

---

## Migration Guide

### Converting Existing Pages

1. **Identify Server vs Client Logic**
   - Data fetching → Server Component
   - Interactivity → Client Component

2. **Split Components**
   - Create server section component in `components/server/`
   - Move client logic to separate client component

3. **Add Suspense Boundaries**
   - Wrap each data-fetching section
   - Create matching skeleton components

4. **Optimize Images**
   - Replace `<img>` with `<Image>`
   - Add quality, sizes, priority props

5. **Add Loading States**
   - Create route-level `loading.tsx`
   - Create section-level skeletons

6. **Set Caching Strategy**
   - Add `revalidate` export
   - Configure appropriate cache duration

---

## Performance Monitoring

The home page includes performance monitoring via `PerformanceMonitor` component:

- **Core Web Vitals**: LCP, CLS, TTFB, INP
  - **Note**: FID (First Input Delay) is deprecated in favor of INP (Interaction to Next Paint)
- **Page Load Time**: Tracks full page load
- **First Contentful Paint**: Tracks initial content visibility
- **Google Analytics Integration**: All metrics sent automatically

View metrics:
- **Development**: Browser console
- **Production**: Google Analytics → Events → Web Vitals

**Implementation**: The `PerformanceMonitor` component is integrated in the root layout (`app/layout.tsx`) and automatically tracks all metrics without requiring any additional setup.

---

## Summary

This architecture provides:

✅ **Fast Initial Load**: Route-level loading states  
✅ **Progressive Rendering**: Content streams as ready  
✅ **Optimal Performance**: Image optimization, code splitting, caching  
✅ **Great UX**: Skeleton loading states, error boundaries  
✅ **Maintainable Code**: Clear separation of concerns  
✅ **Scalable**: Easy to add new sections  
✅ **Next.js 15 Best Practices**: Server Components, Suspense, streaming  

**Use this document as your reference** when building or updating pages to ensure consistency and best practices across the entire application.

---

## Additional Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Suspense and Streaming](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)
- [Performance Best Practices](https://nextjs.org/docs/app/building-your-application/optimizing)

---

## Type Safety & Build Requirements

### FieldProjectionType Usage

When working with article actions that accept a `fields` parameter, always use the proper type:

```typescript
import { FieldProjectionType } from "@/app/api/utils/fieldProjections";

// ✅ Correct
const response = await getArticles({
  locale,
  fields: "featured" as FieldProjectionType,
});

// ❌ Incorrect - will cause build error
const response = await getArticles({
  locale,
  fields: "featured" as string, // Type error!
});
```

**Available FieldProjectionType values**:
- `"featured"` - Minimal fields for ArticleCard component
- `"dashboard"` - Stats + basic info for admin dashboard
- `"full"` - All fields (default)

### Image Quality Configuration

**Required for Next.js 16**: All quality values used in Image components must be declared in `next.config.ts`:

```typescript
// next.config.ts
images: {
  qualities: [75, 85], // Must include all values used
  // ...
}
```

**Build will fail** if you use `quality={75}` or `quality={85}` without declaring them in the config.

### Common Build Errors & Solutions

1. **Type Error: `fields` parameter**
   - **Error**: `Type 'string' is not assignable to type 'FieldProjectionType'`
   - **Solution**: Import `FieldProjectionType` and use proper type casting

2. **Missing Import Errors**
   - **Error**: `Cannot find name 'connectDb'` or `Cannot find name 'mongoose'`
   - **Solution**: Add missing imports at the top of the file

3. **Image Quality Warning**
   - **Warning**: `Image is using quality "85" which is not configured in images.qualities`
   - **Solution**: Add quality value to `qualities` array in `next.config.ts`

---

**Last Updated**: Based on Next.js 15.5.6 and current home page implementation  
**Build Status**: ✅ All TypeScript errors resolved, build passes successfully

