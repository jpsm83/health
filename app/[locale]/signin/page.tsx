import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import SignIn from "@/pagesClient/SignIn";
import ErrorBoundary from "@/components/ErrorBoundary";

export async function generateMetadata({
  params,
}: {
  params: { locale: string } | Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return generatePrivateMetadata(locale, "/signin", "metadata.signin.title");
}

// Server Component - handles metadata generation
export default function SignInPage() {
  return (
    <ErrorBoundary context={"SignIn component"}>
      <SignIn />
    </ErrorBoundary>
  );
}
