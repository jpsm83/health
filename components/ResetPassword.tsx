"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useSession, signOut } from "next-auth/react";
import resetPassword from "@/app/actions/auth/resetPassword";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormData {
  newPassword: string;
  confirmPassword: string;
}

interface ResetPasswordProps {
  locale: string;
  token?: string;
}

export default function ResetPassword({ locale, token: tokenProp }: ResetPasswordProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState(tokenProp || "");
  const t = useTranslations("ResetPassword");

  const { status } = useSession();
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

  // Update token if prop changes
  useEffect(() => {
    if (tokenProp) {
      setToken(tokenProp);
    }
  }, [tokenProp]);

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
                className={`${errors.newPassword ? "input-error" : "input-standard"} mt-1 appearance-none relative block w-full focus:z-10 sm:text-sm placeholder-gray-500 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed`}
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
                className={`${errors.confirmPassword ? "input-error" : "input-standard"} mt-1 appearance-none relative block w-full focus:z-10 sm:text-sm placeholder-gray-500 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed`}
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
            <Button
              type="submit"
              disabled={isLoading}
              variant="customDefault"
            >
              {isLoading ? (
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              ) : null}
              {isLoading ? t("resettingPassword") : t("resetPassword")}
            </Button>
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
