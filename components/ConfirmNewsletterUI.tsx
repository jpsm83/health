"use client";

import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { NewsletterConfirmResult } from "@/app/actions/subscribers/confirmNewsletterSubscription";

interface ConfirmNewsletterUIProps {
  result: NewsletterConfirmResult;
  initialStatus: "loading" | "success" | "error";
  translations: {
    confirming: string;
    success: string;
    error: string;
    welcomeMessage: string;
    errorMessage: string;
    processingMessage: string;
  };
}

export default function ConfirmNewsletterUI({
  result,
  initialStatus,
  translations,
}: ConfirmNewsletterUIProps) {
  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {initialStatus === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-orange-600 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {translations.confirming}
            </h1>
            <p className="text-gray-600">{translations.processingMessage}</p>
          </>
        )}

        {initialStatus === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {translations.success}
            </h1>
            <p className="text-gray-600 mb-6">
              {result.message || translations.welcomeMessage}
            </p>
          </>
        )}

        {initialStatus === "error" && (
          <>
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {translations.error}
            </h1>
            <p className="text-gray-600 mb-6">
              {result.message || translations.errorMessage}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

