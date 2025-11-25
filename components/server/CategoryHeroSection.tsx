import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { categoryHeroImages } from "@/lib/constants";

interface CategoryHeroSectionProps {
  category: string;
  locale: string;
}

export default async function CategoryHeroSection({
  category,
  locale,
}: CategoryHeroSectionProps) {
  const t = await getTranslations({ locale, namespace: "articles" });

  const heroImage =
    categoryHeroImages[category as keyof typeof categoryHeroImages] ||
    categoryHeroImages.health;

  return (
    <section className="relative w-full h-[55vh] min-h-[360px] md:h-[70vh] md:min-h-[500px] cv-auto">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt={t(`${category}.heroImageAlt`)}
          className="w-full h-full object-cover"
          fill
          sizes="100vw"
          fetchPriority="high"
          priority
          quality={85}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center h-full mx-3">
        <div className="text-center text-white max-w-4xl mx-auto px-4 md:px-6 bg-black/50 shadow-2xl py-4 md:py-8">
          <h1
            className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-2xl"
            style={{
              textShadow:
                "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)",
            }}
          >
            {t(`${category}.title`)}
          </h1>
          <p
            className="text-lg md:text-xl text-white mb-10 max-w-2xl mx-auto drop-shadow-lg"
            style={{
              textShadow:
                "1px 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.4)",
            }}
          >
            {t(`${category}.description`)}
          </p>
        </div>
      </div>
    </section>
  );
}

