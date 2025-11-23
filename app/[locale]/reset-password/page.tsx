import { Metadata } from "next";
import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import ResetPassword from "@/pagesClient/ResetPassword";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProductsBanner from "@/components/ProductsBanner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePrivateMetadata(
    locale,
    "/reset-password",
    "metadata.resetPassword.title"
  );
}

// Server Component - handles metadata generation
export default function ResetPasswordPage() {
  return (
    <main className="container mx-auto mt-4 mb-8 md:mt-8 md:mb-16">
      {/* Products Banner */}
      <ProductsBanner size="970x90" affiliateCompany="amazon" />

      <ErrorBoundary context={"ResetPassword component"}>
        <ResetPassword />
      </ErrorBoundary>

      {/* Products Banner */}
      <ProductsBanner size="970x240" affiliateCompany="amazon" />
    </main>
  );
}
