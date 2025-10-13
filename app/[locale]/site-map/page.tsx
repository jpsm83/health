import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import ErrorBoundary from "@/components/ErrorBoundary";

export async function generateMetadata({
  params,
}: {
  params: { locale: string } | Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return generatePublicMetadata(locale, "/site-map", "metadata.siteMap.title");
}

// Server Component - handles metadata generation and renders static content
export default function SiteMapPage() {
  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"SiteMap component"}>
        <div>
          <h1>Site Map</h1>
        </div>
      </ErrorBoundary>
    </main>
  );
}
