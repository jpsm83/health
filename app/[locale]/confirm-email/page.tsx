import { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";

import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import ErrorBoundary from "@/components/ErrorBoundary";
import ConfirmEmailUI from "@/components/ConfirmEmailUI";
import { ConfirmEmailSkeleton } from "@/components/skeletons/ConfirmEmailSkeleton";
import SectionHeader from "@/components/server/SectionHeader";
import NewsletterSection from "@/components/server/NewsletterSection";
import confirmEmailAction, {
  ConfirmEmailResult,
} from "@/app/actions/auth/confirmEmail";

// Lazy load below-fold banners (they're not critical for initial render)
const ProductsBanner = dynamic(() => import("@/components/ProductsBanner"));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePrivateMetadata(
    locale,
    "/confirm-email",
    "metadata.confirmEmail.title"
  );
}

export const revalidate = 3600;

export default async function ConfirmEmailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;
  const { token } = await searchParams;
  const t = await getTranslations({ locale, namespace: "confirmEmail" });

  // Handle missing token
  let result: ConfirmEmailResult;
  let initialStatus: "success" | "error" = "error";

  if (!token) {
    result = {
      success: false,
      message: t("messages.noToken"),
      error: "MISSING_TOKEN",
    };
  } else {
    try {
      // Call server action to confirm email
      result = await confirmEmailAction(token);
      initialStatus = result.success ? "success" : "error";
    } catch (error) {
      console.error("Error confirming email:", error);
      result = {
        success: false,
        message: t("messages.unexpectedError"),
        error: "CONFIRMATION_FAILED",
      };
    }
  }

  return (
    <main className="container mx-auto my-7 md:my-14">
      <ErrorBoundary context={"ConfirmEmail component"}>
        <div className="flex flex-col h-full gap-8 md:gap-16">
          {/* Products Banner */}
          <ProductsBanner size="970x90" affiliateCompany="amazon" />

          {/* Confirm Email Section */}
          <section className="space-y-6 md:space-y-12">
            <SectionHeader
              title={t("section.title")}
              description={t("section.description")}
            />
            <Suspense fallback={<ConfirmEmailSkeleton />}>
              <ConfirmEmailUI
                result={result}
                initialStatus={initialStatus}
                translations={{
                  success: {
                    title: t("success.title"),
                    signInButton: t("success.signInButton"),
                  },
                  error: {
                    title: t("error.title"),
                    backToSignInButton: t("error.backToSignInButton"),
                  },
                  messages: {
                    noToken: t("messages.noToken"),
                    confirmationFailed: t("messages.confirmationFailed"),
                    unexpectedError: t("messages.unexpectedError"),
                  },
                }}
              />
            </Suspense>
          </section>

          {/* Newsletter Section */}
          <NewsletterSection />

          {/* Products Banner */}
          <ProductsBanner size="970x90" affiliateCompany="amazon" />

          {/* Bottom banner - lazy loaded */}
          <ProductsBanner size="970x240" affiliateCompany="amazon" />
        </div>
      </ErrorBoundary>
    </main>
  );
}
