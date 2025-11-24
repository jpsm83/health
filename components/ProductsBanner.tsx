"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { banners, affiliateCompanies } from "@/lib/constants";

type BannerSize = "970x90" | "970x240" | "240x390" | "240x240" | "390x240";

interface ProductsBannerProps {
  size: BannerSize;
  product?: string;
  category?: string;
  affiliateCompany: keyof typeof affiliateCompanies;
}

export default function ProductsBanner({
  size,
  product,
  category,
  affiliateCompany,
}: ProductsBannerProps) {
  const t = useTranslations("productsBanner");
  
  // Get banner URL with type safety
  // All categories have all banner sizes defined in constants, so URL will always exist
  const bannerCategory = category ? category : "life";
  const bannerUrl = banners[bannerCategory as keyof typeof banners]?.[size] || "";

  // Safety check: return null if no banner URL to prevent Image component errors
  if (!bannerUrl) {
    return null;
  }

  const sizeClass =
    size === "970x90"
      ? "w-full lg:w-[970px] h-[90px]"
      : size === "970x240"
      ? "w-full lg:w-[970px] h-[240px]"
      : size === "240x390"
      ? "w-full h-full"
      : size === "240x240"
      ? "w-full h-full"
      : "h-[240px] w-full md:h-full";

  return (
    <div className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
      <div
        className={`relative ${sizeClass} overflow-hidden`}
        style={{ boxShadow: "4px 4px 12px 1px rgba(40, 40, 40)" }}
      >
        <Image
          src={bannerUrl}
          alt={`${product || category} banner`}
          fill
          className="object-cover object-right"
          sizes={
            size === "970x90" || size === "970x240"
              ? "100vw"
              : size === "240x390" || size === "240x240"
              ? "(max-width: 768px) 100vw, 300px"
              : "(max-width: 768px) 100vw, 400px"
          }
          priority={size === "970x90" || size === "970x240"}
        />

        {/* Product Name Overlay for 970x240*/}
        {size === "970x240" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 mx-6 hover:scale-105 transition-all duration-300">
            <div className="relative w-[170px] h-[80px]">
              <Image
                src={affiliateCompanies[affiliateCompany].logo}
                alt={`${
                  affiliateCompany.slice(0, 1).toUpperCase() +
                  affiliateCompany.slice(1)
                } Logo`}
                fill
                className="object-contain"
                sizes="170px"
              />
            </div>
            <h3
              className="text-white text-md md:text-lg lg:text-2xl font-bold text-center drop-shadow-2xl"
              style={{
                textShadow:
                  "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)",
              }}
            >
              {category
                ? t("salesNow", {
                    category:
                      category.slice(0, 1).toUpperCase() + category.slice(1),
                  })
                : t("salesNowNoCategory")}
            </h3>
            {product && (
              <h3
                className="text-white text-sm md:text-md lg:text-2xl font-bold text-center drop-shadow-2xl px-4"
                style={{
                  textShadow:
                    "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)",
                }}
              >
                {t("grabDealsProduct", { product })}
              </h3>
            )}
          </div>
        )}

        {/* Product Name Overlay for 970x90*/}
        {size === "970x90" && (
          <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 md:gap-4 mx-4 hover:scale-102 transition-all duration-300">
            <div className="relative w-[170px] h-[80px]">
              <Image
                src={affiliateCompanies[affiliateCompany].logo}
                alt={`${
                  affiliateCompany.slice(0, 1).toUpperCase() +
                  affiliateCompany.slice(1)
                } Logo`}
                fill
                className="object-contain"
                sizes="170px"
              />
            </div>
            <h3
              className="text-white text-md md:text-lg lg:text-2xl font-bold text-center drop-shadow-2xl"
              style={{
                textShadow:
                  "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)",
              }}
            >
              {category
                ? t("salesNow", {
                    category:
                      category.slice(0, 1).toUpperCase() + category.slice(1),
                  })
                : t("salesNowNoCategory")}
            </h3>
          </div>
        )}

        {/* Product Name Overlay for 240x390*/}
        {size === "240x390" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 md:gap-4 m-4 hover:scale-105 transition-all duration-300">
            <div className="relative w-[170px] h-[80px]">
              <Image
                src={affiliateCompanies[affiliateCompany].logo}
                alt={`${
                  affiliateCompany.slice(0, 1).toUpperCase() +
                  affiliateCompany.slice(1)
                } Logo`}
                fill
                className="object-contain"
                sizes="170px"
              />
            </div>
            <h3
              className="text-white text-sm md:text-md lg:text-lg font-bold text-center drop-shadow-2xl"
              style={{
                textShadow:
                  "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)",
              }}
            >
              {t("salesNow", {
                category: category
                  ? category.slice(0, 1).toUpperCase() + category.slice(1)
                  : "",
              })}
            </h3>
          </div>
        )}

        {/* Product Name Overlay for 240x240*/}
        {size === "240x240" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 md:gap-4 m-4 hover:scale-104 transition-all duration-300">
            <div className="relative w-[170px] h-[80px]">
              <Image
                src={affiliateCompanies[affiliateCompany].logo}
                alt={`${
                  affiliateCompany.slice(0, 1).toUpperCase() +
                  affiliateCompany.slice(1)
                } Logo`}
                fill
                className="object-contain"
                sizes="170px"
              />
            </div>
            <h3
              className="text-white text-md md:text-lg lg:text-xl font-bold text-center drop-shadow-2xl"
              style={{
                textShadow:
                  "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)",
              }}
            >
              {t("grabDealsCategory", {
                category: category
                  ? category.slice(0, 1).toUpperCase() + category.slice(1)
                  : "",
              })}
            </h3>
          </div>
        )}

        {/* Product Name Overlay for 390x240*/}
        {size === "390x240" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 md:gap-4 m-4 hover:scale-104 transition-all duration-300">
            <div className="relative w-[200px] h-[100px]">
              <Image
                src={affiliateCompanies[affiliateCompany].logo}
                alt={`${
                  affiliateCompany.slice(0, 1).toUpperCase() +
                  affiliateCompany.slice(1)
                } Logo`}
                fill
                className="object-contain"
                sizes="200px"
              />
            </div>
            <h3
              className="text-white text-md md:text-lg lg:text-xl font-bold text-center drop-shadow-2xl"
              style={{
                textShadow:
                  "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)",
              }}
            >
              {t("grabDealsCategory", {
                category: category
                  ? category.slice(0, 1).toUpperCase() + category.slice(1)
                  : "",
              })}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}