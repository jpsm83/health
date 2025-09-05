import { Metadata } from "next";
import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import Dashboard from "@/pagesClient/Dashboard";
import ErrorBoundary from "@/components/ErrorBoundary";

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

// Server Component - handles metadata generation
export default function DashboardPage() {
  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"Dashboard component"}>
        <Dashboard />
      </ErrorBoundary>
    </main>
  );
}
