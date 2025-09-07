"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { confirmNewsletterSubscription } from "@/app/actions/newsletterSubscription";

export default function ConfirmNewsletter() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState<string>("");
  const searchParams = useSearchParams();
  const t = useTranslations("newsletterConfirmation");

  useEffect(() => {
    const confirmSubscription = async () => {
      const token = searchParams.get("token");
      const email = searchParams.get("email");

      if (!token || !email) {
        setStatus("error");
        setMessage(t("errorMessage"));
        return;
      }

      try {
        const result = await confirmNewsletterSubscription(token, email);

        if (result.success) {
          setStatus("success");
          setMessage(result.message);
        } else {
          setStatus("error");
          setMessage(result.message);
        }
      } catch (error) {
        console.error("Newsletter confirmation error:", error);
        setStatus("error");
        setMessage(t("errorMessage"));
      }
    };

    confirmSubscription();
  }, [searchParams, t]);

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-pink-600 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t("confirming")}
            </h1>
            <p className="text-gray-600">{t("processingMessage")}</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t("success")}
            </h1>
            <p className="text-gray-600 mb-6">
              {message || t("welcomeMessage")}
            </p>
            <Button onClick={handleGoHome} className="w-full">
              {t("goHome")}
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t("error")}
            </h1>
            <p className="text-gray-600 mb-6">{message || t("errorMessage")}</p>
          </>
        )}
      </div>
    </div>
  );
}
