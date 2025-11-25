import { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import { auth } from "@/app/api/v1/auth/[...nextauth]/auth";
import ResetPassword from "@/components/ResetPassword";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProductsBanner from "@/components/ProductsBanner";
import { ResetPasswordSkeleton } from "@/components/skeletons/ResetPasswordSkeleton";

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

export const revalidate = 0; // Auth page, no caching needed

export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const { token } = await searchParams;

  // Server-side auth check - redirect if authenticated and no token
  const session = await auth();
  if (session?.user?.id && !token) {
    if (session.user.role === "admin") {
      redirect(`/${locale}/dashboard`);
    } else {
      redirect(`/${locale}/profile`);
    }
  }

  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"Reset Password page"}>
        {/* Products Banner - Client Component, can be direct */}
        <ProductsBanner size="970x90" affiliateCompany="amazon" />

        <Suspense fallback={<ResetPasswordSkeleton />}>
          <ResetPassword locale={locale} token={token as string | undefined} />
        </Suspense>

        {/* Products Banner - Client Component, can be direct */}
        <ProductsBanner size="970x240" affiliateCompany="amazon" />
      </ErrorBoundary>
    </main>
  );
}
