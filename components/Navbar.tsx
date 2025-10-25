"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UserRound,
  Menu,
  UserRoundPen,
  LayoutDashboard,
  LogOut,
  HeartPulse,
  Dumbbell,
  Salad,
  VenusAndMars,
  Brush,
  Activity,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

import { mainCategories } from "@/lib/constants";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  // All hooks must be called at the top level, unconditionally
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("navigation");

  const { data: session } = useSession();

  // Get search term from URL - single source of truth
  const searchTerm = searchParams.get("q") || "";

  // Handle search input change - just update local state for typing
  const [localSearchTerm, setLocalSearchTerm] = useState<string>("");

  // Sync local state with URL when component mounts or URL changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  };

  // Handle search on Enter key
  const handleSearch = () => {
    if (localSearchTerm.trim()) {
      router.push(
        `/${locale}/search?q=${encodeURIComponent(localSearchTerm.trim())}`
      );
      setIsMobileMenuOpen(false); // Close mobile menu after search
    } else {
      // Orangeirect to home if search input is empty
      router.push(`/${locale}`);
      setIsMobileMenuOpen(false); // Close mobile menu after orangeirect
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });

      router.push(`/${locale}`);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Handle navigation link clicks (close mobile menu)
  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle dropdown close to remove focus
  const handleDropdownClose = () => {
    // Remove focus from any active element
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <nav className="bg-gradient-left-right text-white shadow-lg text-base">
      {/* Top navigation */}
      <div className="flex justify-between items-center h-12 md:h-16 px-2 sm:px-6 lg:px-8">
        {/* Navigation Menu */}
        <div className="md:hidden relative flex items-center space-x-2">
          <DropdownMenu
            open={isMobileMenuOpen}
            onOpenChange={(open) => {
              setIsMobileMenuOpen(open);
              if (!open) {
                handleDropdownClose();
              }
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white w-10 h-10 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              >
                <Menu size={24} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[240px] bg-white shadow-lg border border-gray-200"
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
                    value={localSearchTerm}
                    onChange={handleSearchChange}
                    className="w-full bg-white border-gray-200 rounded-md h-8 pl-10 text-sm focus:ring-purple-400"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                  />
                </div>
              </div>

              {/* Article Categories */}
              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/health`}
                  className="cursor-pointer"
                  onClick={handleNavLinkClick}
                  prefetch={false}
                >
                  <HeartPulse size={16} className="text-red-600" />{" "}
                  {t("categories.health")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/fitness`}
                  className="cursor-pointer"
                  onClick={handleNavLinkClick}
                  prefetch={false}
                >
                  <Dumbbell size={16} className="text-red-600" />{" "}
                  {t("categories.fitness")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/nutrition`}
                  className="cursor-pointer"
                  onClick={handleNavLinkClick}
                  prefetch={false}
                >
                  <Salad size={16} className="text-red-600" />{" "}
                  {t("categories.nutrition")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/intimacy`}
                  className="cursor-pointer"
                  onClick={handleNavLinkClick}
                  prefetch={false}
                >
                  <VenusAndMars size={16} className="text-red-600" />{" "}
                  {t("categories.intimacy")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/beauty`}
                  className="cursor-pointer"
                  onClick={handleNavLinkClick}
                  prefetch={false}
                >
                  <Brush size={16} className="text-red-600" />{" "}
                  {t("categories.beauty")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/weight-loss`}
                  className="cursor-pointer"
                  onClick={handleNavLinkClick}
                  prefetch={false}
                >
                  <Activity size={16} className="text-red-600" />{" "}
                  {t("categories.weight-loss")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/life`}
                  className="cursor-pointer"
                  onClick={handleNavLinkClick}
                  prefetch={false}
                >
                  <Heart size={16} className="text-red-600" />{" "}
                  {t("categories.life")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Logo/Brand */}
        <Link href="/" className="flex items-center space-x-2">
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
          {/* Search Filter */}
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

          {/* Mobile Profile Button */}
          <div className="md:hidden">
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
                  >
                    {session.user.imageUrl &&
                    session.user.imageUrl.trim() !== "" ? (
                      <Image
                        src={session.user.imageUrl}
                        alt="User"
                        width={32}
                        height={32}
                        priority
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
                  >
                    <UserRound size={20} />
                  </Button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[200px] bg-white shadow-lg border border-gray-200"
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
                    {session?.user?.role === "admin" && (
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
                    )}
                    <DropdownMenuItem
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
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
          </div>

          {/* Authentication navigation desktop*/}
          <div className="hidden md:flex">
            {session?.user ? (
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
                      >
                        {session.user.imageUrl &&
                        session.user.imageUrl.trim() !== "" ? (
                          <Image
                            src={session.user.imageUrl}
                            width={30}
                            height={30}
                            alt="User"
                            priority
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
                      >
                        <UserRound size={20} />
                      </Button>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[200px] bg-white shadow-lg border border-gray-200"
                    align="end"
                    side="bottom"
                    sideOffset={4}
                  >
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
                      >
                        <UserRoundPen size={16} className="text-red-600" />{" "}
                        {t("profile")}
                      </Link>
                    </DropdownMenuItem>
                    {session?.user?.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/${locale}/dashboard`}
                          className="cursor-pointer"
                        >
                          <LayoutDashboard size={16} className="text-red-600" />{" "}
                          {t("dashboard")}
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer"
                    >
                      <LogOut size={16} className="text-red-600" />{" "}
                      {t("signOut")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
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
      </div>

      {/* Bottom navigation */}
      <div className="bg-black/20 hidden md:flex justify-center flex-wrap items-center px-6 lg:px-8 gap-2 py-2 border-t border-white">
        {/* Article categories by button*/}
        {mainCategories.map((category) => (
          <Button
            variant="ghost"
            size="sm"
            asChild
            key={category}
            className="text-gray-200 hover:bg-white/20 hover:text-white"
          >
            <Link
              href={`/${locale}/${category}`}
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
    </nav>
  );
}
