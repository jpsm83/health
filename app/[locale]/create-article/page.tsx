import { Metadata } from "next";
import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import CreateArticle from "@/pagesClient/CreateArticle";
import ErrorBoundary from "@/components/ErrorBoundary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePrivateMetadata(
    locale,
    "/create-article",
    "metadata.createArticle.title"
  );
}

// Server Component - handles metadata generation
export default function CreateArticlePage() {
  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"CreateArticle component"}>
        <CreateArticle />
      </ErrorBoundary>
    </main>
  );
}
