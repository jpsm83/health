"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { mainCategories } from "@/lib/constants";
import { translateCategoryToLocale } from "@/lib/utils/routeTranslation";
import { useSession, signOut } from "next-auth/react";
import UserDropdownMenu from "./UserDropdownMenu";
import SearchPopup from "./SearchPopup";

export default function Navbar() {
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const lastScrollY = useRef(0);
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("navigation");
  const { data: session } = useSession();

  const homeHref = locale === "en" ? "/" : `/${locale}`;
  const searchTerm = searchParams.get("q") || "";
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  // Sync search term with URL
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Detect mobile and handle scroll visibility
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Handle scroll-based navbar visibility (mobile only)
    const handleScroll = () => {
      if (!isMobile) {
        setIsVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else {
        setIsVisible(currentScrollY < lastScrollY.current);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile]);

  // Handlers
  const handleSearch = () => {
    if (localSearchTerm.trim()) {
      const base = locale === "en" ? "" : `/${locale}`;
      // Close popup immediately, navigate immediately
      setIsSearchPopupOpen(false);
      router.push(
        `${base}/search?q=${encodeURIComponent(localSearchTerm.trim())}`
      );
    } else {
      setIsSearchPopupOpen(false);
      router.push(homeHref);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push(homeHref);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const translations = {
    search: t("search"),
    profile: t("profile"),
    favorites: t("favorites"),
    dashboard: t("dashboard"),
    createArticle: t("createArticle"),
    signOut: t("signOut"),
    signIn: t("signIn"),
    signUp: t("signUp"),
  };

  return (
    <nav
      className={`bg-gradient-left-right text-white shadow-lg text-base fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out md:translate-y-0 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      suppressHydrationWarning
    >
      {/* Top navigation */}
      <div className="relative flex justify-between items-center h-16 md:h-20 px-2 sm:px-6 lg:px-8">
        {/* Left: User Menu */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="md:hidden">
            <UserDropdownMenu
              variant="mobile"
              session={session}
              locale={locale}
              onSearchClick={() => setIsSearchPopupOpen(true)}
              onLogout={handleLogout}
              translations={translations}
            />
          </div>
          <div className="hidden md:flex">
            <UserDropdownMenu
              variant="desktop"
              session={session}
              locale={locale}
              onSearchClick={() => setIsSearchPopupOpen(true)}
              onLogout={handleLogout}
              translations={translations}
            />
          </div>
        </div>

        {/* Center: Logo/Brand */}
        <Link
          href={homeHref}
          className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2"
        >
          <Heart size={24} />
          <span
            className="text-2xl font-bold"
            style={{
              textShadow:
                "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.4)",
            }}
          >
            {t("brandName")}
          </span>
        </Link>
      </div>

      {/* Bottom navigation */}
      <div className="bg-black/20 border-t border-white">
        <div className="flex overflow-x-auto px-3 sm:px-6 lg:px-8 gap-1 sm:gap-2 py-2 scrollbar-hide justify-start md:justify-center">
          {mainCategories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              size="sm"
              asChild
              className="text-gray-200 hover:bg-white/20 hover:text-white text-xs sm:text-sm whitespace-nowrap shrink-0"
            >
              <Link
                href={`/${locale}/${translateCategoryToLocale(
                  category,
                  locale
                )}`}
                prefetch={false}
                style={{
                  textShadow:
                    "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.4)",
                }}
              >
                {t(`categories.${category}`)}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Search Popup */}
      <SearchPopup
        isOpen={isSearchPopupOpen}
        searchTerm={localSearchTerm}
        placeholder={t("searchPlaceholder")}
        onClose={() => setIsSearchPopupOpen(false)}
        onSearch={handleSearch}
        onClear={() => setLocalSearchTerm("")}
        onSearchChange={setLocalSearchTerm}
      />
    </nav>
  );
}
