# Social Media Metadata Implementation

## Overview

This implementation provides comprehensive metadata generation for all 6 major social media platforms, with platform-specific image optimization for each platform's requirements.

## Supported Platforms

- **Facebook** - 1200x630px recommended
- **Instagram** - 1080x1080px recommended  
- **X (Twitter)** - 1200x675px recommended
- **Pinterest** - 1000x1500px recommended
- **TikTok** - 1080x1920px recommended
- **Threads** - 1080x1080px recommended

## Key Features

### 1. Platform-Specific Image Selection
Each social media platform now uses its dedicated `postImage` from the article's social media data, ensuring optimal display across all platforms.

### 2. Fallback Strategy
- Primary: Platform-specific `postImage` from social media data
- Secondary: General `articleImages` array
- Tertiary: Default Women's Spot logo

### 3. Video Prioritization
When videos are present, they take priority over images for platforms that support video content (Pinterest, Twitter).

## Usage Examples

### For Article Pages

```typescript
import { generateArticleMetadata } from '@/lib/utils/articleMetadata';

// Basic usage - automatically extracts social media images
const metadata = await generateArticleMetadata(articleData);

// The function will automatically:
// 1. Extract postImages from socialMedia.facebook.postImage
// 2. Extract postImages from socialMedia.instagram.postImage
// 3. Extract postImages from socialMedia.xTwitter.postImage
// 4. Extract postImages from socialMedia.pinterest.postImage
// 5. Extract postImages from socialMedia.tiktok.postImage
// 6. Extract postImages from socialMedia.threads.postImage
```

### For Generic Pages

```typescript
import { 
  generatePublicMetadataWithSocialMedia,
  generatePrivateMetadataWithSocialMedia 
} from '@/lib/utils/genericMetadata';

// With social media data
const metadata = await generatePublicMetadataWithSocialMedia(
  'en',
  '/articles',
  'metadata.articles.title',
  socialMediaData
);

// Without social media data (uses default images)
const metadata = await generatePublicMetadataWithSocialMedia(
  'en',
  '/articles',
  'metadata.articles.title'
);
```

### Manual Image Specification

```typescript
import { generatePublicMetadata } from '@/lib/utils/genericMetadata';

const metadata = await generatePublicMetadata(
  'en',
  '/articles',
  'metadata.articles.title',
  {
    facebook: 'https://example.com/facebook-image.jpg',
    instagram: 'https://example.com/instagram-image.jpg',
    xTwitter: 'https://example.com/twitter-image.jpg',
    pinterest: 'https://example.com/pinterest-image.jpg',
    tiktok: 'https://example.com/tiktok-image.jpg',
    threads: 'https://example.com/threads-image.jpg',
  }
);
```

## Data Structure

### Article Schema (MongoDB)
```typescript
{
  languages: [{
    socialMedia: {
      facebook: {
        postImage: "https://example.com/facebook-1200x630.jpg",
        // ... other facebook fields
      },
      instagram: {
        postImage: "https://example.com/instagram-1080x1080.jpg",
        // ... other instagram fields
      },
      xTwitter: {
        postImage: "https://example.com/twitter-1200x675.jpg",
        // ... other twitter fields
      },
      pinterest: {
        postImage: "https://example.com/pinterest-1000x1500.jpg",
        // ... other pinterest fields
      },
      tiktok: {
        postImage: "https://example.com/tiktok-1080x1920.jpg",
        // ... other tiktok fields
      },
      threads: {
        postImage: "https://example.com/threads-1080x1080.jpg",
        // ... other threads fields
      }
    }
  }]
}
```

## Metadata Output

### Open Graph (Facebook, LinkedIn, WhatsApp)
```html
<meta property="og:image" content="https://example.com/facebook-1200x630.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/png" />
```

### Twitter Cards
```html
<meta name="twitter:image" content="https://example.com/twitter-1200x675.jpg" />
<meta name="twitter:image:width" content="1200" />
<meta name="twitter:image:height" content="675" />
```

### Pinterest Rich Pins
```html
<meta property="pinterest:image" content="https://example.com/pinterest-1000x1500.jpg" />
<meta property="pinterest:image:width" content="1000" />
<meta property="pinterest:image:height" content="1500" />
```

### Platform-Specific Metadata
```html
<!-- TikTok -->
<meta property="tiktok:image" content="https://example.com/tiktok-1080x1920.jpg" />
<meta property="tiktok:image:width" content="1080" />
<meta property="tiktok:image:height" content="1920" />

<!-- Threads -->
<meta property="threads:image" content="https://example.com/threads-1080x1080.jpg" />
<meta property="threads:image:width" content="1080" />
<meta property="threads:image:height" content="1080" />
```

## Helper Functions

### extractSocialMediaImages()
```typescript
import { extractSocialMediaImages } from '@/lib/utils/articleMetadata';

const socialMediaImages = extractSocialMediaImages(article.socialMedia);
// Returns: { facebook?: string, instagram?: string, ... }
```

## Best Practices

1. **Image Dimensions**: Always provide images in the recommended dimensions for each platform
2. **Format**: Use PNG or JPG formats for better compatibility
3. **HTTPS**: Ensure all image URLs use HTTPS for security
4. **Alt Text**: The system automatically generates appropriate alt text from the article title
5. **Fallbacks**: The system gracefully falls back to general images or default logo if platform-specific images are missing

## Migration Notes

- The `IMetaDataArticle` interface now includes optional `socialMedia` field
- Existing code will continue to work as the social media field is optional
- New convenience functions are available for easier integration
- All existing metadata generation functions maintain backward compatibility
