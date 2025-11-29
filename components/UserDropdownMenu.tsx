"use client";

import Link from "next/link";
import Image from "next/image";
import {
  UserRound,
  UserRoundPen,
  LayoutDashboard,
  LogOut,
  Heart,
  Search,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
interface UserDropdownMenuProps {
  variant: "mobile" | "desktop";
  session: {
    user?: {
      name?: string | null;
      email?: string | null;
      imageUrl?: string | null;
      role?: string | null;
    } | null;
  } | null;
  locale: string;
  onSearchClick: () => void;
  onLogout: () => void;
  translations: {
    search: string;
    profile: string;
    favorites: string;
    dashboard: string;
    createArticle: string;
    signOut: string;
    signIn: string;
    signUp: string;
  };
}

export default function UserDropdownMenu({
  variant,
  session,
  locale,
  onSearchClick,
  onLogout,
  translations,
}: UserDropdownMenuProps) {
  const isMobile = variant === "mobile";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {session?.user ? (
          <Button
            variant={isMobile ? "ghost" : undefined}
            size={isMobile ? "icon" : "sm"}
            className={
              isMobile
                ? "text-white rounded-full shadow-lg focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                : "h-10 bg-transparent hover:bg-transparent text-white cursor-pointer rounded-full px-3 gap-2 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
            }
            aria-label="Open profile menu"
          >
            {session.user.imageUrl && session.user.imageUrl.trim() !== "" ? (
              <Image
                src={session.user.imageUrl}
                alt="User"
                width={isMobile ? 32 : 30}
                height={isMobile ? 32 : 30}
                className="rounded-full"
              />
            ) : (
              <UserRound size={isMobile ? 16 : 20} />
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
              <p className="text-xs text-gray-500">{session?.user?.email}</p>
            </div>
            <DropdownMenuItem onClick={onSearchClick} className="cursor-pointer">
              <Search size={16} className="text-red-600" /> {translations.search}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/${locale}/profile`} className="cursor-pointer">
                <UserRoundPen size={16} className="text-red-600" />{" "}
                {translations.profile}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/${locale}/favorites`} className="cursor-pointer">
                <Heart size={16} className="text-red-600" />{" "}
                {translations.favorites}
              </Link>
            </DropdownMenuItem>
            {session?.user?.role === "admin" && (
              <>
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/dashboard`} className="cursor-pointer">
                    <LayoutDashboard size={16} className="text-red-600" />{" "}
                    {translations.dashboard}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/${locale}/create-article`}
                    className="cursor-pointer"
                  >
                    <FileText size={16} className="text-red-600" />{" "}
                    {translations.createArticle}
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
              <LogOut size={16} className="text-red-600" />{" "}
              {translations.signOut}
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={onSearchClick} className="cursor-pointer">
              <Search size={16} className="text-red-600" /> {translations.search}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/${locale}/signin`} className="cursor-pointer">
                <UserRound size={16} className="text-red-600" />{" "}
                {translations.signIn}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/${locale}/signup`} className="cursor-pointer">
                <UserRoundPen size={16} className="text-red-600" />{" "}
                {translations.signUp}
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

