"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import requestPasswordResetAction from "@/app/actions/auth/requestPasswordReset";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormData {
  email: string;
}

interface ForgotPasswordProps {
  locale: string;
}

export default function ForgotPassword({ locale }: ForgotPasswordProps) {
  const t = useTranslations("ForgotPassword");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<FormData>({
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const result = await requestPasswordResetAction(data.email);

      if (result.success) {
        setSuccess(result.message || t("resetEmailSent"));
        // Clear the form on success
        setValue("email", "");
      } else {
        setError(result.message || t("failedToSendResetEmail"));
      }
    } catch {
      setError(t("unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (fieldName: keyof FormData) => {
    // Clear field error when user starts typing
    if (errors[fieldName]) {
      clearErrors(fieldName);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">
                <div className="font-medium mb-2">{t("errorOccurred")}</div>
                <div className="text-xs text-red-600">{error}</div>
              </div>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">
                <div className="font-medium mb-2">{t("resetEmailSent")}</div>
                <div className="text-xs text-green-600">
                  {t("checkEmailInstructions")}
                </div>
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              {t("emailAddress")}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              disabled={isLoading}
              {...register("email", {
                required: t("emailRequired"),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t("invalidEmailFormat"),
                },
              })}
              onChange={(e) => {
                setValue("email", e.target.value);
                handleInputChange("email");
              }}
              className={`${
                errors.email ? "input-error" : "input-standard"
              } mt-1 appearance-none relative block w-full focus:z-10 sm:text-sm placeholder-gray-500 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder={t("emailPlaceholder")}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              {t("enterEmailForReset")}
            </p>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              variant="customDefault"
            >
              {isLoading ? (
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              ) : null}
              {isLoading ? t("sendingResetLink") : t("sendResetLink")}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Link
            href={`/${locale}/signin`}
            className={`block font-medium text-orange-600 hover:text-orange-500 ${
              isLoading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {t("backToSignIn")}
          </Link>
          <Link
            href={`/${locale}/signup`}
            className={`block font-medium text-orange-600 hover:text-orange-500 ${
              isLoading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {t("dontHaveAccount")}
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            href={`/${locale}`}
            className={`font-medium text-orange-600 hover:text-orange-500 ${
              isLoading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

