import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import { SocialIcon } from "react-social-icons";

const Footer = () => {
  const locale = useLocale();
  const t = useTranslations("footer");

  return (
    <footer className="bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row lg:flex-row gap-8 md:gap-16 justify-center items-center md:items-start flex-wrap">
          {/* Brand section */}
          <div className="flex flex-col items-center md:items-start md:text-left text-center space-y-4 flex-shrink-0 min-w-[250px] md:min-w-[280px]">
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <Heart size={24} className="text-pink-200" />
              <span className="text-xl font-bold">Women&apos;s Spot</span>
            </Link>
            <p className="text-pink-100 text-sm text-center md:text-left max-w-xs cursor-default">
              {t("brandDescription")}
            </p>
          </div>

          {/* Quick links section */}
          <div className="flex flex-col items-center md:items-start md:text-left text-center space-y-4 flex-shrink-0 min-w-[200px] md:min-w-[220px]">
            <h3 className="text-lg font-semibold text-pink-200 cursor-default">
              {t("quickLinks")}
            </h3>
            <div className="flex flex-col space-y-2">
              <Link
                href={`/${locale}/about`}
                className="text-pink-100 hover:text-white transition-colors duration-200 text-sm"
              >
                {t("aboutUs")}
              </Link>
              <Link
                href={`/${locale}/privacy-policy`}
                className="text-pink-100 hover:text-white transition-colors duration-200 text-sm"
              >
                {t("privacyPolicy")}
              </Link>
              <Link
                href={`/${locale}/terms-conditions`}
                className="text-pink-100 hover:text-white transition-colors duration-200 text-sm"
              >
                {t("termsAndConditions")}
              </Link>
              <Link
                href={`/${locale}/cookie-policy`}
                className="text-pink-100 hover:text-white transition-colors duration-200 text-sm"
              >
                {t("cookiesPolicy")}
              </Link>
              <Link
                href={`/${locale}/site-map`}
                className="text-pink-100 hover:text-white transition-colors duration-200 text-sm"
              >
                {t("siteMap")}
              </Link>
            </div>
          </div>

          {/* Social media section */}
          <div className="flex flex-col items-center md:items-start space-y-4 flex-shrink-0 min-w-[200px] md:min-w-[220px]">
            <h3 className="text-lg font-semibold text-pink-200 cursor-default">
              {t("followUs")}
            </h3>
            <div className="flex flex-wrap gap-3">
              <SocialIcon
                url="https://www.instagram.com/womensspotorg/"
                target="_blank"
                className="hover:scale-110 transition-transform duration-200"
                fgColor="white"
                bgColor="transparent"
                style={{ width: 40, height: 40 }}
              />
              <SocialIcon
                url="https://x.com/Womens_Spot"
                target="_blank"
                className="hover:scale-110 transition-transform duration-200"
                fgColor="white"
                bgColor="transparent"
                style={{ width: 40, height: 40 }}
              />
              <SocialIcon
                url="https://es.pinterest.com/womensspotorg"
                target="_blank"
                className="hover:scale-110 transition-transform duration-200"
                fgColor="white"
                bgColor="transparent"
                style={{ width: 40, height: 40 }}
              />
              <SocialIcon
                url="https://www.tiktok.com/@womensspot"
                target="_blank"
                className="hover:scale-110 transition-transform duration-200"
                fgColor="white"
                bgColor="transparent"
                style={{ width: 40, height: 40 }}
              />
              <SocialIcon
                network="threads"
                url="https://www.threads.com/@womensspotorg"
                target="_blank"
                className="hover:scale-110 transition-transform duration-200"
                fgColor="white"
                bgColor="transparent"
                style={{ width: 40, height: 40 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer bar */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-rose-700 border-t border-pink-500 flex justify-center items-center">
        <p className="text-pink-200 text-sm text-center md:text-left">
          {t("copyright")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
