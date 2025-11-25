import Image from "next/image";
import { getTranslations } from "next-intl/server";

import ProductsBanner from "@/components/ProductsBanner";

interface HeroSectionProps {
  locale: string;
}

export default async function HeroSection({ locale }: HeroSectionProps) {
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <>
      <ProductsBanner size="970x90" affiliateCompany="amazon" />

      <section className="relative w-full h-[55vh] min-h-[360px] md:h-[70vh] md:min-h-[500px] cv-auto">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/jpsm83/image/upload/v1761366390/health/dh6wlgqj1iuumg9utub1.jpg"
            alt={t("heroImageAlt")}
            className="w-full h-full object-cover"
            fill
            sizes="100vw"
            fetchPriority="high"
            priority
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
              {t("title")}
            </h1>
            <p
              className="text-xl md:text-2xl mb-8 text-white max-w-3xl mx-auto drop-shadow-xl"
              style={{
                textShadow:
                  "1px 1px 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.5)",
              }}
            >
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

