"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { useAuth } from "@/hooks/useAuth";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserRound, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search } from "lucide-react";
import { useState } from "react";

// Import country flag components
import {
  US,
  BR,
  ES,
  FR,
  DE,
  IT,
  NL,
  IL,
  RU,
} from "country-flag-icons/react/1x1";
import { mainCategories } from "@/lib/constants";

export default function Navbar() {
  // All hooks must be called at the top level, unconditionally
  const { isAuthenticated, logout, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("navigation");

  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    // Get current path without language prefix
    const pathWithoutLang =
      pathname?.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, "") || "";
    const newPath = `/${newLanguage}${pathWithoutLang || ""}`;

    // Use replace to avoid adding to browser history and ensure proper refresh
    router.replace(newPath);
  };

  // Handle search
  const handleSearch = () => {
    if (searchTerm.trim()) {
      console.log("Searching for:", searchTerm.trim());
      // TODO: Implement search functionality
      // router.push(`/${locale}/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Search term:", e.target.value);
    setSearchTerm(e.target.value);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Get language display name
  const getLanguageDisplayName = (lang: string): string => {
    const displayNames: Record<string, string> = {
      en: "English",
      pt: "Português",
      es: "Español",
      fr: "Français",
      de: "Deutsch",
      it: "Italiano",
      nl: "Nederlands",
      he: "עברית",
      ru: "Русский",
    };

    return displayNames[lang] || lang;
  };

  // Get country flag component
  const getCountryFlag = (lang: string) => {
    const flagMap: Record<
      string,
      React.ComponentType<{ title?: string; className?: string }>
    > = {
      en: US,
      pt: BR,
      es: ES,
      fr: FR,
      de: DE,
      it: IT,
      nl: NL,
      he: IL,
      ru: RU,
    };

    const FlagComponent = flagMap[lang];
    const languageName = getLanguageDisplayName(lang);

    return FlagComponent ? (
      <FlagComponent title={languageName} className="w-6 h-5 rounded-full" />
    ) : null;
  };

  return (
    <nav className="text-white shadow-lg text-base">
      {/* Top navigation */}
      <div className="bg-pink-600 flex justify-between items-center h-12 md:h-16 px-2 sm:px-6 lg:px-8">
        {/* Navigation Menu */}
        <div className="md:hidden relative flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="bg-pink-600 text-white hover:bg-pink-700 w-10 h-10"
              >
                <Menu size={24} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[240px] bg-white shadow-lg"
              align="start"
              side="bottom"
              sideOffset={4}
            >
              {/* Search Filter */}
              <div className="p-3 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder={t("searchArticles")}
                    value={searchTerm || ""}
                    onChange={handleSearchChange}
                    className="w-full bg-white border-gray-200 rounded-md h-8 pl-10 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                  />
                </div>
              </div>

              {/* Existing Pages */}
              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}`}
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                >
                  🏠 {t("home")}
                </Link>
              </DropdownMenuItem>

              {isAuthenticated && (
                <>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/${locale}/dashboard`}
                      className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                    >
                      📊 {t("dashboard")}
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/${locale}/create-article`}
                          className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                        >
                          ✍️ {t("createArticle")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/${locale}/edit-article`}
                          className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                        >
                          ✏️ {t("editArticle")}
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/${locale}/profile`}
                      className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                    >
                      👤 {t("profile")}
                    </Link>
                  </DropdownMenuItem>
                </>
              )}

              {/* Authentication Pages */}
              {!isAuthenticated && (
                <>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/${locale}/signin`}
                      className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                    >
                      🔐 {t("signIn")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/${locale}/signup`}
                      className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                    >
                      📝 {t("signUp")}
                    </Link>
                  </DropdownMenuItem>
                </>
              )}

              {/* Future Article Type Pages */}
              <DropdownMenuItem className="text-gray-400 cursor-default">
                ─── {t("articleCategories")} ───
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/articles/health`}
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                >
                  🏥 {t("categories.health")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/articles/fitness`}
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                >
                  💪 {t("categories.fitness")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/articles/nutrition`}
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                >
                  🥗 {t("categories.nutrition")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/articles/sex`}
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                >
                  ❤️ {t("categories.sex")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/articles/gym-wear`}
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                >
                  👕 {t("categories.gymwear")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/articles/beauty`}
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                >
                  💄 {t("categories.beauty")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/articles/fashion`}
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                >
                  👗 {t("categories.fashion")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/articles/lifestyle`}
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                >
                  🌟 {t("categories.lifestyle")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/articles/travel`}
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                >
                  ✈️ {t("categories.travel")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/articles/decor`}
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                >
                  🏠 {t("categories.decor")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/articles/productivity`}
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                >
                  ⚡ {t("categories.productivity")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/articles/parenting`}
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                >
                  👶 {t("categories.parenting")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Logo/Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <Heart size={24} />
          <span className="text-xl font-bold">{t("brandName")}</span>
        </Link>

        <div className="flex items-center space-x-4">
          {/* Search Filter */}
          <div className="hidden md:block relative w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchTerm || ""}
              onChange={handleSearchChange}
              className="text-gray-700 w-full bg-white border-gray-200 rounded-md h-8 pl-10 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>

          {/* Language Selector */}
          <div className="relative flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 bg-pink-600 text-white hover:bg-pink-700 rounded-full"
                >
                  {getCountryFlag(locale)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[140px] bg-white shadow-lg"
                align="end"
                side="bottom"
                sideOffset={4}
              >
                {routing.locales.map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className="cursor-pointer hover:bg-pink-50"
                  >
                    <div className="flex items-center space-x-2">
                      {getCountryFlag(lang)}
                      <span>{getLanguageDisplayName(lang)}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Authentication navigation desktop*/}
          <div className="hidden md:flex">
            {isAuthenticated ? (
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 bg-pink-600 text-white hover:bg-pink-700 rounded-full"
                    >
                      <UserRound size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[200px] bg-white shadow-lg"
                    align="end"
                    side="bottom"
                    sideOffset={4}
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${locale}/profile`}
                        className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                      >
                        👤 {t("profile")}
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === "admin" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/${locale}/create-article`}
                            className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                          >
                            ✍️ {t("createArticle")}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/${locale}/edit-article`}
                            className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                          >
                            ✏️ {t("editArticle")}
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                    >
                      🚪 {t("signOut")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center">
                {pathname !== `/${locale}/signin` && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-gray-300 hover:bg-pink-700 hover:text-white"
                  >
                    <Link href={`/${locale}/signin`}>{t("signIn")}</Link>
                  </Button>
                )}
                {pathname !== `/${locale}/signup` && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-gray-300 hover:bg-pink-700 hover:text-white"
                  >
                    <Link href={`/${locale}/signup`}>{t("signUp")}</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="hidden bg-pink-500 md:flex justify-center flex-wrap items-center px-6 lg:px-8 gap-2 py-2">
        {/* Article categories by button*/}
        {mainCategories.map((category) => (
          <Button
            variant="ghost"
            size="sm"
            asChild
            key={category}
            className="text-gray-300 hover:bg-pink-700 hover:text-white"
          >
            <Link href={`/${locale}/articles/?category=${category}`}>
              {t(`categories.${category.replace("-", "")}`)}
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  );
}
