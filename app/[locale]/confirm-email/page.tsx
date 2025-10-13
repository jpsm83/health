import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import ErrorBoundary from "@/components/ErrorBoundary";
import { getTranslations } from "next-intl/server";
import confirmEmailAction from "@/app/actions/auth/confirmEmail";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: { locale: string } | Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return generatePrivateMetadata(
    locale,
    "/confirm-email",
    "metadata.confirmEmail.title"
  );
}

// Server Component - handles email confirmation
export default async function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: { token?: string } | Promise<{ token?: string }>;
}) {
  const t = await getTranslations("confirmEmail");
  const { token } = await searchParams;

  let status: "success" | "error" = "error";
  let message = "";

  if (!token) {
    message = t("messages.noToken");
  } else {
    try {
      const result = await confirmEmailAction(token);
      
      if (result.success) {
        status = "success";
        message = result.message;
      } else {
        status = "error";
        message = result.message || t("messages.confirmationFailed");
      }
    } catch (error) {
      console.error("Error confirming email:", error);
      status = "error";
      message = t("messages.unexpectedError");
    }
  }

  return (
    <ErrorBoundary context={"ConfirmEmail component"}>
      <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {status === "success" && (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {t("success.title")}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{message}</p>
                <div className="mt-6">
                  <Link
                    href="/signin"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    {t("success.signInButton")}
                  </Link>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {t("error.title")}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{message}</p>
                <div className="mt-6">
                  <Link
                    href="/signin"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    {t("error.backToSignInButton")}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
