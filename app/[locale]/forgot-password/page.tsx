import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import ForgotPassword from "@/pagesClient/ForgotPassword";
import ErrorBoundary from "@/components/ErrorBoundary";

export async function generateMetadata({
  params,
}: {
  params: { locale: string } | Promise<{ locale: string }>;
}) {
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
    <ErrorBoundary context={"ForgotPassword component"}>
      <ForgotPassword />
    </ErrorBoundary>
  );
}
