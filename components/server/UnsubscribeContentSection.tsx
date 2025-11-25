import { getTranslations } from "next-intl/server";
import { CheckCircle, XCircle, Mail } from "lucide-react";
import type { NewsletterUnsubscribeResult } from "@/app/actions/subscribers/newsletterUnsubscribe";

interface UnsubscribeContentSectionProps {
  locale: string;
  email: string | undefined;
  token: string | undefined;
  result: NewsletterUnsubscribeResult | undefined;
  hasUserAccount: boolean;
}

export default async function UnsubscribeContentSection({
  locale,
  email,
  token,
  result,
  hasUserAccount,
}: UnsubscribeContentSectionProps) {
  const t = await getTranslations({ locale, namespace: "unsubscribe" });

  // If no email parameter, show invalid link error
  if (!email) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <Mail className="w-16 h-16 text-orange-600 mx-auto mb-4" />
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
    );
  }

  // Show result (success or error)
  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <Mail className="w-16 h-16 text-orange-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h1>
          <p className="text-gray-600">{t("description")}</p>
        </div>

        {result?.success ? (
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
              {result?.message || t("errorMessage")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

