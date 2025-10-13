import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import ErrorBoundary from "@/components/ErrorBoundary";
import { CheckCircle, XCircle, Mail } from "lucide-react";
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

interface UnsubscribePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ locale: string }>;
}

export default async function UnsubscribePage({
  searchParams,
  params,
}: UnsubscribePageProps) {
  const { locale } = await params;
  const searchParamsData = await searchParams;
  const t = await getTranslations("unsubscribe");

  // Get email and token from URL parameters
  const email = searchParamsData.email as string;
  const token = searchParamsData.token as string;

  // If no email parameter, show invalid link error
  if (!email) {
    return (
      <ErrorBoundary context={"Unsubscribe component"}>
        <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-8">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <Mail className="w-16 h-16 text-pink-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t("title")}
              </h1>
              <p className="text-gray-600">{t("description")}</p>
            </div>

            <div className="text-center">
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {t("invalidLinkTitle")}
              </h2>
              <p className="text-gray-600 mb-6">{t("invalidLinkMessage")}</p>
            </div>
          </div>
        </div>
      </ErrorBoundary>
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
    <ErrorBoundary context={"Unsubscribe component"}>
      <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <Mail className="w-16 h-16 text-pink-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t("title")}
            </h1>
            <p className="text-gray-600">{t("description")}</p>
          </div>

          {result.success ? (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {t("successTitle")}
              </h2>
              <p className="text-gray-600 mb-6">{t("successMessage")}</p>
            </div>
          ) : (
            <div className="text-center">
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {t("errorTitle")}
              </h2>
              <p className="text-gray-600 mb-6">
                {result.message || t("errorMessage")}
              </p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
