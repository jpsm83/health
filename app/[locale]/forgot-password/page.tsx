import { Metadata } from "next";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";

import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import { auth } from "@/app/api/v1/auth/[...nextauth]/auth";
import ErrorBoundary from "@/components/ErrorBoundary";
import ForgotPassword from "@/components/ForgotPassword";
import SectionHeader from "@/components/server/SectionHeader";
import NewsletterSection from "@/components/server/NewsletterSection";

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
    "/forgot-password",
    "metadata.forgotPassword.title"
  );
}

export const revalidate = 0; // Auth page, no caching needed

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Server-side auth check - redirect if already authenticated
  const session = await auth();
  if (session?.user?.id) {
    if (session.user.role === "admin") {
      redirect(`/${locale}/dashboard`);
    } else {
      redirect(`/${locale}/profile`);
    }
  }

  const t = await getTranslations({ locale, namespace: "ForgotPassword" });

  return (
    <main className="container mx-auto my-7 md:my-14">
      <ErrorBoundary context={"Forgot Password page"}>
        <div className="flex flex-col h-full gap-8 md:gap-16">
          {/* Products Banner */}
          <ProductsBanner size="970x90" affiliateCompany="amazon" />

          {/* Forgot Password Section */}
          <section className="space-y-6 md:space-y-12">
            <SectionHeader
              title={t("section.title")}
              description={t("section.description")}
            />
            <ForgotPassword locale={locale} />
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
