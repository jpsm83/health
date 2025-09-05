import { Metadata } from "next";
import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import Profile from "@/pagesClient/Profile";
import ErrorBoundary from "@/components/ErrorBoundary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePrivateMetadata(locale, "/profile", "metadata.profile.title");
}

// Server Component - handles metadata generation
export default function ProfilePage() {
  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"Profile component"}>
        <Profile />
      </ErrorBoundary>
    </main>
  );
}
