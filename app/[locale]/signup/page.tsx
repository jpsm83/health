import { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import { auth } from "@/app/api/v1/auth/[...nextauth]/auth";
import ErrorBoundary from "@/components/ErrorBoundary";
import SignUp from "@/components/SignUp";
import { SignUpSkeleton } from "@/components/skeletons/SignUpSkeleton";
import ProductsBanner from "@/components/ProductsBanner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePrivateMetadata(locale, "/signup", "metadata.signup.title");
}

export const revalidate = 0; // Auth page, no caching needed

export default async function SignUpPage({
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

  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"Signup page"}>
        {/* Products Banner - Client Component, can be direct */}
        <ProductsBanner size="970x90" affiliateCompany="amazon" />

        <Suspense fallback={<SignUpSkeleton />}>
          <SignUp locale={locale} />
        </Suspense>

        {/* Products Banner - Client Component, can be direct */}
        <ProductsBanner size="970x240" affiliateCompany="amazon" />
      </ErrorBoundary>
    </main>
  );
}
