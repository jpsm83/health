"use client";

import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { ISerializedArticle } from "@/interfaces/article";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";

interface WeeklyStats {
  totalArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

interface DashboardProps {
  articles: ISerializedArticle[];
  weeklyStats: WeeklyStats;
}

export default function Dashboard({ articles, weeklyStats }: DashboardProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();

  const { data: session, status } = useSession();

  // Admin-only access check
  useEffect(() => {
    if (
      status !== "loading" &&
      (!session?.user?.id || session?.user?.role !== "admin")
    ) {
      router.push("/");
    }
  }, [status, session?.user?.id, session?.user?.role, router]);



  // Helper function for sortable header buttons
  const createSortableHeader = (title: string, column: { toggleSorting: (asc?: boolean) => void; getIsSorted: () => false | "asc" | "desc" }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-8 px-2 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
    >
      {title}
      <ArrowUpDown className="ml-1 h-3 w-3" />
    </Button>
  );

  // Define columns for the data table
  const columns: ColumnDef<ISerializedArticle>[] = [
    {
      accessorKey: "mainTitle",
      header: ({ column }) => createSortableHeader("Title", column),
      cell: ({ row }) => {
        const article = row.original;
        const mainTitle = article.contentsByLanguage[0]?.mainTitle || "No title";
        return (
          <div className="overflow-hidden font-medium text-gray-900 text-left whitespace-nowrap w-full" title={mainTitle}>
            {mainTitle}
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => createSortableHeader("Category", column),
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        return (
          <div className="capitalize text-gray-700 text-xs">
            {category}
          </div>
        );
      },
    },
    {
      accessorKey: "likes",
      header: ({ column }) => createSortableHeader("Likes", column),
      cell: ({ row }) => {
        const likes = row.getValue("likes") as string[];
        return <div className="text-gray-700 font-medium">{likes?.length || 0}</div>;
      },
    },
    {
      accessorKey: "commentsCount",
      header: ({ column }) => createSortableHeader("Comments", column),
      cell: ({ row }) => {
        const commentsCount = row.getValue("commentsCount") as number;
        return <div className="text-gray-700 font-medium">{commentsCount || 0}</div>;
      },
    },
    {
      accessorKey: "views",
      header: ({ column }) => createSortableHeader("Views", column),
      cell: ({ row }) => {
        const views = row.getValue("views") as number;
        return <div className="text-gray-700 font-medium">{views || 0}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => createSortableHeader("Created", column),
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string;
        const date = new Date(createdAt);
        return (
          <div className="text-xs text-gray-600">
            {date.toLocaleDateString()}
          </div>
        );
      },
    },
  ];

  // Handle row click to navigate to article
  const handleRowClick = (article: ISerializedArticle) => {
    const slug = article.contentsByLanguage[0]?.seo?.slug;
    const category = article.category;
    
    if (slug && category) {
      router.push(`/${locale}/${category}/${slug}`);
    }
  };

  // Don't render if not admin
  if (!session?.user?.id || session?.user?.role !== "admin") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t("title")}</h1>
        <p className="text-xl text-gray-600">{t("subtitle")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Articles */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl mb-2">📚</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Total Articles
          </h3>
          <p className="text-3xl font-bold text-blue-600">{weeklyStats.totalArticles}</p>
          <p className="text-sm text-gray-500 mt-1">All time articles</p>
        </div>

        {/* Total Views */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-4xl mb-2">👀</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Total Views
          </h3>
          <p className="text-3xl font-bold text-green-600">{weeklyStats.totalViews}</p>
          <p className="text-sm text-gray-500 mt-1">All time views</p>
        </div>

        {/* Total Likes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl mb-2">❤️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Total Likes
          </h3>
          <p className="text-3xl font-bold text-purple-600">{weeklyStats.totalLikes}</p>
          <p className="text-sm text-gray-500 mt-1">All time likes</p>
        </div>

        {/* Total Comments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl mb-2">💬</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Total Comments
          </h3>
          <p className="text-3xl font-bold text-orange-600">{weeklyStats.totalComments}</p>
          <p className="text-sm text-gray-500 mt-1">All time comments</p>
        </div>
      </div>

      {/* Articles Data Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 md:mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Articles Management</h2>
        <DataTable columns={columns} data={articles} onRowClick={handleRowClick} />
      </div>
    </div>
  );
}
