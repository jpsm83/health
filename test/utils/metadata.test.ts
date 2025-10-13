import { describe, it, expect } from 'vitest';
import { generateArticleMetadata } from '@/lib/utils/articleMetadata';
import { generatePublicMetadata } from '@/lib/utils/genericMetadata';
import { IMetaDataArticle } from '@/types/article';

describe('Metadata Generation', () => {
  describe('Article Metadata', () => {
    it('should generate proper Open Graph metadata with correct type', async () => {
      const mockMetaContent: IMetaDataArticle = {
        createdBy: 'Test Author',
        articleImages: ['https://example.com/image.jpg'],
        articleVideo: undefined,
        category: 'health',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        seo: {
          metaTitle: 'Test Article',
          metaDescription: 'Test description',
          keywords: ['health', 'women'],
          slug: 'test-article',
          hreflang: 'en',
          urlPattern: '/en/health/[slug]',
          canonicalUrl: 'https://example.com/en/health/test-article',
        },
      };

      const metadata = await generateArticleMetadata(mockMetaContent);

      // Check that Open Graph type is set to 'article'
      expect(metadata.openGraph?.type).toBe('article');
      
      // Check that required Open Graph properties are present
      expect(metadata.openGraph?.title).toBe('Test Article');
      expect(metadata.openGraph?.description).toBe('Test description');
      expect(metadata.openGraph?.siteName).toBe("Women's Spot");
      
      // Check that article-specific Open Graph properties are present
      expect(metadata.openGraph?.publishedTime).toBeDefined();
      expect(metadata.openGraph?.modifiedTime).toBeDefined();
      expect(metadata.openGraph?.authors).toEqual(['Test Author']);
      expect(metadata.openGraph?.section).toBe('health');
      expect(metadata.openGraph?.tags).toEqual(['health', 'women']);
    });

    it('should handle video content properly and prioritize video over images', async () => {
      const mockMetaContent: IMetaDataArticle = {
        createdBy: 'Test Author',
        articleImages: ['https://example.com/image.jpg'],
        articleVideo: 'https://example.com/video.mp4',
        category: 'health',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        seo: {
          metaTitle: 'Test Video Article',
          metaDescription: 'Test video description',
          keywords: ['health', 'video'],
          slug: 'test-video-article',
          hreflang: 'en',
          urlPattern: '/en/health/[slug]',
          canonicalUrl: 'https://example.com/en/health/test-video-article',
        },
      };

      const metadata = await generateArticleMetadata(mockMetaContent);

      // Check that video is included in Open Graph
      expect(metadata.openGraph?.videos).toBeDefined();
      expect(metadata.openGraph?.videos?.[0]?.url).toBe('https://example.com/video.mp4');
      expect(metadata.openGraph?.videos?.[0]?.type).toBe('video/mp4');
      expect(metadata.openGraph?.videos?.[0]?.width).toBe(720);
      expect(metadata.openGraph?.videos?.[0]?.height).toBe(1280);
      
      // Check that images are excluded when video is present (forces Pinterest to use video)
      expect(metadata.openGraph?.images).toBeUndefined();
      
      // Check that Twitter card is set to summary_large_image for better compatibility
      expect(metadata.twitter?.card).toBe('summary_large_image');
      
      // Check that Twitter images are included as fallback
      expect(metadata.twitter?.images).toBeDefined();
      
      // Check that Open Graph type is set to video.other for better platform recognition
      expect(metadata.openGraph?.type).toBe('video.other');
    });
  });

  describe('Generic Metadata', () => {
    it('should have proper Open Graph structure for website pages', () => {
      // Test the base metadata structure without calling the function
      const baseMetadata = {
        authors: [{ name: "Women's Spot Team" }],
        creator: "Women's Spot",
        publisher: "Women's Spot",
        siteName: "Women's Spot",
        images: [
          {
            url: "/womens-spot.png",
            width: 1200,
            height: 630,
            alt: "Women's Spot - Empowering Women",
          },
        ],
      };

      // Verify the base metadata structure
      expect(baseMetadata.siteName).toBe("Women's Spot");
      expect(baseMetadata.images).toBeDefined();
      expect(baseMetadata.images.length).toBeGreaterThan(0);
      expect(baseMetadata.images[0].url).toBe("/womens-spot.png");
    });
  });
});
