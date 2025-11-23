import { Metadata } from "next";
import ConfirmNewsletter from "@/pagesClient/ConfirmNewsletter";
import ErrorBoundary from "@/components/ErrorBoundary";
import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import ProductsBanner from "@/components/ProductsBanner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePrivateMetadata(
    locale,
    "/confirm-newsletter",
    "metadata.confirm-newsletter.title"
  );
}

export default function ConfirmNewsletterPage() {
  return (
    <main className="container mx-auto mt-4 mb-8 md:mt-8 md:mb-16">
      {/* Products Banner */}
      <ProductsBanner size="970x90" affiliateCompany="amazon" />

      <ErrorBoundary context={"ConfirmNewsletter component"}>
        <ConfirmNewsletter />
      </ErrorBoundary>

      {/* Products Banner */}
      <ProductsBanner size="970x240" affiliateCompany="amazon" />
    </main>
  );
}
