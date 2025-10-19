"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { useSession, signOut } from "next-auth/react";
import resetPassword from "@/app/actions/auth/resetPassword";

interface FormData {
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("ResetPassword");

  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
  } = useForm<FormData>({
    mode: "onChange",
  });

  const newPassword = watch("newPassword");

  useEffect(() => {
    const tokenParam = searchParams?.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  // Redirect if already authenticated AND no token (direct access to reset page)
  useEffect(() => {
    if (status === "authenticated" && !token) {
      // Redirect based on user role
      if (session?.user?.role === "admin") {
        router.push(`/${locale}/dashboard`);
      } else {
        router.push(`/${locale}/profile`);
      }
    }
  }, [status, session?.user?.role, router, locale, token]);

  const onSubmit = async (data: FormData) => {
    setError("");
    setSuccess("");

    if (!token) {
      setError(t("resetTokenMissing"));
      return;
    }

    if (!data.newPassword || !data.confirmPassword) {
      setError(t("bothPasswordsRequired"));
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }

    if (data.newPassword.length < 6) {
      setError(t("passwordTooShort"));
      return;
    }

    setIsLoading(true);

    try {
      // Use server action instead of fetch
      const result = await resetPassword(token, data.newPassword);

      if (result.success) {
        setSuccess(result.message || t("passwordResetSuccess"));
        // Clear the form on success
        setValue("newPassword", "");
        setValue("confirmPassword", "");

        // Sign out the user if they're authenticated (for profile password change flow)
        if (status === "authenticated") {
          try {
            await signOut({ redirect: false });
          } catch (logoutError) {
            console.error("Logout error:", logoutError);
            // Continue even if logout fails
          }
        }

        // Redirect to signin page after a short delay
        setTimeout(() => {
          router.push(`/${locale}/signin`);
        }, 2000);
      } else {
        setError(result.message || t("failedToResetPassword"));
      }
    } catch (error) {
      console.error("Reset password error:", error);
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

  if (!token) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full space-y-8 md:bg-white p-8 md:rounded-lg md:shadow-lg text-center">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t("invalidResetLink")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t("resetLinkInvalidOrExpired")}
          </p>
          <Link
            href={`/${locale}/forgot-password`}
            className="font-medium text-orange-600 hover:text-orange-500"
          >
            {t("requestNewPasswordReset")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 md:bg-white p-8 md:rounded-lg md:shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t("resetYourPassword")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t("formInstructions")}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-orange-50 p-4">
              <div className="text-sm text-red-700">
                <div className="font-medium mb-2">{t("errorOccurred")}</div>
                <div className="text-xs text-red-600">{error}</div>
              </div>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">
                <div className="font-medium mb-2">
                  {t("passwordResetSuccess")}
                </div>
                <div className="text-xs text-green-600">
                  {t("redirectingToSignIn")}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                {t("newPassword")}
              </label>
              <input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                disabled={isLoading}
                {...register("newPassword", {
                  required: t("newPasswordRequired"),
                  minLength: {
                    value: 6,
                    message: t("passwordTooShort"),
                  },
                })}
                onChange={(e) => {
                  setValue("newPassword", e.target.value);
                  handleInputChange("newPassword");
                }}
                className={`bg-white mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:z-10 sm:text-sm ${
                  errors.newPassword
                    ? "border-orange-500 focus:ring-orange-500 focus:border-orange-500"
                    : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                } placeholder-gray-500 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder={t("enterNewPassword")}
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.newPassword.message}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                {t("passwordRequirements")}
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                {t("confirmNewPassword")}
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                disabled={isLoading}
                {...register("confirmPassword", {
                  required: t("confirmPasswordRequired"),
                  validate: (value) => {
                    if (value !== newPassword) {
                      return t("passwordsDoNotMatch");
                    }
                    return true;
                  },
                })}
                onChange={(e) => {
                  setValue("confirmPassword", e.target.value);
                  handleInputChange("confirmPassword");
                }}
                className={`bg-white mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:z-10 sm:text-sm ${
                  errors.confirmPassword
                    ? "border-orange-500 focus:ring-orange-500 focus:border-orange-500"
                    : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                } placeholder-gray-500 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder={t("confirmNewPassword")}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                {t("confirmPasswordInstructions")}
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              {isLoading ? t("resettingPassword") : t("resetPassword")}
            </button>
          </div>
        </form>

        <div className="text-center space-y-2">
          <Link
            href={`/${locale}/signin`}
            className={`block font-medium text-orange-600 hover:text-orange-500 ${
              isLoading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {t("backToSignIn")}
          </Link>
          <Link
            href={`/${locale}/forgot-password`}
            className={`block font-medium text-orange-600 hover:text-orange-500 ${
              isLoading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {t("requestNewPasswordReset")}
          </Link>
        </div>

        <div className="text-center">
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
