import { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProductsBanner from "@/components/ProductsBanner";
import UnsubscribeContentSection from "@/components/server/UnsubscribeContentSection";
import { UnsubscribeSkeleton } from "@/components/skeletons/UnsubscribeSkeleton";
import unsubscribeFromNewsletterAction from "@/app/actions/subscribers/newsletterUnsubscribe";
import connectDb from "@/app/api/db/connectDb";
import User from "@/app/api/models/user";

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

export const revalidate = 0; // Dynamic page with searchParams, no caching needed

export default async function UnsubscribePage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const searchParamsData = await searchParams;

  // Get email and token from URL parameters
  const email = searchParamsData.email as string;
  const token = searchParamsData.token as string;

  // If no email parameter, show invalid link error
  if (!email) {
    return (
      <main className="container mx-auto">
        <ErrorBoundary context={"Unsubscribe page"}>
          {/* Products Banner - Client Component, can be direct */}
          <ProductsBanner size="970x90" affiliateCompany="amazon" />

          <Suspense fallback={<UnsubscribeSkeleton />}>
            <UnsubscribeContentSection
              locale={locale}
              email={undefined}
              token={undefined}
              result={undefined}
              hasUserAccount={false}
            />
          </Suspense>

          {/* Products Banner - Client Component, can be direct */}
          <ProductsBanner size="970x240" affiliateCompany="amazon" />
        </ErrorBoundary>
      </main>
    );
  }

  // Process unsubscribe request first
  let result;
  try {
    result = await unsubscribeFromNewsletterAction(email, token);
  } catch (error) {
    console.error("Unsubscribe error:", error);
    result = {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }

  // Check if user has account AFTER processing unsubscribe
  let hasUserAccount = false;
  try {
    await connectDb();
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    hasUserAccount = !!existingUser;
  } catch (error) {
    console.error("Error checking for user account:", error);
    // Continue with showing result if there's an error checking user accounts
  }

  // If user has account and unsubscribe was successful, redirect to profile
  if (hasUserAccount && result.success) {
    redirect(`/${locale}/profile`);
  }

  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"Unsubscribe page"}>
        {/* Products Banner - Client Component, can be direct */}
        <ProductsBanner size="970x90" affiliateCompany="amazon" />

        <Suspense fallback={<UnsubscribeSkeleton />}>
          <UnsubscribeContentSection
            locale={locale}
            email={email}
            token={token}
            result={result}
            hasUserAccount={hasUserAccount}
          />
        </Suspense>

        {/* Products Banner - Client Component, can be direct */}
        <ProductsBanner size="970x240" affiliateCompany="amazon" />
      </ErrorBoundary>
    </main>
  );
}
