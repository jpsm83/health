import { Metadata } from "next";
import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import Dashboard from "@/pagesClient/Dashboard";
import ErrorBoundary from "@/components/ErrorBoundary";
import { getAllArticlesForDashboard } from "@/app/actions/article/getAllArticlesForDashboard";
import { getWeeklyStats } from "@/app/actions/article/getWeeklyStats";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePrivateMetadata(
    locale,
    "/dashboard",
    "metadata.dashboard.title"
  );
}

// Server Component - handles metadata generation and data fetching
export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Fetch data on the server
  const [articles, weeklyStats] = await Promise.all([
    getAllArticlesForDashboard(),
    getWeeklyStats()
  ]);

  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"Dashboard component"}>
        <Dashboard 
          articles={articles} 
          weeklyStats={weeklyStats}
          locale={locale}
        />
      </ErrorBoundary>
    </main>
  );
}
