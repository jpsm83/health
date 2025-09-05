import { Metadata } from "next";
import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import SignIn from "@/pagesClient/SignIn";
import ErrorBoundary from "@/components/ErrorBoundary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePrivateMetadata(locale, "/signin", "metadata.signin.title");
}

// Server Component - handles metadata generation
export default function SignInPage() {
  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"SignIn component"}>
        <SignIn />
      </ErrorBoundary>
    </main>
  );
}
