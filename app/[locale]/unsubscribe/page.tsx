import { Metadata } from "next";
import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import ErrorBoundary from "@/components/ErrorBoundary";
import Unsubscribe from "@/pagesClient/Unsubscribe";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePrivateMetadata(
    locale,
    "/unsubscribe",
    "metadata.unsubscribe.title"
  );
}

export default function UnsubscribePage() {
  return (
    <ErrorBoundary context={"Unsubscribe component"}>
      <Unsubscribe />
    </ErrorBoundary>
  );
}
