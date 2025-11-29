import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { categoryHeroImages } from "@/lib/constants";
import { optimizeCloudinaryUrl } from "@/lib/utils/optimizeCloudinaryUrl";
import HeroDescription from "@/components/HeroDescription";

interface HeroSectionProps {
  locale: string;
  category?: string; // Optional - if not provided, it's the home page
  title?: string; // Optional - custom title text
  description?: string; // Optional - custom description text
  alt?: string; // Optional - custom alt text
  imageKey?: keyof typeof categoryHeroImages; // Optional - custom image key
}

export default async function HeroSection({
  locale,
  category,
  title,
  description,
  alt,
  imageKey,
}: HeroSectionProps) {
  // Determine namespace and translation key prefix
  const namespace = category ? "articles" : "home";
  const t = await getTranslations({ locale, namespace });

  // Get image - use imageKey if provided, otherwise category or "home"
  const finalImageKey =
    imageKey || ((category || "home") as keyof typeof categoryHeroImages);
  const heroImage =
    categoryHeroImages[finalImageKey] || categoryHeroImages.health;

  // Get text - use custom text if provided, otherwise from translations
  const titleText = title || (category ? t(`${category}.title`) : t("title"));
  const descriptionText =
    description || (category ? t(`${category}.description`) : t("subtitle"));
  const altText =
    alt || (category ? t(`${category}.heroImageAlt`) : t("heroImageAlt"));

  return (
    <section className="relative w-full h-[55vh] min-h-[360px] md:h-[70vh] md:min-h-[500px] cv-auto">
      <div className="absolute inset-0">
        <Image
          src={optimizeCloudinaryUrl(heroImage, 85)}
          alt={altText}
          className="w-full h-full object-cover"
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
          fetchPriority="high"
          priority
          quality={85}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center h-full mx-3">
        <div className="flex flex-col gap-4 md:gap-8 text-center text-white max-w-4xl mx-auto px-4 md:px-6 bg-black/50 shadow-2xl py-4 md:py-8">
          <h1
            className="text-5xl md:text-6xl font-bolddrop-shadow-2xl"
            style={{
              textShadow:
                "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)",
            }}
          >
            {titleText}
          </h1>
          <HeroDescription fallbackDescription={descriptionText} />
        </div>
      </div>
    </section>
  );
}
