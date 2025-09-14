"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { ISerializedArticle } from "@/interfaces/article";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { BookOpen, Eye, Heart, MessageCircle } from 'lucide-react';

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



  // Helper functions
  const getArticleTitle = (article: ISerializedArticle) => 
    article.contentsByLanguage[0]?.mainTitle || "No title";

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

  const StatCard = ({ icon, title, value }: {
    icon: React.ReactNode;
    title: string;
    value: number;
  }) => (
    <div className="bg-white shadow-md p-6 flex flex-col items-center justify-center">
      <div className="text-3xl mb-2 text-gray-500">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-red-600">{value}</p>
    </div>
  );

  // Simplified column definitions
  const columns: ColumnDef<ISerializedArticle>[] = [
    {
      id: "mainTitle",
      accessorFn: (row) => getArticleTitle(row),
      header: ({ column }) => createSortableHeader("Title", column),
      cell: ({ row }) => {
        const title = getArticleTitle(row.original);
        return (
          <div className="overflow-hidden font-medium text-gray-900 text-center whitespace-nowrap w-full" title={title}>
            {title}
          </div>
        );
      },
      enableColumnFilter: true,
      filterFn: (row, _, value) => 
        getArticleTitle(row.original).toLowerCase().includes(value.toLowerCase()),
      sortingFn: (rowA, rowB) => {
        const titleA = getArticleTitle(rowA.original);
        const titleB = getArticleTitle(rowB.original);
        return titleA.localeCompare(titleB);
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => createSortableHeader("Category", column),
      cell: ({ row }) => (
        <div className="capitalize text-gray-700 text-xs">
          {row.getValue("category")}
        </div>
      ),
      enableColumnFilter: true,
    },
    {
      accessorKey: "likes",
      header: ({ column }) => createSortableHeader("Likes", column),
      cell: ({ row }) => (
        <div className="text-gray-700 font-medium">
          {(row.getValue("likes") as string[])?.length || 0}
        </div>
      ),
    },
    {
      accessorKey: "commentsCount",
      header: ({ column }) => createSortableHeader("Comments", column),
      cell: ({ row }) => (
        <div className="text-gray-700 font-medium">
          {row.getValue("commentsCount") || 0}
        </div>
      ),
    },
    {
      accessorKey: "views",
      header: ({ column }) => createSortableHeader("Views", column),
      cell: ({ row }) => (
        <div className="text-gray-700 font-medium">
          {row.getValue("views") || 0}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => createSortableHeader("Created", column),
      cell: ({ row }) => (
        <div className="text-xs text-gray-600">
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </div>
      ),
    },
  ];

  // Helper functions
  const getArticleSlug = (article: ISerializedArticle) => 
    article.contentsByLanguage[0]?.seo?.slug;

  const handleRowClick = (article: ISerializedArticle) => {
    const slug = getArticleSlug(article);
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
    <div className="space-y-6 m-6 md:m-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<BookOpen />}
          title="Total Articles"
          value={weeklyStats.totalArticles}
        />
        <StatCard
          icon={<Eye />}
          title="Total Views"
          value={weeklyStats.totalViews}
        />
        <StatCard
          icon={<Heart />}
          title="Total Likes"
          value={weeklyStats.totalLikes}
        />
        <StatCard
          icon={<MessageCircle />}
          title="Total Comments"
          value={weeklyStats.totalComments}
        />
      </div>

      {/* Articles Data Table */}
        <div className="bg-white shadow-md p-4">
        <DataTable 
          columns={columns} 
          data={articles} 
          onRowClick={handleRowClick} 
          getArticleTitle={getArticleTitle}
        />
      </div>
    </div>
  );
}
