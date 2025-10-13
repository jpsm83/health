import { Metadata } from "next";
import ConfirmNewsletter from "@/pagesClient/ConfirmNewsletter";
import ErrorBoundary from "@/components/ErrorBoundary";
import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";

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
      <ErrorBoundary context={"ConfirmNewsletter component"}>
        <ConfirmNewsletter />
      </ErrorBoundary>
  );
}
