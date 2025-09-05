import { Metadata } from "next";
import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import ForgotPassword from "@/pagesClient/ForgotPassword";
import ErrorBoundary from "@/components/ErrorBoundary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePrivateMetadata(
    locale,
    "/forgot-password",
    "metadata.forgotPassword.title"
  );
}

// Server Component - handles metadata generation
export default function ForgotPasswordPage() {
  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"ForgotPassword component"}>
        <ForgotPassword />
      </ErrorBoundary>
    </main>
  );
}
