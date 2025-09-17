"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { ISerializedArticle } from "@/types/article";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { BookOpen, Eye, Heart, MessageCircle } from 'lucide-react';
import DeleteArticleModal from "@/components/DeleteArticleModal";

interface WeeklyStats {
  totalArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

interface DashboardProps {
  articles: ISerializedArticle[];
  weeklyStats: WeeklyStats;
  locale: string;
}

export default function Dashboard({ articles, weeklyStats, locale }: DashboardProps) {
  const t = useTranslations("dashboard");
  const tArticle = useTranslations("article");
  const router = useRouter();
  const [articlesList, setArticlesList] = useState<ISerializedArticle[]>(articles);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [articleToDelete, setArticleToDelete] = useState<ISerializedArticle | null>(null);

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

  // Handle successful article deletion
  const handleDeleteSuccess = () => {
    // Remove article from local state
    if (articleToDelete) {
      setArticlesList(prev => prev.filter(article => article._id !== articleToDelete._id));
    }
  };

  // Open delete modal
  const openDeleteModal = (article: ISerializedArticle, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click
    setArticleToDelete(article);
    setShowDeleteModal(true);
  };

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

  const StatCard = ({ icon, titleKey, value }: {
    icon: React.ReactNode;
    titleKey: string;
    value: number;
  }) => (
    <div className="bg-white shadow-md p-6 flex flex-col items-center justify-center">
      <div className="text-3xl mb-2 text-gray-500">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{t(`stats.${titleKey}`)}</h3>
      <p className="text-3xl font-bold text-red-600">{value}</p>
    </div>
  );

  // Simplified column definitions
  const columns: ColumnDef<ISerializedArticle>[] = [
    {
      id: "mainTitle",
      accessorFn: (row) => getArticleTitle(row),
      header: ({ column }) => createSortableHeader(t("table.columns.title"), column),
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
      header: ({ column }) => createSortableHeader(t("table.columns.category"), column),
      cell: ({ row }) => (
        <div className="capitalize text-gray-700 text-xs">
          {row.getValue("category")}
        </div>
      ),
      enableColumnFilter: true,
    },
    {
      accessorKey: "likes",
      header: ({ column }) => createSortableHeader(t("table.columns.likes"), column),
      cell: ({ row }) => (
        <div className="text-gray-700 font-medium">
          {(row.getValue("likes") as string[])?.length || 0}
        </div>
      ),
    },
    {
      accessorKey: "commentsCount",
      header: ({ column }) => createSortableHeader(t("table.columns.comments"), column),
      cell: ({ row }) => (
        <div className="text-gray-700 font-medium">
          {row.getValue("commentsCount") || 0}
        </div>
      ),
    },
    {
      accessorKey: "views",
      header: ({ column }) => createSortableHeader(t("table.columns.views"), column),
      cell: ({ row }) => (
        <div className="text-gray-700 font-medium">
          {row.getValue("views") || 0}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => createSortableHeader(t("table.columns.created"), column),
      cell: ({ row }) => (
        <div className="text-xs text-gray-600">
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div></div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <button
            onClick={(e) => openDeleteModal(row.original, e)}
            className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
            title={tArticle("actions.delete")}
          >
            <Trash2 className="size-3" />
          </button>
        </div>
      ),
      enableSorting: false,
      enableColumnFilter: false,
      size: 50, // Make column very thin
      minSize: 50,
      maxSize: 50,
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
          titleKey="totalArticles"
          value={weeklyStats.totalArticles}
        />
        <StatCard
          icon={<Eye />}
          titleKey="totalViews"
          value={weeklyStats.totalViews}
        />
        <StatCard
          icon={<Heart />}
          titleKey="totalLikes"
          value={weeklyStats.totalLikes}
        />
        <StatCard
          icon={<MessageCircle />}
          titleKey="totalComments"
          value={weeklyStats.totalComments}
        />
      </div>

      {/* Articles Data Table */}
        <div className="bg-white shadow-md p-4">
        <DataTable 
          columns={columns} 
          data={articlesList} 
          onRowClick={handleRowClick} 
          getArticleTitle={getArticleTitle}
          translations={{
            filterPlaceholder: t("table.filter.placeholder"),
            columns: t("table.filter.columns"),
            rowsPerPage: t("table.pagination.rowsPerPage"),
            selected: t("table.pagination.selected"),
            page: t("table.pagination.page"),
            of: t("table.pagination.of"),
            previous: t("table.pagination.previous"),
            next: t("table.pagination.next"),
            noResults: t("table.noResults"),
          }}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteArticleModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setArticleToDelete(null);
        }}
        article={articleToDelete}
        onSuccess={handleDeleteSuccess}
        userId={session?.user?.id || ""}
        isAdmin={session?.user?.role === "admin"}
      />
    </div>
  );
}
