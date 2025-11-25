import { getTranslations } from "next-intl/server";
import confirmEmailAction, {
  ConfirmEmailResult,
} from "@/app/actions/auth/confirmEmail";
import ConfirmEmailUI from "@/components/ConfirmEmailUI";

interface ConfirmEmailSectionProps {
  locale: string;
  token?: string;
}

export default async function ConfirmEmailSection({
  locale,
  token,
}: ConfirmEmailSectionProps) {
  const t = await getTranslations({ locale, namespace: "confirmEmail" });

  // Handle missing token
  if (!token) {
    const errorResult: ConfirmEmailResult = {
      success: false,
      message: t("messages.noToken"),
      error: "MISSING_TOKEN",
    };

    return (
      <ConfirmEmailUI
        result={errorResult}
        initialStatus="error"
        translations={{
          success: {
            title: t("success.title"),
            signInButton: t("success.signInButton"),
          },
          error: {
            title: t("error.title"),
            backToSignInButton: t("error.backToSignInButton"),
          },
          messages: {
            noToken: t("messages.noToken"),
            confirmationFailed: t("messages.confirmationFailed"),
            unexpectedError: t("messages.unexpectedError"),
          },
        }}
      />
    );
  }

  try {
    // Call server action to confirm email
    const result = await confirmEmailAction(token);

    // Determine initial status based on result
    const initialStatus: "success" | "error" = result.success
      ? "success"
      : "error";

    return (
      <ConfirmEmailUI
        result={result}
        initialStatus={initialStatus}
        translations={{
          success: {
            title: t("success.title"),
            signInButton: t("success.signInButton"),
          },
          error: {
            title: t("error.title"),
            backToSignInButton: t("error.backToSignInButton"),
          },
          messages: {
            noToken: t("messages.noToken"),
            confirmationFailed: t("messages.confirmationFailed"),
            unexpectedError: t("messages.unexpectedError"),
          },
        }}
      />
    );
  } catch (error) {
    console.error("Error confirming email:", error);

    const errorResult: ConfirmEmailResult = {
      success: false,
      message: t("messages.unexpectedError"),
      error: "CONFIRMATION_FAILED",
    };

    return (
      <ConfirmEmailUI
        result={errorResult}
        initialStatus="error"
        translations={{
          success: {
            title: t("success.title"),
            signInButton: t("success.signInButton"),
          },
          error: {
            title: t("error.title"),
            backToSignInButton: t("error.backToSignInButton"),
          },
          messages: {
            noToken: t("messages.noToken"),
            confirmationFailed: t("messages.confirmationFailed"),
            unexpectedError: t("messages.unexpectedError"),
          },
        }}
      />
    );
  }
}

