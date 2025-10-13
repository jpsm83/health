import ConfirmNewsletter from "@/pagesClient/ConfirmNewsletter";
import ErrorBoundary from "@/components/ErrorBoundary";
import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";

export async function generateMetadata({
  params,
}: {
  params: { locale: string } | Promise<{ locale: string }>;
}) {
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
