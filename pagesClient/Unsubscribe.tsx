"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { unsubscribeFromNewsletter } from "@/app/actions/newsletterSubscription";
import { showToast } from "@/components/Toasts";

export default function Unsubscribe() {
  const [status, setStatus] = useState<
    "form" | "loading" | "success" | "error"
  >("form");
  const [email, setEmail] = useState<string>("");
  const [hasProcessed, setHasProcessed] = useState<boolean>(false);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const t = useTranslations("unsubscribe");

  const handleUnsubscribe = useCallback(
    async (emailToUnsubscribe?: string, tokenToUse?: string) => {
      const emailValue = emailToUnsubscribe || email;

      if (!emailValue.trim()) {
        showToast("error", "Email Required", "Please enter your email address");
        return;
      }

      setStatus("loading");

      try {
        const result = await unsubscribeFromNewsletter(
          emailValue.trim(),
          tokenToUse
        );

        if (result.success) {
          setStatus("success");
          setHasProcessed(true);
        } else {
          setStatus("error");
          showToast("error", "Unsubscribe Failed", result.message);
        }
      } catch (error) {
        console.error("Unsubscribe error:", error);
        setStatus("error");
        showToast(
          "error",
          "Unsubscribe Error",
          "Something went wrong. Please try again."
        );
      }
    },
    [email]
  );

  // Check if we have email and token in URL (from email link) - only process once
  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    if (emailParam && !hasProcessed) {
      setEmail(emailParam);
      setHasToken(!!tokenParam);
      setHasProcessed(true);
      handleUnsubscribe(emailParam, tokenParam || undefined);
    }
  }, [searchParams, handleUnsubscribe, hasProcessed]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUnsubscribe();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <Mail className="w-16 h-16 text-pink-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h1>
          <p className="text-gray-600">{t("description")}</p>
        </div>

        {status === "form" && !hasToken && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("emailLabel")}
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                required
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {t("unsubscribeButton")}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoHome}
              className="w-full"
            >
              {t("goHome")}
            </Button>
          </form>
        )}

        {status === "form" && hasToken && (
          <div className="text-center">
            <div className="mb-6">
              <p className="text-gray-600 mb-4">{t("processingMessage")}</p>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Email:</strong> {email}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoHome}
              className="w-full"
            >
              {t("goHome")}
            </Button>
          </div>
        )}

        {status === "loading" && (
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-pink-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {t("processing")}
            </h2>
            <p className="text-gray-600">{t("processingMessage")}</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {t("successTitle")}
            </h2>
            <p className="text-gray-600 mb-6">{t("successMessage")}</p>
            <Button onClick={handleGoHome} className="w-full">
              {t("goHome")}
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {t("errorTitle")}
            </h2>
            <p className="text-gray-600 mb-6">{t("errorMessage")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
