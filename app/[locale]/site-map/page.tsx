import { Metadata } from "next";
import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import SiteMap from "@/pagesClient/SiteMap";
import ErrorBoundary from "@/components/ErrorBoundary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePrivateMetadata(locale, "/site-map", "metadata.siteMap.title");
}

// Server Component - handles metadata generation
export default function SiteMapPage() {
  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"SiteMap component"}>
        <SiteMap />
      </ErrorBoundary>
    </main>
  );
}
