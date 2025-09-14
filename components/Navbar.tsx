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
  Handbag,
  Brush,
  Sun,
  Plane,
  House,
  FolderKanban,
  HandHeart,
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
      // Redirect to home if search input is empty
      router.push(`/${locale}`);
      setIsMobileMenuOpen(false); // Close mobile menu after redirect
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

  return (
    <nav className="text-white shadow-lg text-base">
      {/* Top navigation */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 flex justify-between items-center h-12 md:h-16 px-2 sm:px-6 lg:px-8">
        {/* Navigation Menu */}
        <div className="md:hidden relative flex items-center space-x-2">
          <DropdownMenu
            open={isMobileMenuOpen}
            onOpenChange={setIsMobileMenuOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="bg-red-600 text-white hover:bg-red-700 w-10 h-10"
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
                    className="w-full bg-white border-gray-200 rounded-md h-8 pl-10 text-sm focus:ring-1 focus:ring-red-300 focus:ring-offset-0"
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
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                  onClick={handleNavLinkClick}
                >
                  <HeartPulse size={16} className="text-red-600" /> {t("categories.health")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/fitness`}
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                  onClick={handleNavLinkClick}
                >
                  <Dumbbell size={16} className="text-red-600" /> {t("categories.fitness")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/nutrition`}
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                  onClick={handleNavLinkClick}
                >
                  <Salad size={16} className="text-red-600" /> {t("categories.nutrition")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/sex`}
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                  onClick={handleNavLinkClick}
                >
                  <VenusAndMars size={16} className="text-red-600" /> {t("categories.sex")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/beauty`}
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                  onClick={handleNavLinkClick}
                >
                  <Brush size={16} className="text-red-600" /> {t("categories.beauty")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/fashion`}
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                  onClick={handleNavLinkClick}
                >
                  <Handbag size={16} className="text-red-600" /> {t("categories.fashion")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/lifestyle`}
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                  onClick={handleNavLinkClick}
                >
                  <Sun size={16} className="text-red-600" /> {t("categories.lifestyle")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/travel`}
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                  onClick={handleNavLinkClick}
                >
                  <Plane size={16} className="text-red-600" /> {t("categories.travel")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/decor`}
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                  onClick={handleNavLinkClick}
                >
                  <House size={16} className="text-red-600" /> {t("categories.decor")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/productivity`}
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                  onClick={handleNavLinkClick}
                >
                  <FolderKanban size={16} className="text-red-600" /> {t("categories.productivity")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/parenting`}
                  className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                  onClick={handleNavLinkClick}
                >
                  <HandHeart size={16} className="text-red-600" /> {t("categories.parenting")}
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

        <div className="flex items-center gap-2 md:gap-4">
          {/* Search Filter */}
          <div className="hidden md:block relative w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={localSearchTerm}
              onChange={handleSearchChange}
              className="text-gray-700 w-full bg-white border-gray-200 rounded-md h-8 pl-10 text-sm focus:ring-1 focus:ring-red-300 focus:ring-offset-0"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>

          {/* Mobile Profile Button */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {session?.user ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-pink-600 text-white hover:bg-pink-700 rounded-full"
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
                      <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                        <UserRound size={16} className="text-white" />
                      </div>
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-pink-600 text-white hover:bg-pink-700 rounded-full"
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
                        className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                        onClick={handleNavLinkClick}
                      >
                        <UserRoundPen size={16} className="text-red-600" /> {t("profile")}
                      </Link>
                    </DropdownMenuItem>
                    {session?.user?.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/${locale}/dashboard`}
                          className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                          onClick={handleNavLinkClick}
                        >
                          <LayoutDashboard size={16} className="text-red-600" /> {t("dashboard")}
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                    >
                      <LogOut size={16} className="text-red-600" /> {t("signOut")}
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${locale}/signin`}
                        className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                        onClick={handleNavLinkClick}
                      >
                        🔐 {t("signIn")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${locale}/signup`}
                        className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                        onClick={handleNavLinkClick}
                      >
                        📝 {t("signUp")}
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {session?.user ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 bg-pink-600 text-white hover:bg-pink-700 rounded-full px-3 gap-2"
                      >
                        <span className="text-sm font-medium hidden lg:block">
                          {session.user.name}
                        </span>
                        {session.user.imageUrl &&
                        session.user.imageUrl.trim() !== "" ? (
                          <Image
                            src={session.user.imageUrl}
                            width={30}
                            height={30}
                            alt="User"
                            priority
                            className="rounded-full"
                          />
                        ) : (
                          <UserRound size={20} />
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-10 h-10 bg-pink-600 text-white hover:bg-pink-700 rounded-full"
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
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${locale}/profile`}
                        className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                      >
                        <UserRoundPen size={16} className="text-red-600" /> {t("profile")}
                      </Link>
                    </DropdownMenuItem>
                    {session?.user?.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/${locale}/dashboard`}
                          className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                        >
                          <LayoutDashboard size={16} className="text-red-600" /> {t("dashboard")}
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer hover:bg-pink-50 focus:bg-pink-50"
                    >
                      <LogOut size={16} className="text-red-600" /> {t("signOut")}
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
      <div className="hidden bg-rose-400 md:flex justify-center flex-wrap items-center px-6 lg:px-8 gap-2 py-2 border-t border-gray-300">
        {/* Article categories by button*/}
        {mainCategories.map((category) => (
          <Button
            variant="ghost"
            size="sm"
            asChild
            key={category}
            className="text-gray-200 hover:bg-rose-700 hover:text-white"
          >
            <Link href={`/${locale}/${category}`}>
              {t(`categories.${category.replace("-", "")}`)}
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  );
}
