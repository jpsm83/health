"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UserRound,
  UserRoundPen,
  LayoutDashboard,
  LogOut,
  Heart,
  Filter,
  Search,
  X,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useRef } from "react";

import { mainCategories } from "@/lib/constants";
import { translateCategoryToLocale } from "@/lib/utils/routeTranslation";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  // All hooks must be called at the top level, unconditionally
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const lastScrollY = useRef<number>(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("navigation");

  const homeHref = locale === "en" ? "/" : `/${locale}`;

  const { data: session } = useSession();

  // Track when component is mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get search term from URL - single source of truth
  const searchTerm = searchParams.get("q") || "";

  // Handle search input change - just update local state for typing
  const [localSearchTerm, setLocalSearchTerm] = useState<string>("");

  // Sync local state with URL when component mounts or URL changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isSearchPopupOpen &&
        !target.closest(".mobile-search-popup") &&
        !target.closest(".mobile-search-trigger")
      ) {
        setIsSearchPopupOpen(false);
      }
    };

    if (isSearchPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchPopupOpen]);

  // Detect mobile screen size
  useEffect(() => {
    // SSR safety check
    if (typeof window === "undefined") return;

    const checkMobile = () => {
      // Tailwind's md breakpoint is 768px
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount (only after hydration)
    if (mounted) {
      checkMobile();
    }

    // Check on resize
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, [mounted]);

  // Handle scroll-based navbar visibility (only on mobile)
  useEffect(() => {
    // SSR safety check
    if (typeof window === "undefined") return;

    if (!isMobile) {
      // Always show navbar on desktop
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar at the top of the page
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else {
        // Hide when scrolling down, show when scrolling up
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down
          setIsVisible(false);
        } else {
          // Scrolling up
          setIsVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [isMobile]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  };

  // Handle clear search input
  const handleClearSearch = () => {
    setLocalSearchTerm("");
  };

  // Handle search on Enter key
  const handleSearch = () => {
    if (localSearchTerm.trim()) {
      const base = locale === "en" ? "" : `/${locale}`;
      router.push(
        `${base}/search?q=${encodeURIComponent(localSearchTerm.trim())}`
      );
      setIsSearchPopupOpen(false); // Close search popup after search
    } else {
      // Orangeirect to home if search input is empty
      router.push(homeHref);
      setIsSearchPopupOpen(false); // Close search popup after orangeirect
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });

      router.push(homeHref);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Handle navigation link clicks (close mobile menu)
  const handleNavLinkClick = () => {
    setIsSearchPopupOpen(false);
  };

  // Handle dropdown close to remove focus
  const handleDropdownClose = () => {
    // Remove focus from any active element
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <nav
      className={`bg-gradient-left-right text-white shadow-lg text-base fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out md:translate-y-0 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      suppressHydrationWarning
    >
      {/* Top navigation */}
      <div className="flex justify-between items-center h-16 px-2 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Profile Button */}
          <div className="md:hidden">
            {mounted && (
              <DropdownMenu
                onOpenChange={(open) => {
                  if (!open) {
                    handleDropdownClose();
                  }
                }}
              >
                <DropdownMenuTrigger asChild>
                  {session?.user ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white rounded-full shadow-lg focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                      aria-label="Open profile menu"
                    >
                      {session.user.imageUrl &&
                      session.user.imageUrl.trim() !== "" ? (
                        <Image
                          src={session.user.imageUrl}
                          alt="User"
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                          <UserRound size={16} className="text-white" />
                        </div>
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white rounded-full focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                      aria-label="Open user menu"
                    >
                      <UserRound size={20} />
                    </Button>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[200px] bg-white shadow-lg border border-gray-200 ml-2 mt-1"
                  align="end"
                  side="bottom"
                  sideOffset={4}
                >
                  {session?.user ? (
                    <>
                      {/* User info header */}
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {session?.user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {session?.user?.email}
                        </p>
                      </div>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/${locale}/profile`}
                          className="cursor-pointer"
                          onClick={handleNavLinkClick}
                        >
                          <UserRoundPen size={16} className="text-red-600" />{" "}
                          {t("profile")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/${locale}/favorites`}
                          className="cursor-pointer"
                          onClick={handleNavLinkClick}
                        >
                          <Heart size={16} className="text-red-600" />{" "}
                          {t("favorites")}
                        </Link>
                      </DropdownMenuItem>
                      {session?.user?.role === "admin" && (
                        <>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/${locale}/dashboard`}
                            className="cursor-pointer"
                            onClick={handleNavLinkClick}
                          >
                            <LayoutDashboard size={16} className="text-red-600" />{" "}
                            {t("dashboard")}
                          </Link>
                        </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/${locale}/create-article`}
                              className="cursor-pointer"
                              onClick={handleNavLinkClick}
                            >
                              <FileText size={16} className="text-red-600" />{" "}
                              {t("createArticle")}
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem
                        onClick={() => {
                          handleLogout();
                          setIsSearchPopupOpen(false);
                        }}
                        className="cursor-pointer"
                      >
                        <LogOut size={16} className="text-red-600" />{" "}
                        {t("signOut")}
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/${locale}/signin`}
                          className="cursor-pointer"
                          onClick={handleNavLinkClick}
                        >
                          <UserRound size={16} className="text-red-600" />{" "}
                          {t("signIn")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/${locale}/signup`}
                          className="cursor-pointer"
                          onClick={handleNavLinkClick}
                        >
                          <UserRoundPen size={16} className="text-red-600" />{" "}
                          {t("signUp")}
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Authentication navigation desktop */}
          <div className="hidden md:flex">
            {mounted && (
              <div className="relative">
                <DropdownMenu
                  onOpenChange={(open) => {
                    if (!open) {
                      handleDropdownClose();
                    }
                  }}
                >
                  <DropdownMenuTrigger asChild>
                    {session?.user ? (
                      <Button
                        size="sm"
                        className="h-10 bg-transparent hover:bg-transparent text-white cursor-pointer rounded-full px-3 gap-2 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                        aria-label="Open profile menu"
                      >
                        {session.user.imageUrl &&
                        session.user.imageUrl.trim() !== "" ? (
                          <Image
                            src={session.user.imageUrl}
                            width={30}
                            height={30}
                            alt="User"
                            className="rounded-full shadow-lg"
                          />
                        ) : (
                          <UserRound size={20} />
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-10 h-10 cursor-pointer text-white rounded-full focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                        aria-label="Open user menu"
                      >
                        <UserRound size={20} />
                      </Button>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[200px] bg-white shadow-lg border border-gray-200"
                    align="start"
                    side="bottom"
                    sideOffset={4}
                  >
                    {session?.user ? (
                      <>
                        {/* User info header */}
                        <div className="px-3 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {session?.user?.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {session?.user?.email}
                          </p>
                        </div>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/${locale}/profile`}
                            className="cursor-pointer"
                            onClick={handleNavLinkClick}
                          >
                            <UserRoundPen size={16} className="text-red-600" />{" "}
                            {t("profile")}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/${locale}/favorites`}
                            className="cursor-pointer"
                            onClick={handleNavLinkClick}
                          >
                            <Heart size={16} className="text-red-600" />{" "}
                            {t("favorites")}
                          </Link>
                        </DropdownMenuItem>
                        {session?.user?.role === "admin" && (
                          <>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/${locale}/dashboard`}
                              className="cursor-pointer"
                              onClick={handleNavLinkClick}
                            >
                              <LayoutDashboard size={16} className="text-red-600" />{" "}
                              {t("dashboard")}
                            </Link>
                          </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/${locale}/create-article`}
                                className="cursor-pointer"
                                onClick={handleNavLinkClick}
                              >
                                <FileText size={16} className="text-red-600" />{" "}
                                {t("createArticle")}
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="cursor-pointer"
                        >
                          <LogOut size={16} className="text-red-600" />{" "}
                          {t("signOut")}
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/${locale}/signin`}
                            className="cursor-pointer"
                            onClick={handleNavLinkClick}
                          >
                            <UserRound size={16} className="text-red-600" />{" "}
                            {t("signIn")}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/${locale}/signup`}
                            className="cursor-pointer"
                            onClick={handleNavLinkClick}
                          >
                            <UserRoundPen size={16} className="text-red-600" />{" "}
                            {t("signUp")}
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            {!mounted && (
              <div className="flex items-center gap-2">
                {pathname !== `/${locale}/signin` && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-gray-200 hover:bg-white/20 hover:text-white"
                    style={{
                      textShadow:
                        "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.4)",
                    }}
                  >
                    <Link href={`/${locale}/signin`}>{t("signIn")}</Link>
                  </Button>
                )}
                {pathname !== `/${locale}/signup` && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-gray-200 hover:bg-white/20 hover:text-white"
                    style={{
                      textShadow:
                        "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.4)",
                    }}
                  >
                    <Link href={`/${locale}/signup`}>{t("signUp")}</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Logo/Brand (center on desktop) */}
        <Link href={homeHref} className="flex items-center space-x-2 md:justify-self-center">
          <Heart size={24} />
          <span
            className="text-xl font-bold"
            style={{
              textShadow:
                "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.4)",
            }}
          >
            {t("brandName")}
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Search Filter Button */}
          <div className="md:hidden relative flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white w-10 h-10 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 mobile-search-trigger"
              onClick={() => setIsSearchPopupOpen(true)}
              aria-label="Open search"
            >
              <Filter size={24} />
            </Button>
          </div>

          {/* Search Filter (desktop) */}
          <div className="hidden md:block relative w-[300px] shadow-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={localSearchTerm}
              onChange={handleSearchChange}
              className="pl-10 input-standard"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="bg-black/20 border-t border-white">
        <div className="flex overflow-x-auto px-3 sm:px-6 lg:px-8 gap-1 sm:gap-2 py-2 scrollbar-hide justify-start md:justify-center">
          {/* Article categories by button*/}
          {mainCategories.map((category) => (
            <Button
              variant="ghost"
              size="sm"
              asChild
              key={category}
              className="text-gray-200 hover:bg-white/20 hover:text-white text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <Link
                href={`/${locale}/${translateCategoryToLocale(category, locale)}`}
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

      {/* Mobile Search Popup */}
      {isSearchPopupOpen && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setIsSearchPopupOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div 
            className="mobile-search-popup absolute inset-x-0 top-30 mx-4 bg-white rounded-lg shadow-3xl animate-in slide-in-from-top-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              {localSearchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                  type="button"
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
              <Input
                type="text"
                placeholder={t("searchArticles")}
                value={localSearchTerm}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className={`w-full bg-white text-gray-900 placeholder:text-gray-400 border-gray-300 rounded-md h-12 pl-12 text-base focus:ring-purple-400 border-2 ${
                  localSearchTerm ? "pr-10" : "pr-4"
                }`}
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
