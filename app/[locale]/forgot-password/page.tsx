import { Metadata } from "next";
import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import ForgotPassword from "@/pagesClient/ForgotPassword";
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
    "/forgot-password",
    "metadata.forgotPassword.title"
  );
}

// Server Component - handles metadata generation
export default function ForgotPasswordPage() {
  return (
    <main className="container mx-auto mt-4 mb-8 md:mt-8 md:mb-16">
      {/* Products Banner */}
      <ProductsBanner size="970x90" affiliateCompany="amazon" />

      <ErrorBoundary context={"ForgotPassword component"}>
        <ForgotPassword />
      </ErrorBoundary>

      {/* Products Banner */}
      <ProductsBanner size="970x240" affiliateCompany="amazon" />
    </main>
  );
}
