import { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import { auth } from "@/app/api/v1/auth/[...nextauth]/auth";
import ErrorBoundary from "@/components/ErrorBoundary";
import CreateArticleHeaderSection from "@/components/server/CreateArticleHeaderSection";
import CreateArticleForm from "@/components/CreateArticleForm";
import { CreateArticleSkeleton } from "@/components/skeletons/CreateArticleSkeleton";

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

export const revalidate = 0; // Admin page, no caching needed

export default async function CreateArticlePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Server-side auth check
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"Create Article page"}>
        <Suspense fallback={<CreateArticleSkeleton />}>
          <CreateArticleHeaderSection locale={locale} />
          <CreateArticleForm locale={locale} />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
